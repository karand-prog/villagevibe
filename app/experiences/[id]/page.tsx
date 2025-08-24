'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { MapPin, Star, Clock, Users, Heart, Share2, X, Calendar, CheckCircle } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import { useSaved } from '@/components/SavedContext'
import Toast from '@/components/Toast'
import { useAuth } from '@/components/AuthContext'
import ReviewsSection from '@/components/ReviewsSection'
import StrongMap from '@/components/StrongMap'
import { useBookings } from '@/components/BookingContext'

type Experience = {
  id: string
  title: string
  description: string
  village: string
  state: string
  price: number
  duration: string
  rating: number
  reviews: number
  image: string
  category: string
  difficulty: string
  maxParticipants: number
  included: string[]
  schedule: string[]
  location?: {
    type: string
    coordinates: [number, number]
  }
}

export default function ExperienceDetailsPage() {
  const params = useParams()
  const search = useSearchParams()
  const id = params.id as string
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { savedExperiences, toggleExperience } = useSaved()
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const [showBooking, setShowBooking] = useState<boolean>(false)
  const { user } = useAuth()
  const { addBooking } = useBookings()
  const [bookingData, setBookingData] = useState({
    date: '',
    participants: 1,
    totalPrice: 0
  })
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/experiences')
        if (!res.ok) throw new Error('Failed to load')
        const all: Experience[] = await res.json()
        const item = all.find(e => e.id === id) || null
        setExperience(item)
      } catch (e) {
        setError('Unable to load this experience right now.')
        // Fallback sample experiences with diverse content
        const sampleExperiences: Experience[] = [
          {
            id: 'rajasthan-cooking',
            title: 'Traditional Rajasthani Cooking Workshop',
            description: 'Learn to cook authentic Rajasthani dishes from local experts. Discover the secrets of traditional spices, cooking techniques, and family recipes passed down through generations.',
            village: 'Pushkar',
            state: 'Rajasthan',
            price: 1200,
            duration: '4 hours',
            rating: 4.8,
            reviews: 45,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
            category: 'Cooking',
            difficulty: 'Beginner',
            maxParticipants: 8,
            included: ['All ingredients', 'Recipe booklet', 'Traditional utensils', 'Local spices', 'Refreshments'],
            schedule: ['9:00 AM - Welcome and introduction', '9:30 AM - Spice preparation', '10:00 AM - Main dish cooking', '11:30 AM - Side dish preparation', '12:30 PM - Meal and sharing'],
            location: {
              type: 'Point',
              coordinates: [26.4897, 74.5511]
            }
          },
          {
            id: 'kerala-fishing',
            title: 'Kerala Backwaters Fishing Experience',
            description: 'Experience traditional fishing techniques in the serene backwaters of Kerala. Learn from local fishermen, understand sustainable fishing practices, and enjoy the peaceful waters.',
            village: 'Alleppey',
            state: 'Kerala',
            price: 1800,
            duration: '6 hours',
            rating: 4.7,
            reviews: 38,
            image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
            category: 'Fishing',
            difficulty: 'Intermediate',
            maxParticipants: 6,
            included: ['Fishing equipment', 'Traditional boat', 'Local guide', 'Safety gear', 'Traditional lunch'],
            schedule: ['6:00 AM - Meet at fishing village', '6:30 AM - Boat preparation', '7:00 AM - Fishing techniques', '10:00 AM - Traditional lunch', '11:00 AM - Return journey'],
            location: {
              type: 'Point',
              coordinates: [9.4981, 76.3388]
            }
          },
          {
            id: 'himachal-trekking',
            title: 'Himalayan Village Trekking Adventure',
            description: 'Embark on a guided trek through pristine Himalayan villages. Experience local mountain culture, learn about traditional farming, and enjoy breathtaking mountain views.',
            village: 'Manali',
            state: 'Himachal Pradesh',
            price: 2500,
            duration: '8 hours',
            rating: 4.9,
            reviews: 52,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            category: 'Trekking',
            difficulty: 'Advanced',
            maxParticipants: 10,
            included: ['Professional guide', 'Safety equipment', 'Mountain gear', 'Local snacks', 'Photography'],
            schedule: ['7:00 AM - Trek briefing', '7:30 AM - Start trek', '10:00 AM - Village visit', '12:00 PM - Mountain lunch', '3:00 PM - Return trek'],
            location: {
              type: 'Point',
              coordinates: [32.2432, 77.1892]
            }
          },
          {
            id: 'goa-seafood',
            title: 'Goan Seafood Cooking Masterclass',
            description: 'Master the art of Goan seafood cooking with local chefs. Learn to prepare traditional dishes using fresh local ingredients and authentic Portuguese-Indian techniques.',
            village: 'Anjuna',
            state: 'Goa',
            price: 1600,
            duration: '5 hours',
            rating: 4.6,
            reviews: 41,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
            category: 'Cooking',
            difficulty: 'Intermediate',
            maxParticipants: 6,
            included: ['Fresh seafood', 'Local spices', 'Cooking equipment', 'Recipe cards', 'Goan lunch'],
            schedule: ['8:00 AM - Market visit', '9:00 AM - Ingredient selection', '9:30 AM - Cooking session', '12:00 PM - Lunch preparation', '1:00 PM - Feast and sharing'],
            location: {
              type: 'Point',
              coordinates: [15.5833, 73.7500]
            }
          },
          {
            id: 'tamilnadu-crafts',
            title: 'Chettinad Traditional Crafts Workshop',
            description: 'Discover the rich heritage of Chettinad crafts. Learn traditional weaving, pottery, and woodwork techniques from master artisans in this historic region.',
            village: 'Karaikudi',
            state: 'Tamil Nadu',
            price: 1400,
            duration: '6 hours',
            rating: 4.5,
            reviews: 29,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
            category: 'Crafts',
            difficulty: 'Beginner',
            maxParticipants: 8,
            included: ['Craft materials', 'Traditional tools', 'Expert guidance', 'Take-home project', 'Local tea'],
            schedule: ['9:00 AM - Heritage introduction', '9:30 AM - Tool demonstration', '10:00 AM - Craft practice', '12:00 PM - Traditional lunch', '2:00 PM - Project completion'],
            location: {
              type: 'Point',
              coordinates: [10.0667, 78.7833]
            }
          }
        ]
        const fallbackItem = sampleExperiences.find(e => e.id === id) || sampleExperiences[0]
        setExperience(fallbackItem)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchOne()
  }, [id])

  useEffect(() => {
    if (search.get('book') === '1') {
      setShowBooking(true)
    }
  }, [search])

  const calculateTotal = () => {
    if (!experience || !bookingData.date) return 0
    return experience.price * bookingData.participants
  }

  const handleBooking = async () => {
    if (!user) {
      setToast({ message: 'Please sign in to book this experience', type: 'error' })
      return
    }
    if (!experience) {
      setToast({ message: 'Experience not found', type: 'error' })
      return
    }
    if (!bookingData.date) {
      setToast({ message: 'Please select a date', type: 'error' })
      return
    }
    setBookingLoading(true)
    try {
      // Create booking data
      const bookingDataToSend = {
        listing: {
          _id: experience.id,
          title: experience.title,
          images: [experience.image],
          location: {
            village: experience.village,
            state: experience.state
          }
        },
        checkIn: bookingData.date,
        checkOut: bookingData.date, // Same day for experiences
        guestsCount: bookingData.participants,
        totalPrice: bookingData.totalPrice,
        status: 'confirmed' as const
      }
      
      addBooking(bookingDataToSend)
      
      setToast({ message: 'Experience booked successfully! Redirecting to bookings...', type: 'success' })
      setShowBooking(false)
      setBookingData({ date: '', participants: 1, totalPrice: 0 })
      
      // Redirect to bookings page after a short delay
      setTimeout(() => {
        window.location.href = '/bookings?status=success'
      }, 2000)
    } catch (error) {
      console.error('Booking error:', error)
      setToast({ message: 'Booking failed. Please try again.', type: 'error' })
    } finally {
      setBookingLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: experience?.title,
        text: experience?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setToast({ message: 'Link copied to clipboard!', type: 'success' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Experience not found</h1>
          <p className="text-earth-600">{error || 'The experience you are looking for does not exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="hero-modern">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl font-display font-bold mb-3">{experience.title}</h1>
              <div className="flex items-center text-earth-600 mb-3">
                <MapPin className="w-5 h-5 mr-2" />
                {experience.village}, {experience.state}
              </div>
              <div className="flex items-center mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold mr-2">{experience.rating}</span>
                <span className="text-earth-600">({experience.reviews} reviews)</span>
              </div>
              <p className="text-earth-700 mb-6">{experience.description}</p>
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => {
                  if (!user) {
                    setToast({ message: 'Please sign in to book experiences', type: 'error' })
                    return
                  }
                  setShowBooking(true)
                }}>Book Now</button>
                <button
                  className={`btn-secondary ${savedExperiences.has(experience.id) ? 'bg-primary-600 text-white' : ''}`}
                  onClick={() => {
                    toggleExperience(experience.id)
                    setToast({ message: savedExperiences.has(experience.id) ? 'Removed from saved' : 'Saved to favorites', type: 'success' })
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" /> {savedExperiences.has(experience.id) ? 'Saved' : 'Save'}
                </button>
                <button className="btn-secondary" onClick={handleShare}><Share2 className="w-4 h-4 mr-2" /> Share</button>
              </div>
            </div>
            <div className="relative">
              <Image src={experience.image} alt={experience.title} width={640} height={420} className="rounded-2xl shadow-lg object-cover w-full h-auto" style={{ width: 'auto', height: 'auto' }} />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">₹{experience.price}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">About this experience</h2>
            <p className="text-earth-700 mb-6">{experience.description}</p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-earth-600 mr-3" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-earth-600">{experience.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-earth-600 mr-3" />
                <div>
                  <p className="font-medium">Max participants</p>
                  <p className="text-sm text-earth-600">{experience.maxParticipants}</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">What's included</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {experience.included.map((inc) => (
                <span key={inc} className="badge">{inc}</span>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-3">Schedule</h3>
            <ul className="list-disc ml-5 space-y-1 text-earth-700">
              {experience.schedule.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            {/* Location Map */}
            {Array.isArray(experience.location?.coordinates) && experience.location.coordinates.length === 2 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <StrongMap
                  lat={experience.location.coordinates[0]}
                  lng={experience.location.coordinates[1]}
                  title={experience.title}
                />
              </div>
            )}

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Traveler thoughts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{
                  name: 'Ananya', quote: 'Hands-on and friendly. I learned so much in just a few hours!'
                },{
                  name: 'Rohan', quote: 'Felt authentic and respectful to local traditions.'
                }].map((t, i) => (
                  <div key={i} className="card p-5">
                    <div className="italic text-earth-700 mb-2">"{t.quote}"</div>
                    <div className="text-sm text-earth-600">— {t.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-2xl font-bold text-earth-800">₹{experience.price}</div>
              <div className="text-sm text-earth-600 mb-4">per person</div>
              <button className="btn-primary w-full" onClick={() => {
                if (!user) {
                  setToast({ message: 'Please sign in to book experiences', type: 'error' })
                  return
                }
                setShowBooking(true)
              }}>Book Now</button>
              <div className="mt-4 text-sm text-earth-600">Free cancellation up to 24h before</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection listingId={id} />

      <Footer />

      {/* Booking Modal */}
      {showBooking && experience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-earth-200">
              <h2 className="text-xl font-semibold text-earth-800">Book Experience</h2>
              <button onClick={() => setShowBooking(false)} className="p-2 hover:bg-earth-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-earth-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Experience Summary */}
              <div className="flex items-start space-x-4 p-4 bg-earth-50 rounded-lg">
                <img src={experience.image} alt={experience.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-earth-800">{experience.title}</h3>
                  <div className="flex items-center text-earth-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {experience.village}, {experience.state}
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{experience.rating}</span>
                    <span className="text-sm text-earth-600 ml-1">({experience.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary-600">₹{experience.price}</div>
                  <div className="text-sm text-earth-600">per person</div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Number of Participants</label>
                <div className="flex items-center space-x-4">
                  <Users className="w-5 h-5 text-earth-600" />
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setBookingData(prev => ({ ...prev, participants: Math.max(1, prev.participants - 1) }))}
                      disabled={bookingData.participants <= 1}
                      className="w-8 h-8 rounded-full border border-earth-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-earth-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{bookingData.participants}</span>
                    <button
                      onClick={() => setBookingData(prev => ({ ...prev, participants: Math.min(experience.maxParticipants, prev.participants + 1) }))}
                      disabled={bookingData.participants >= experience.maxParticipants}
                      className="w-8 h-8 rounded-full border border-earth-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-earth-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-earth-600">Max {experience.maxParticipants} people</span>
                </div>
              </div>

              {/* Price Summary */}
              {bookingData.date && (
                <div className="bg-earth-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-earth-800 mb-3">Price Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>₹{experience.price} × {bookingData.participants} participants</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="border-t border-earth-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!bookingData.date || bookingLoading}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Book Experience - ₹{calculateTotal().toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}


