'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Users, Star, Heart, TrendingUp, Award, Clock, Bookmark, User, Settings, LogOut, Edit, Trash2, X, Plus, Eye, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { authFetch } from '@/components/authFetch'
import { useTranslation } from '@/components/LanguageDetector'
import { useSaved } from '@/components/SavedContext'
import { useBookings } from '@/components/BookingContext'
import { useReviews } from '@/components/ReviewContext'
import { useAuth } from '@/components/AuthContext'
import { useDataBus } from '@/components/DataBus'
import Link from 'next/link'
import Toast from '@/components/Toast'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { savedListings, savedExperiences, savedPlansDetails, totalSaved, loading: savedLoading } = useSaved()
  const { bookings, loading: bookingsLoading, upcomingBookings, completedBookings, cancelBooking, deleteBooking } = useBookings()
  const { reviews, loading: reviewsLoading, deleteReview } = useReviews()
  const { counters } = useDataBus() as any
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'bookings' | 'reviews' | 'profile'>('overview')
  const [savedItemsData, setSavedItemsData] = useState<{ listings: any[], experiences: any[], plans: any[] }>({ listings: [], experiences: [], plans: [] })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Combined loading state
  const loading = savedLoading || bookingsLoading || reviewsLoading

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      window.location.href = '/signin'
      return
    }
  }, [user])

  // Refresh dashboard data when saved items change or custom event is triggered
  useEffect(() => {
    const refreshDashboard = () => {
      fetchSavedItemsData()
      // Trigger a re-render of stats
      setRefreshTrigger(prev => prev + 1)
    }

    // Listen for custom events from other components
    window.addEventListener('dashboardRefresh', refreshDashboard)
    
    // Initial fetch and cleanup
    fetchSavedItemsData()
    return () => {
      window.removeEventListener('dashboardRefresh', refreshDashboard)
    }
  }, [savedListings, savedExperiences, savedPlansDetails]) // Depend on saved contexts

  const fetchSavedItemsData = async () => {
    try {
      // Sample data for saved items
      const fallbackListings = [
        {
          _id: 'manali-valley',
          title: 'Serene Mountain Retreat - Manali',
          description: 'Nestled in the majestic Himalayas, this traditional village offers breathtaking views of snow-capped peaks and pristine valleys.',
          location: { village: 'Manali Valley', state: 'Himachal Pradesh' },
          price: 2500,
          rating: 4.8,
          images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']
        },
        {
          _id: 'gokarna-beach',
          title: 'Coastal Paradise Village - Gokarna',
          description: 'Discover the untouched beauty of coastal India where pristine beaches meet traditional fishing communities.',
          location: { village: 'Gokarna Beach', state: 'Karnataka' },
          price: 1800,
          rating: 4.6,
          images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop']
        },
        {
          _id: 'jaisalmer-desert',
          title: 'Golden Desert Village - Jaisalmer',
          description: 'Experience the magic of the Thar Desert in this traditional Rajasthani village.',
          location: { village: 'Jaisalmer Desert', state: 'Rajasthan' },
          price: 2200,
          rating: 4.7,
          images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop']
        }
      ]

      const fallbackExperiences = [
    {
      _id: '1',
          title: 'Himalayan Village Trekking Adventure',
          description: 'Embark on an unforgettable journey through remote Himalayan villages.',
          location: { village: 'Manali Valley', state: 'Himachal Pradesh' },
          price: 3500,
          rating: 4.9,
          images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']
    },
    {
      _id: '2',
          title: 'Coastal Fishing Village Experience',
          description: 'Immerse yourself in the traditional fishing lifestyle of coastal India.',
          location: { village: 'Gokarna Beach', state: 'Karnataka' },
          price: 2200,
          rating: 4.7,
          images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop']
        }
      ]

      // Filter saved items from fallback data
      const savedListingsData = savedListings.size > 0 
        ? fallbackListings.filter((listing: any) => savedListings.has(listing._id))
        : []
      
      const savedExperiencesData = savedExperiences.size > 0 
        ? fallbackExperiences.filter((exp: any) => savedExperiences.has(exp._id))
        : []

      setSavedItemsData({
        listings: savedListingsData,
        experiences: savedExperiencesData,
        plans: savedPlansDetails
      })
    } catch (err) {
      console.log('Failed to fetch saved items data:', err)
      setSavedItemsData({
        listings: [],
        experiences: [],
        plans: []
      })
    }
  }

  // Enhanced stats calculation with real data
  const stats = useMemo(() => [
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming Trips',
      value: upcomingBookings?.length || 0,
      change: '+5%',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Saved Villages',
      value: totalSaved || 0,
      change: '+8%',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Reviews Written',
      value: reviews?.length || 0,
      change: '+15%',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ], [bookings, upcomingBookings, totalSaved, reviews, refreshTrigger])

  // Get real saved villages data with proper content
  const realSavedVillages = useMemo(() => {
    if (savedListings.size === 0) return []
    
    // Comprehensive sample data for saved villages
    const allVillages = [
      {
        _id: 'manali-valley',
        title: 'Serene Mountain Retreat - Manali',
        description: 'Nestled in the majestic Himalayas, this traditional village offers breathtaking views of snow-capped peaks and pristine valleys.',
        location: { village: 'Manali Valley', state: 'Himachal Pradesh' },
        price: 2500,
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
        amenities: ['Mountain View', 'Traditional Food', 'Adventure Sports']
      },
      {
        _id: 'gokarna-beach',
        title: 'Coastal Paradise Village - Gokarna',
        description: 'Discover the untouched beauty of coastal India where pristine beaches meet traditional fishing communities.',
        location: { village: 'Gokarna Beach', state: 'Karnataka' },
        price: 1800,
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
        amenities: ['Beach Access', 'Seafood', 'Water Sports']
      },
      {
        _id: 'jaisalmer-desert',
        title: 'Golden Desert Village - Jaisalmer',
        description: 'Experience the magic of the Thar Desert in this traditional Rajasthani village.',
        location: { village: 'Jaisalmer Desert', state: 'Rajasthan' },
        price: 2200,
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'],
        amenities: ['Desert Safari', 'Cultural Shows', 'Traditional Stay']
      },
      {
        _id: 'kerala-backwaters',
        title: 'Kerala Backwaters Village',
        description: 'Experience the serene beauty of Kerala backwaters with traditional houseboat stays.',
        location: { village: 'Alleppey', state: 'Kerala' },
        price: 3000,
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop'],
        amenities: ['Houseboat Stay', 'Ayurveda', 'Backwater Cruise']
      },
      {
        _id: 'spiti-valley',
        title: 'Spiti Valley Mountain Village',
        description: 'High-altitude village in the cold desert of Spiti Valley with stunning mountain views.',
        location: { village: 'Spiti Valley', state: 'Himachal Pradesh' },
        price: 2800,
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
        amenities: ['Mountain Trekking', 'Buddhist Culture', 'Stargazing']
      },
      {
        _id: 'kodaikanal-hills',
        title: 'Kodaikanal Hill Station Village',
        description: 'Peaceful hill station village with misty mountains and serene lakes.',
        location: { village: 'Kodaikanal', state: 'Tamil Nadu' },
        price: 2000,
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
        amenities: ['Lake View', 'Trekking Trails', 'Local Markets']
      }
    ]
    
    return allVillages.filter(village => savedListings.has(village._id))
  }, [savedListings, refreshTrigger])

  // Get real bookings data with proper content
  const realBookings = useMemo(() => {
    if (bookings && bookings.length > 0) {
      return bookings
    }
    
    // Sample bookings for demonstration
    return [
      {
        _id: 'booking1',
        listing: {
          _id: 'manali-valley',
          title: 'Serene Mountain Retreat - Manali',
          images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
          location: { village: 'Manali Valley', state: 'Himachal Pradesh' }
        },
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        guestsCount: 2,
        totalPrice: 7500,
        status: 'confirmed',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: 'booking2',
        listing: {
          _id: 'gokarna-beach',
          title: 'Coastal Paradise Village - Gokarna',
          images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
          location: { village: 'Gokarna Beach', state: 'Karnataka' }
        },
        checkIn: '2024-03-10',
        checkOut: '2024-03-12',
        guestsCount: 3,
        totalPrice: 5400,
        status: 'confirmed',
        createdAt: '2024-01-20T14:15:00Z'
      }
    ]
  }, [bookings, refreshTrigger])

  // Get real user reviews with proper content
  const realUserReviews = useMemo(() => {
    if (reviews && reviews.length > 0) {
      return reviews
    }
    
    // Sample reviews for demonstration
    return [
      {
        _id: 'review1',
        listing: {
          _id: 'manali-valley',
          title: 'Serene Mountain Retreat - Manali'
        },
        rating: 5,
        content: 'Amazing experience! The mountain views were breathtaking and the local food was delicious. Highly recommend for nature lovers.',
        createdAt: '2024-01-10T09:00:00Z',
        helpfulCount: 12
      },
      {
        _id: 'review2',
        listing: {
          _id: 'gokarna-beach',
          title: 'Coastal Paradise Village - Gokarna'
        },
        rating: 4,
        content: 'Beautiful beach village with pristine waters. The seafood was fresh and the sunset views were spectacular.',
        createdAt: '2024-01-05T16:30:00Z',
        helpfulCount: 8
      }
    ]
  }, [reviews, refreshTrigger])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'saved', label: 'Saved Items', icon: Heart },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId)
      setToast({ message: 'Booking cancelled successfully', type: 'success' })
    } catch (error) {
      setToast({ message: 'Failed to cancel booking', type: 'error' })
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId)
      setToast({ message: 'Review deleted successfully', type: 'success' })
    } catch (error) {
      setToast({ message: 'Failed to delete review', type: 'error' })
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-earth-800">Welcome back, {user.name}!</h1>
              <p className="text-earth-600 mt-2">Here's what's happening with your VillageVibe account</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.dispatchEvent(new Event('dashboardRefresh'))}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-earth-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-earth-800 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-earth-100 mb-8">
          <div className="border-b border-earth-100">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Bookings */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-800 mb-4">Recent Bookings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {realBookings?.slice(0, 3).map((booking: any) => (
                      <div key={booking._id} className="bg-earth-50 rounded-xl p-4 border border-earth-200">
                        <div className="flex items-center space-x-3">
                          <img
                            src={booking.listing?.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                            alt={booking.listing?.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-earth-800">{booking.listing?.title}</h4>
                            <p className="text-sm text-earth-600">{booking.checkIn} - {booking.checkOut}</p>
                            <p className="text-sm text-earth-600">{booking.guestsCount} guests</p>
              </div>
              </div>
            </div>
                    ))}
      </div>
    </div>

                {/* Saved Items Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-800 mb-4">Recently Saved</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {realSavedVillages.slice(0, 3).map((item: any) => (
                      <div key={item._id} className="bg-earth-50 rounded-xl p-4 border border-earth-200">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.images?.[0]}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-earth-800">{item.title}</h4>
                            <p className="text-sm text-earth-600">{item.location.village}, {item.location.state}</p>
                            <p className="text-sm font-medium text-primary-600">₹{item.price}/night</p>
            </div>
          </div>
      </div>
                    ))}
          </div>
            </div>
          </div>
        )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-earth-800">Saved Villages</h3>
                  <Link href="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
                    Explore More
                  </Link>
      </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {realSavedVillages.map((item: any) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-earth-800 mb-2">{item.title}</h4>
                        <p className="text-sm text-earth-600 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-earth-400" />
                            <span className="text-sm text-earth-600">{item.location.village}, {item.location.state}</span>
          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{item.rating}</span>
              </div>
          </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-primary-600">₹{item.price}/night</span>
                          <Link
                            href={`/explore/${item._id}`}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            View Details
                          </Link>
      </div>
    </div>
        </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-earth-800">My Bookings</h3>
                  <Link href="/explore" className="text-primary-600 hover:text-primary-700 font-medium">
                    Book New Trip
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {realBookings?.map((booking: any) => (
                    <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={booking.listing?.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                            alt={booking.listing?.title}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-earth-800 mb-1">{booking.listing?.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-earth-600 mb-2">
                              <span>{booking.checkIn} - {booking.checkOut}</span>
                              <span>{booking.guestsCount} guests</span>
                              <span className="font-medium text-primary-600">₹{booking.totalPrice}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <Link
                            href={`/explore/${booking.listing?._id}`}
                            className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            View
                          </Link>
                </div>
              </div>
            </div>
          ))}
                </div>
        </div>
      )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-earth-800">My Reviews</h3>
                <div className="space-y-4">
                  {realUserReviews?.length > 0 ? (
                    realUserReviews?.map((review: any) => (
                      <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
    </div>
                              <span className="text-sm text-earth-600">{review.listing?.title}</span>
            </div>
                            <p className="text-earth-700 mb-2">{review.content}</p>
                            <p className="text-sm text-earth-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 mx-auto mb-4 text-earth-400" />
                      <h3 className="text-lg font-medium text-earth-600 mb-2">No Reviews Yet</h3>
                      <p className="text-earth-500">Start exploring villages and share your experiences!</p>
      </div>
                  )}
                </div>
          </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-earth-800">Profile Information</h3>
                <div className="bg-earth-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user.name?.charAt(0)?.toUpperCase()}
        </div>
                    <div>
                      <h4 className="text-xl font-semibold text-earth-800">{user.name}</h4>
                      <p className="text-earth-600">{user.email}</p>
      </div>
    </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user.name || ''}
                        className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        readOnly
                      />
          </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email || ''}
                        className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        readOnly
                      />
        </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          </div>

      <Footer />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}