"use client"

import React, { useState } from 'react'
import { X, Calendar, Users, Heart, Star, MapPin, Clock, CreditCard, ChevronRight, Info } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useSaved } from './SavedContext'
import EnhancedPaymentModal from './EnhancedPaymentModal'
import Toast from './Toast'

interface EnhancedBookingModalProps {
  isOpen: boolean
  onClose: () => void
  village: any
  onBookingSuccess: () => void
}

export default function EnhancedBookingModal({
  isOpen,
  onClose,
  village,
  onBookingSuccess
}: EnhancedBookingModalProps) {
  const { user } = useAuth()
  const { toggleListing, isListingSaved } = useSaved()
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalNights: 0,
    totalAmount: 0
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, nights)
  }

  const calculateTotal = (nights: number, guests: number) => {
    return village.price * nights * guests
  }

  const handleDateChange = (field: 'checkIn' | 'checkOut', value: string) => {
    const newDetails = { ...bookingDetails, [field]: value }
    
    if (field === 'checkIn' && newDetails.checkOut && value > newDetails.checkOut) {
      newDetails.checkOut = ''
    }
    
    const nights = calculateNights(newDetails.checkIn, newDetails.checkOut)
    const total = calculateTotal(nights, newDetails.guests)
    
    setBookingDetails({
      ...newDetails,
      totalNights: nights,
      totalAmount: total
    })
  }

  const handleGuestChange = (newGuestCount: number) => {
    const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut)
    const total = calculateTotal(nights, newGuestCount)
    
    setBookingDetails({
      ...bookingDetails,
      guests: newGuestCount,
      totalAmount: total
    })
  }

  const handleSaveToggle = () => {
    toggleListing(village._id)
    setToast({ 
      message: isListingSaved(village._id) ? 'Removed from saved' : 'Saved to favorites', 
      type: 'success' 
    })
  }

  const handleContinueToPayment = () => {
    if (!user) {
      setToast({ message: 'Please sign in to book', type: 'error' })
      return
    }
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      setToast({ message: 'Please select check-in and check-out dates', type: 'error' })
      return
    }
    if (bookingDetails.totalNights <= 0) {
      setToast({ message: 'Check-out date must be after check-in date', type: 'error' })
      return
    }
    if (bookingDetails.guests < 1) {
      setToast({ message: 'Please select at least 1 guest', type: 'error' })
      return
    }
    
    setStep('payment')
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentId: string, method: string) => {
    setToast({ 
      message: `Payment successful via ${method}! Your booking is confirmed.`, 
      type: 'success' 
    })
    setShowPaymentModal(false)
    onClose()
    onBookingSuccess()
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

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-earth-100">
            <div>
              <h2 className="text-2xl font-bold text-earth-800">Book Your Stay</h2>
              <p className="text-earth-600 mt-1">Complete your booking details</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-earth-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-earth-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Village Info */}
            <div className="flex items-start gap-4 mb-8 p-6 bg-gradient-to-br from-earth-50 to-primary-50 rounded-2xl border border-earth-100">
              <div className="relative">
                <img
                  src={village.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                  alt={village.title}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
                <button
                  onClick={handleSaveToggle}
                  className={`absolute -top-2 -right-2 p-2 rounded-full shadow-lg transition-all ${
                    isListingSaved(village._id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-earth-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${
                    isListingSaved(village._id) ? 'fill-current' : ''
                  }`} />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-earth-800 mb-2">{village.title}</h3>
                <div className="flex items-center gap-4 text-sm text-earth-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{village.location?.village}, {village.location?.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{village.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  ₹{village.price?.toLocaleString()}/night
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-semibold text-earth-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Select Your Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={bookingDetails.checkIn}
                      onChange={(e) => handleDateChange('checkIn', e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={bookingDetails.checkOut}
                      onChange={(e) => handleDateChange('checkOut', e.target.value)}
                      min={bookingDetails.checkIn || getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Selection */}
              <div>
                <h3 className="text-lg font-semibold text-earth-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Number of Guests
                </h3>
                <div className="flex items-center justify-between p-4 bg-earth-50 rounded-xl border border-earth-200">
                  <div>
                    <div className="font-medium text-earth-800">Guests</div>
                    <div className="text-sm text-earth-600">Select number of guests</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGuestChange(Math.max(1, bookingDetails.guests - 1))}
                      className="w-10 h-10 rounded-full border-2 border-earth-300 flex items-center justify-center text-earth-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-xl font-bold text-earth-800">{bookingDetails.guests}</span>
                    <button
                      onClick={() => handleGuestChange(bookingDetails.guests + 1)}
                      className="w-10 h-10 rounded-full border-2 border-earth-300 flex items-center justify-center text-earth-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Duration Display */}
              {bookingDetails.totalNights > 0 && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">
                      {bookingDetails.totalNights} {bookingDetails.totalNights === 1 ? 'night' : 'nights'}
                    </div>
                    <div className="text-sm text-blue-600">
                      {bookingDetails.checkIn} to {bookingDetails.checkOut}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              {bookingDetails.totalAmount > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-primary-50 rounded-2xl p-6 border border-green-200">
                  <h4 className="font-bold text-earth-800 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary-600" />
                    Price Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-600">₹{village.price?.toLocaleString()} × {bookingDetails.totalNights} nights</span>
                      <span className="font-medium">₹{(village.price * bookingDetails.totalNights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-600">× {bookingDetails.guests} guests</span>
                      <span className="font-medium">₹{bookingDetails.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-green-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-xl">
                        <span className="text-earth-800">Total Amount</span>
                        <span className="text-primary-600">₹{bookingDetails.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-earth-300 text-earth-700 font-medium rounded-xl hover:bg-earth-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueToPayment}
                  disabled={!bookingDetails.checkIn || !bookingDetails.checkOut || bookingDetails.totalNights <= 0}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Continue to Payment
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <EnhancedPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={bookingDetails.totalAmount}
          bookingDetails={{
            villageName: village.title,
            checkIn: bookingDetails.checkIn,
            checkOut: bookingDetails.checkOut,
            guests: bookingDetails.guests,
            totalAmount: bookingDetails.totalAmount
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  )
}
