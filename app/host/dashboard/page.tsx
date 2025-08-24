'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Star, TrendingUp, Award, Clock, Bookmark, User, Settings, LogOut, Edit, Trash2, X, Plus, Eye, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/AuthContext'
import { useDataBus } from '@/components/DataBus'
import Link from 'next/link'
import Toast from '@/components/Toast'
import { useRouter } from 'next/navigation'

// Edit Listing Form Component
function EditListingForm({ listing, onSave, onCancel }: { listing: any; onSave: (listing: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: listing.title || '',
    description: listing.description || '',
    village: listing.location?.village || listing.village || '',
    state: listing.location?.state || listing.state || '',
    price: listing.price || '',
    maxGuests: listing.maxGuests || '',
    bedrooms: listing.bedrooms || '',
    bathrooms: listing.bathrooms || '',
    amenities: listing.amenities || [],
    highlights: listing.highlights || []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedListing = {
      ...listing,
      ...formData,
      location: {
        village: formData.village,
        state: formData.state
      }
    }
    onSave(updatedListing)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Price per night (₹)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-earth-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Village</label>
          <input
            type="text"
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Max Guests</label>
          <input
            type="number"
            value={formData.maxGuests}
            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-earth-200 text-earth-700 rounded-lg hover:bg-earth-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

export default function HostDashboardPage() {
  const { user } = useAuth()
  const { counters } = useDataBus()
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'earnings' | 'profile'>('overview')
  const [editingListing, setEditingListing] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin'
      return
    }
  }, [user])

  // Sample data for host dashboard
  const sampleListings = [
    {
      _id: '1',
      title: 'Traditional Rajasthani Village Homestay',
      description: 'Experience authentic village life in the heart of Rajasthan',
      location: { village: 'Pushkar', state: 'Rajasthan' },
      price: 2500,
      rating: 4.8,
      totalReviews: 24,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
      status: 'active',
      bookings: 12,
      earnings: 30000
    },
    {
      _id: '2',
      title: 'Kerala Backwaters Cultural Experience',
      description: 'Immerse yourself in the serene beauty of Kerala backwaters',
      location: { village: 'Alleppey', state: 'Kerala' },
      price: 3500,
      rating: 4.9,
      totalReviews: 18,
      images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop'],
      status: 'active',
      bookings: 8,
      earnings: 28000
    },
    {
      _id: '3',
      title: 'Himalayan Mountain Village Retreat',
      description: 'Discover the magic of the Himalayas in this traditional village',
      location: { village: 'Manali', state: 'Himachal Pradesh' },
      price: 4000,
      rating: 4.7,
      totalReviews: 15,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'],
      status: 'pending',
      bookings: 5,
      earnings: 20000
    }
  ]

  const sampleBookings = [
    {
      _id: '1',
      listing: sampleListings[0],
      guest: { name: 'John Doe', email: 'john@example.com' },
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      guestsCount: 2,
      totalPrice: 7500,
      status: 'confirmed',
      createdAt: '2024-02-20T10:00:00Z'
    },
    {
      _id: '2',
      listing: sampleListings[1],
      guest: { name: 'Jane Smith', email: 'jane@example.com' },
      checkIn: '2024-04-10',
      checkOut: '2024-04-12',
      guestsCount: 3,
      totalPrice: 10500,
      status: 'pending',
      createdAt: '2024-02-25T14:30:00Z'
    }
  ]

  // Get listings from localStorage (including newly created ones)
  const getHostListings = () => {
    try {
      if (typeof window !== 'undefined') {
        const mockListings = JSON.parse(localStorage.getItem('mockListings') || '[]')
        // Ensure all listings have proper structure
        const validatedMockListings = mockListings.map((listing: any) => ({
          ...listing,
          location: listing.location || { village: listing.village || 'Unknown Village', state: listing.state || 'Unknown State' },
          highlights: listing.highlights || ['Traditional Village Experience'],
          amenities: listing.amenities || ['WiFi', 'Traditional Food'],
          rating: listing.rating || 4.5,
          totalReviews: listing.totalReviews || 0,
          status: listing.status || 'active',
          bookings: listing.bookings || 0,
          earnings: listing.earnings || 0
        }))
        return [...sampleListings, ...validatedMockListings]
      }
      return sampleListings
    } catch (error) {
      console.warn('Error parsing mock listings:', error)
      return sampleListings
    }
  }

  const hostListings = getHostListings()
  const router = useRouter()

  // Edit listing function
  const handleEditListing = (listing: any) => {
    setEditingListing(listing)
    setShowEditModal(true)
  }

  // Delete listing function
  const handleDeleteListing = (listingId: string) => {
    setDeleteListingId(listingId)
    setShowDeleteModal(true)
  }

  // Confirm delete function
  const confirmDelete = () => {
    if (deleteListingId && typeof window !== 'undefined') {
      try {
        const existingListings = JSON.parse(localStorage.getItem('mockListings') || '[]')
        const updatedListings = existingListings.filter((listing: any) => listing._id !== deleteListingId)
        localStorage.setItem('mockListings', JSON.stringify(updatedListings))
        
        setToast({ message: 'Listing deleted successfully!', type: 'success' })
        setShowDeleteModal(false)
        setDeleteListingId(null)
        
        // Refresh the page to update the listings
        window.location.reload()
      } catch (error) {
        setToast({ message: 'Error deleting listing', type: 'error' })
      }
    }
  }

  // Save edited listing function
  const saveEditedListing = (updatedListing: any) => {
    if (typeof window !== 'undefined') {
      try {
        const existingListings = JSON.parse(localStorage.getItem('mockListings') || '[]')
        const updatedListings = existingListings.map((listing: any) => 
          listing._id === updatedListing._id ? updatedListing : listing
        )
        localStorage.setItem('mockListings', JSON.stringify(updatedListings))
        
        setToast({ message: 'Listing updated successfully!', type: 'success' })
        setShowEditModal(false)
        setEditingListing(null)
        
        // Refresh the page to update the listings
        window.location.reload()
      } catch (error) {
        setToast({ message: 'Error updating listing', type: 'error' })
      }
    }
  }

  const stats = [
    {
      title: 'Total Listings',
      value: hostListings.length,
      change: '+2',
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Bookings',
      value: sampleBookings.filter(b => b.status === 'confirmed').length,
      change: '+5',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Earnings',
      value: `₹${hostListings.reduce((sum, listing) => sum + (listing.earnings || 0), 0).toLocaleString()}`,
      change: '+12%',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Average Rating',
      value: (hostListings.reduce((sum, listing) => sum + (listing.rating || 0), 0) / hostListings.length).toFixed(1),
      change: '+0.2',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'listings', label: 'My Listings', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: Award },
    { id: 'profile', label: 'Profile', icon: User }
  ]

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
              <h1 className="text-3xl font-bold text-earth-800">Host Dashboard</h1>
              <p className="text-earth-600 mt-2">Manage your village listings and bookings</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/host/listings/new" 
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Listing
              </Link>
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
                    {sampleBookings.slice(0, 3).map((booking) => (
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

                {/* Top Performing Listings */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-800 mb-4">Top Performing Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hostListings.slice(0, 3).map((listing) => (
                      <div key={listing._id} className="bg-earth-50 rounded-xl p-4 border border-earth-200">
                        <div className="flex items-center space-x-3">
                          <img
                            src={listing.images?.[0]}
                            alt={listing.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-earth-800">{listing.title}</h4>
                            <p className="text-sm text-earth-600">{listing.location.village}, {listing.location.state}</p>
                            <p className="text-sm font-medium text-primary-600">₹{listing.price}/night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-earth-800">My Listings</h3>
                  <Link href="/host/listings/new" className="text-primary-600 hover:text-primary-700 font-medium">
                    Add New Listing
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hostListings.map((listing) => (
                    <div key={listing._id} className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={listing.images?.[0]}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-earth-800 mb-2">{listing.title}</h4>
                        <p className="text-sm text-earth-600 mb-3">{listing.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-earth-400" />
                            <span className="text-sm text-earth-600">
                              {listing.location?.village || listing.village || 'Unknown Village'}, {listing.location?.state || listing.state || 'Unknown State'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{listing.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">₹{listing.price}/night</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditListing(listing)}
                              className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteListing(listing._id)}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-earth-800">Recent Bookings</h3>
                <div className="space-y-4">
                  {sampleBookings.map((booking) => (
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
                          <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-earth-800">Earnings Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Total Earnings</h4>
                    <p className="text-3xl font-bold text-green-600">₹{hostListings.reduce((sum, listing) => sum + (listing.earnings || 0), 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">This Month</h4>
                    <p className="text-3xl font-bold text-blue-600">₹45,000</p>
                  </div>
                  <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">Pending</h4>
                    <p className="text-3xl font-bold text-yellow-600">₹12,500</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-earth-800">Host Profile</h3>
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

      {/* Edit Modal */}
      {showEditModal && editingListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-earth-800">Edit Listing</h3>
              <button onClick={() => setShowEditModal(false)} className="text-earth-400 hover:text-earth-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <EditListingForm 
              listing={editingListing} 
              onSave={saveEditedListing} 
              onCancel={() => setShowEditModal(false)} 
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-earth-800 mb-4">Delete Listing</h3>
              <p className="text-earth-600 mb-6">Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 bg-earth-200 text-earth-700 rounded-lg hover:bg-earth-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}