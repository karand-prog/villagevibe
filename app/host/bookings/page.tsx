"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/AuthContext'
import { authFetch } from '@/components/authFetch'
import { Calendar, MapPin, Users, DollarSign, CheckCircle, Clock, X, Star, Eye, MessageCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Booking {
  _id: string
  listing: {
    _id: string
    title: string
    images: string[]
    location: {
      village: string
      state: string
    }
  }
  guest: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  paymentStatus: 'pending' | 'completed' | 'failed'
}

const HostBookingsPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Sample data for development
  const sampleBookings: Booking[] = [
    {
      _id: '1',
      listing: {
        _id: 'listing1',
        title: 'Traditional Village Homestay',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
        location: { village: 'Pushkar', state: 'Rajasthan' }
      },
      guest: {
        _id: 'guest1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      guests: 2,
      totalPrice: 4500,
      status: 'confirmed',
      createdAt: '2024-01-20T10:30:00Z',
      paymentStatus: 'completed'
    },
    {
      _id: '2',
      listing: {
        _id: 'listing2',
        title: 'Desert Camp Experience',
        images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop'],
        location: { village: 'Jaisalmer', state: 'Rajasthan' }
      },
      guest: {
        _id: 'guest2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      checkIn: '2024-02-20',
      checkOut: '2024-02-22',
      guests: 3,
      totalPrice: 6000,
      status: 'pending',
      createdAt: '2024-01-22T14:15:00Z',
      paymentStatus: 'pending'
    }
  ]

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated])

  const fetchBookings = async () => {
    try {
      setError(null)
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/host/bookings`)
      
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
        setFilteredBookings(data)
      } else {
          throw new Error('Failed to fetch bookings')
        }
      } catch (err) {
      console.error('Error fetching bookings:', err)
        if (process.env.NODE_ENV !== 'production') {
        setBookings(sampleBookings)
        setFilteredBookings(sampleBookings)
        } else {
          setError('Failed to load bookings. Please try again later.')
        }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    if (status === 'all') {
      setFilteredBookings(bookings)
    } else {
      const filtered = bookings.filter(booking => booking.status === status)
      setFilteredBookings(filtered)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-earth-50">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-earth-800 mb-4">Please sign in to view your bookings</h1>
            <p className="text-earth-600">You need to be authenticated to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            My Bookings
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Manage and track all bookings for your village listings.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container-custom py-4">
          <div className="bg-red-100 text-red-700 p-4 rounded text-center">{error}</div>
        </div>
      )}

      {/* Bookings List */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-earth-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-earth-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Listing Image */}
                      <div className="lg:w-48 h-32 lg:h-auto">
                        <Image
                          src={booking.listing.images[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'}
                          alt={booking.listing.title}
                          width={192}
                          height={128}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-earth-800 mb-2">
                              {booking.listing.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-earth-400" />
                                <span className="text-sm text-earth-600">
                                  {booking.listing.location.village}, {booking.listing.location.state}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-earth-400" />
                                <span className="text-sm text-earth-600">{booking.guests} guests</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-earth-400" />
                                <span className="text-sm text-earth-600">
                                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-earth-400" />
                                <span className="text-sm font-semibold text-primary-600">
                                  ₹{booking.totalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Guest Info */}
                          <div className="lg:text-right">
                            <div className="flex items-center gap-3 mb-2">
                        <Image 
                            src={booking.guest.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                                alt={booking.guest.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div>
                                <p className="font-medium text-earth-800">{booking.guest.name}</p>
                                <p className="text-sm text-earth-600">{booking.guest.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-earth-200">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            {booking.paymentStatus === 'completed' && (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Paid
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="btn-secondary">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </button>
                            <button className="btn-primary">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-earth-800 mb-2">No bookings found</h3>
              <p className="text-earth-600 mb-4">
                {selectedStatus === 'all' 
                  ? "You don't have any bookings yet." 
                  : `No ${selectedStatus} bookings found.`
                }
              </p>
              {selectedStatus !== 'all' && (
                <button 
                  onClick={() => handleStatusFilter('all')}
                  className="btn-secondary"
                >
                  View All Bookings
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HostBookingsPage

