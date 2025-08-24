'use client'

import React, { useState } from 'react'
import { X, Calendar, Users, CreditCard, Heart, Star, MapPin, Clock } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { useBookings } from '@/components/BookingContext'
import { useSaved } from '@/components/SavedContext'
import Toast from '@/components/Toast'

interface BookingModalProps {
  listing: any
  onClose: () => void
  onBookingSuccess: () => void
}

const BookingModal = ({ listing, onClose, onBookingSuccess }: BookingModalProps) => {
  const { user } = useAuth()
  const { addBooking } = useBookings()
  const { toggleListing, toggleExperience, isListingSaved, isExperienceSaved } = useSaved()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, nights)
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    return listing.price * nights * parseInt(guests)
  }

  const handleSaveToggle = () => {
    if (listing.type === 'experience') {
      toggleExperience(listing._id)
    } else {
      toggleListing(listing._id)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      setToast({ message: 'Please sign in to book', type: 'error' })
      return
    }
    if (!checkIn || !checkOut) {
      setToast({ message: 'Please select check-in and check-out dates', type: 'error' })
      return
    }
    if (calculateNights() <= 0) {
      setToast({ message: 'Check-out date must be after check-in date', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const bookingData = {
        listing: {
          _id: listing._id,
          title: listing.title,
          images: listing.images,
          location: listing.location
        },
        checkIn,
        checkOut,
        guestsCount: parseInt(guests),
        totalPrice: calculateTotal(),
        status: 'confirmed' as const
      }
      
      console.log('Sending booking data:', bookingData)
      
      addBooking(bookingData)
      setToast({ message: 'Booking created successfully!', type: 'success' })
      onBookingSuccess()
      onClose()
    } catch (error) {
      console.error('Booking error:', error)
      setToast({ message: 'Failed to create booking. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleStripePayment = async () => {
    if (!user) {
      setToast({ message: 'Please sign in to make payment', type: 'error' })
      return
    }
    if (!checkIn || !checkOut) {
      setToast({ message: 'Please select check-in and check-out dates', type: 'error' })
      return
    }
    if (calculateNights() <= 0) {
      setToast({ message: 'Check-out date must be after check-in date', type: 'error' })
      return
    }

    setPaymentLoading(true)
    try {
      // First create booking
      const bookingData = {
        listing: {
          _id: listing._id,
          title: listing.title,
          images: listing.images,
          location: listing.location
        },
        checkIn,
        checkOut,
        guestsCount: parseInt(guests),
        totalPrice: calculateTotal(),
        status: 'confirmed' as const
      }
      
      addBooking(bookingData)

      // Then redirect to Stripe checkout
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const res = await fetch(`${baseUrl}/payments/stripe/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: calculateTotal() * 100, // Convert to cents
          currency: 'inr',
          metadata: {
            listingId: listing._id,
            type: listing.type || 'listing'
          }
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setToast({ message: 'Payment initiated successfully!', type: 'success' })
          setTimeout(() => {
            onBookingSuccess()
          }, 1500)
        }
      } else {
        throw new Error('Failed to initiate payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setToast({ message: 'Failed to process payment. Please try again.', type: 'error' })
    } finally {
      setPaymentLoading(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    return maxDate.toISOString().split('T')[0]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-earth-200">
          <h2 className="text-2xl font-bold text-earth-800">Book Your Stay</h2>
          <button onClick={onClose} className="p-2 hover:bg-earth-100 rounded-full">
            <X className="w-6 h-6 text-earth-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Listing Info */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-earth-50 rounded-xl">
            <div className="relative">
              <img
                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                alt={listing.title}
                className="w-20 h-20 rounded-lg object-cover"
                style={{ width: 'auto', height: 'auto' }}
              />
              <button
                onClick={handleSaveToggle}
                className={`absolute -top-2 -right-2 p-1 rounded-full shadow-md ${
                  (listing.type === 'experience' ? isExperienceSaved(listing._id) : isListingSaved(listing._id))
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-earth-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${
                  (listing.type === 'experience' ? isExperienceSaved(listing._id) : isListingSaved(listing._id))
                    ? 'fill-current'
                    : ''
                }`} />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-earth-800 mb-2">{listing.title}</h3>
              <div className="flex items-center gap-4 text-sm text-earth-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location?.village}, {listing.location?.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{listing.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary-600 mt-2">
                ₹{listing.price?.toLocaleString()}/night
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || getMinDate()}
                max={getMaxDate()}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Number of Guests</label>
              <div className="flex items-center border border-earth-300 rounded-lg">
                <button
                  onClick={() => setGuests(Math.max(1, parseInt(guests) - 1).toString())}
                  className="px-3 py-2 text-earth-600 hover:bg-earth-50"
                >
                  -
                </button>
                <span className="px-4 py-2 text-earth-800 font-medium">{guests}</span>
                <button
                  onClick={() => setGuests((parseInt(guests) + 1).toString())}
                  className="px-3 py-2 text-earth-600 hover:bg-earth-50"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Duration</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-earth-50 rounded-lg">
                <Clock className="w-4 h-4 text-earth-500" />
                <span className="text-earth-700">
                  {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-earth-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-earth-800 mb-3">Price Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>₹{listing.price?.toLocaleString()} × {calculateNights()} nights</span>
                <span>₹{(listing.price * calculateNights()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>× {guests} guests</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="border-t border-earth-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 bg-earth-600 hover:bg-earth-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Booking...' : 'Book Without Payment'}
            </button>
            <button
              onClick={handleStripePayment}
              disabled={paymentLoading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {paymentLoading ? 'Processing...' : 'Pay with Card'}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default BookingModal

