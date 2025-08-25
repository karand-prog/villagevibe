'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Heart, MapPin, Star, Search, Filter, Trash2, Eye, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/AuthContext'
import { useSaved } from '@/components/SavedContext'
import Link from 'next/link'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { savedListings, savedExperiences, totalSaved, loading, toggleListing, toggleExperience } = useSaved()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'villages' | 'experiences'>('villages')

  // Sample data for villages
  const sampleVillages = [
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
    },
    {
      _id: 'kerala-backwaters',
      title: 'Kerala Backwaters Village',
      description: 'Experience the serene beauty of Kerala backwaters with traditional houseboat stays.',
      location: { village: 'Alleppey', state: 'Kerala' },
      price: 3000,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop']
    },
    {
      _id: 'spiti-valley',
      title: 'Spiti Valley Mountain Village',
      description: 'High-altitude village in the cold desert of Spiti Valley with stunning mountain views.',
      location: { village: 'Spiti Valley', state: 'Himachal Pradesh' },
      price: 2800,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']
    },
    {
      _id: 'kodaikanal-hills',
      title: 'Kodaikanal Hill Station Village',
      description: 'Peaceful hill station village with misty mountains and serene lakes.',
      location: { village: 'Kodaikanal', state: 'Tamil Nadu' },
      price: 2000,
      rating: 4.7,
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop']
    }
  ]

  // Sample data for experiences
  const sampleExperiences = [
    {
      _id: 'exp1',
      title: 'Traditional Cooking Class',
      description: 'Learn to cook authentic local dishes from village grandmothers.',
      location: { village: 'Kerala Village', state: 'Kerala' },
      price: 1200,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      duration: '3 hours'
    },
    {
      _id: 'exp2',
      title: 'Handloom Weaving Workshop',
      description: 'Experience the traditional art of handloom weaving.',
      location: { village: 'Banaras', state: 'Uttar Pradesh' },
      price: 800,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      duration: '2 hours'
    },
    {
      _id: 'exp3',
      title: 'Village Farming Experience',
      description: 'Get hands-on experience with traditional farming methods.',
      location: { village: 'Punjab Village', state: 'Punjab' },
      price: 1500,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      duration: '4 hours'
    }
  ]

  // Get saved villages with real-time updates
  const savedVillages = useMemo(() => {
    return sampleVillages.filter(village => savedListings.has(village._id))
  }, [savedListings])

  // Get saved experiences with real-time updates
  const savedExp = useMemo(() => {
    return sampleExperiences.filter(exp => savedExperiences.has(exp._id))
  }, [savedExperiences])

  // Filter by search term
  const filteredVillages = useMemo(() => {
    return savedVillages.filter(village =>
      village.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.location.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.location.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [savedVillages, searchTerm])

  const filteredExperiences = useMemo(() => {
    return savedExp.filter(exp =>
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [savedExp, searchTerm])

  const handleRemoveFromSaved = (itemId: string, type: 'village' | 'experience') => {
    if (type === 'village') {
      toggleListing(itemId)
    } else {
      toggleExperience(itemId)
    }
  }

  const tabs = [
    { id: 'villages', label: 'Saved Villages', count: savedVillages.length },
    { id: 'experiences', label: 'Saved Experiences', count: savedExp.length }
  ]

  // Force re-render when saved items change
  useEffect(() => {
    // This will trigger a re-render when savedListings or savedExperiences change
  }, [savedListings, savedExperiences])

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
              <h1 className="text-3xl font-bold text-earth-800">Saved Items</h1>
              <p className="text-earth-600 mt-2">Your favorite villages and experiences</p>
            </div>
            <Link 
              href="/explore" 
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md"
            >
              Explore More
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Total Saved</p>
                <p className="text-2xl font-bold text-earth-800 mt-1">{totalSaved}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Villages</p>
                <p className="text-2xl font-bold text-earth-800 mt-1">{savedVillages.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary-50">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Experiences</p>
                <p className="text-2xl font-bold text-earth-800 mt-1">{savedExp.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search saved items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-earth-600">Loading saved items...</p>
                        </div>
            ) : activeTab === 'villages' && filteredVillages.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-earth-400" />
                <h3 className="text-xl font-semibold text-earth-800 mb-2">
                  {searchTerm ? 'No villages found' : 'No saved villages yet'}
                </h3>
                <p className="text-earth-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Start saving your favorite villages to see them here!'
                  }
                </p>
                <Link 
                  href="/explore" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Explore Villages
                      </Link>
                  </div>
            ) : activeTab === 'experiences' && filteredExperiences.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-earth-400" />
                <h3 className="text-xl font-semibold text-earth-800 mb-2">
                  {searchTerm ? 'No experiences found' : 'No saved experiences yet'}
                </h3>
                <p className="text-earth-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Start saving your favorite experiences to see them here!'
                  }
                </p>
                <Link 
                  href="/experiences" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Explore Experiences
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'villages' ? savedVillages : filteredExperiences).map((item: any) => (
                  <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFromSaved(item._id, activeTab === 'villages' ? 'village' : 'experience')}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </button>
                    </div>
                        <div className="p-4">
                      <h4 className="font-semibold text-earth-800 mb-2 line-clamp-2">{item.title}</h4>
                      <p className="text-sm text-earth-600 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-earth-400" />
                          <span className="text-sm text-earth-600">{item.location.village}, {item.location.state}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">₹{item.price}/night</span>
                        <Link
                          href={`/${activeTab === 'villages' ? 'explore' : 'experiences'}/${item._id}`}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          View Details
                        </Link>
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
      
      {/* Removed Toast component as per new_code */}
    </div>
  )
}

