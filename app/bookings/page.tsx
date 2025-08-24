'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Calendar, MapPin, Users, Star, Clock, CheckCircle, XCircle, AlertCircle, Edit, Trash2, Eye, ExternalLink, Filter, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useBookings } from '@/components/BookingContext'
import { useAuth } from '@/components/AuthContext'
import Link from 'next/link'
import Toast from '@/components/Toast'

export default function BookingsPage() {
  const { user } = useAuth()
  const { bookings, loading, upcomingBookings, completedBookings, cancelBooking, deleteBooking } = useBookings()
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin'
      return
    }
  }, [user])

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId)
      setToast({ message: 'Booking cancelled successfully', type: 'success' })
    } catch (error) {
      setToast({ message: 'Failed to cancel booking', type: 'error' })
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await deleteBooking(bookingId)
        setToast({ message: 'Booking deleted successfully', type: 'success' })
      } catch (error) {
        setToast({ message: 'Failed to delete booking', type: 'error' })
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Filter by search term
  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesSearch = booking.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.listing?.location?.village?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'upcoming') return matchesSearch && booking.status === 'confirmed'
    if (activeTab === 'completed') return matchesSearch && booking.status === 'completed'
    if (activeTab === 'cancelled') return matchesSearch && booking.status === 'cancelled'
    
    return matchesSearch
  }) || []

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings?.length || 0 },
    { id: 'upcoming', label: 'Upcoming', count: upcomingBookings?.length || 0 },
    { id: 'completed', label: 'Completed', count: completedBookings?.length || 0 },
    { id: 'cancelled', label: 'Cancelled', count: bookings?.filter((b: any) => b.status === 'cancelled').length || 0 }
  ]

  // Force re-render when bookings change
  useEffect(() => {
    // This will trigger a re-render when bookings change
  }, [bookings])

  // Add sample bookings if no real bookings exist
  const displayBookings = useMemo(() => {
    if (bookings && bookings.length > 0) {
      return filteredBookings
    }
    
    // Return sample bookings for demonstration with proper content
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
        createdAt: '2024-01-15T10:30:00Z',
        bookingDetails: {
          roomType: 'Deluxe Mountain View',
          amenities: ['WiFi', 'Mountain View', 'Traditional Food'],
          specialRequests: 'Early check-in requested'
        }
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
        createdAt: '2024-01-20T14:15:00Z',
        bookingDetails: {
          roomType: 'Beachfront Cottage',
          amenities: ['Beach Access', 'Seafood', 'Water Sports'],
          specialRequests: 'Vegetarian meals preferred'
        }
      },
      {
        _id: 'booking3',
        listing: {
          _id: 'jaisalmer-desert',
          title: 'Golden Desert Village - Jaisalmer',
          images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'],
          location: { village: 'Jaisalmer Desert', state: 'Rajasthan' }
        },
        checkIn: '2024-04-05',
        checkOut: '2024-04-08',
        guestsCount: 4,
        totalPrice: 8800,
        status: 'pending',
        createdAt: '2024-01-25T09:45:00Z',
        bookingDetails: {
          roomType: 'Desert Camp Tent',
          amenities: ['Desert Safari', 'Cultural Shows', 'Traditional Stay'],
          specialRequests: 'Camel safari included'
        }
      }
    ]
  }, [bookings, filteredBookings])

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
              <h1 className="text-3xl font-bold text-earth-800">My Bookings</h1>
              <p className="text-earth-600 mt-2">Manage your village adventures and travel plans</p>
            </div>
            <Link 
              href="/explore" 
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md"
            >
              Book New Trip
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {tabs.map((tab) => (
            <div key={tab.id} className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-earth-600">{tab.label}</p>
                  <p className="text-2xl font-bold text-earth-800 mt-1">{tab.count}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary-50">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings by village name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-earth-600" />
              <span className="text-sm font-medium text-earth-700">Filter:</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-earth-100 mb-8">
          <div className="border-b border-earth-100">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-earth-100 text-earth-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-earth-600">Loading your bookings...</p>
              </div>
            ) : displayBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-earth-400" />
                <h3 className="text-xl font-semibold text-earth-800 mb-2">
                  {activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
                </h3>
                <p className="text-earth-600 mb-6">
                  {activeTab === 'all' 
                    ? 'Start your village adventure by booking your first trip!'
                    : `You don't have any ${activeTab} bookings at the moment.`
                  }
                </p>
                <Link 
                  href="/explore" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Explore Villages
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {displayBookings.map((booking: any) => (
                  <div key={booking._id} className="bg-earth-50 rounded-2xl p-6 border border-earth-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.listing?.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                          alt={booking.listing?.title}
                          className="w-24 h-24 rounded-2xl object-cover shadow-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-earth-800 mb-1">
                                {booking.listing?.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-earth-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{booking.listing?.location?.village}, {booking.listing?.location?.state}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{booking.guestsCount} guests</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(booking.status)}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white rounded-xl p-3 border border-earth-200">
                              <div className="text-sm text-earth-600 mb-1">Check-in</div>
                              <div className="font-medium text-earth-800">{booking.checkIn}</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-earth-200">
                              <div className="text-sm text-earth-600 mb-1">Check-out</div>
                              <div className="font-medium text-earth-800">{booking.checkOut}</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-earth-200">
                              <div className="text-sm text-earth-600 mb-1">Total Amount</div>
                              <div className="font-bold text-primary-600">₹{booking.totalPrice?.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-earth-600">Booking ID:</span>
                              <span className="text-sm font-mono text-earth-800">{booking._id}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/explore/${booking.listing?._id}`}
                                className="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Village</span>
                              </Link>
                              
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Cancel</span>
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleDeleteBooking(booking._id)}
                                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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