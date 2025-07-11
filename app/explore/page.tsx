'use client'

import React, { useState } from 'react'
import { Search, MapPin, Filter, Star, Users, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')

  const states = [
    'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 
    'Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Punjab', 'Haryana'
  ]

  const experiences = [
    'Homestay', 'Cultural Experience', 'Traditional Food', 'Craft Workshop', 
    'Farming Experience', 'Village Tour', 'Local Festival', 'Artisan Visit'
  ]

  const villages = [
    {
      id: 1,
      name: 'Pichola Village',
      state: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 127,
      price: '₹1,200',
      per: 'night',
      experience: 'Homestay',
      description: 'Experience authentic Rajasthani hospitality in this traditional village near Udaipur.',
      amenities: ['Traditional Food', 'Cultural Shows', 'Village Walks'],
      host: 'Rajesh & Meera Patel'
    },
    {
      id: 2,
      name: 'Kerala Backwaters Village',
      state: 'Kerala',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      price: '₹2,500',
      per: 'night',
      experience: 'Cultural Experience',
      description: 'Stay in a traditional houseboat and experience the serene backwaters of Kerala.',
      amenities: ['Houseboat Stay', 'Ayurvedic Massage', 'Local Cuisine'],
      host: 'Thomas & Mary George'
    },
    {
      id: 3,
      name: 'Himachal Mountain Village',
      state: 'Himachal Pradesh',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      price: '₹1,800',
      per: 'night',
      experience: 'Farming Experience',
      description: 'Learn traditional farming methods in the beautiful mountains of Himachal.',
      amenities: ['Organic Farming', 'Mountain Views', 'Local Crafts'],
      host: 'Ramesh & Sunita Thakur'
    },
    {
      id: 4,
      name: 'Gujarat Tribal Village',
      state: 'Gujarat',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 73,
      price: '₹900',
      per: 'night',
      experience: 'Craft Workshop',
      description: 'Learn traditional tribal crafts and experience their unique culture.',
      amenities: ['Craft Workshops', 'Tribal Dance', 'Local Stories'],
      host: 'Bharat & Laxmi Bhil'
    }
  ]

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Explore Authentic Village Experiences
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Discover real India through direct connections with rural communities. 
              No middlemen, just authentic experiences.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search villages or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input-field"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="input-field"
              >
                <option value="">All Experiences</option>
                {experiences.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>

              <button className="btn-primary flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="card p-6 sticky top-24">
                <div className="flex items-center mb-6">
                  <Filter className="w-5 h-5 mr-2 text-primary-600" />
                  <h3 className="text-lg font-semibold">Filters</h3>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Under ₹1,000
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      ₹1,000 - ₹2,000
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      ₹2,000 - ₹3,000
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Above ₹3,000
                    </label>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Rating</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-1">5.0</span>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <div className="flex items-center">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-1">4.0+</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Amenities</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Traditional Food
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Cultural Activities
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Village Tours
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Craft Workshops
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold">
                  {villages.length} Village Experiences Found
                </h2>
                <select className="input-field w-auto">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Distance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {villages.map(village => (
                  <div key={village.id} className="card overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={village.image} 
                        alt={village.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary-600">
                        {village.experience}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-earth-800 mb-1">
                            {village.name}
                          </h3>
                          <div className="flex items-center text-earth-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {village.state}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {village.price}
                          </div>
                          <div className="text-sm text-earth-600">
                            per {village.per}
                          </div>
                        </div>
                      </div>

                      <p className="text-earth-600 mb-4 line-clamp-2">
                        {village.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex items-center mr-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">{village.rating}</span>
                          </div>
                          <span className="text-earth-600 text-sm">
                            ({village.reviews} reviews)
                          </span>
                        </div>
                        <div className="text-sm text-earth-600">
                          Host: {village.host}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {village.amenities.slice(0, 2).map((amenity, index) => (
                          <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                        {village.amenities.length > 2 && (
                          <span className="bg-earth-100 text-earth-600 px-2 py-1 rounded-full text-xs">
                            +{village.amenities.length - 2} more
                          </span>
                        )}
                      </div>

                      <button className="btn-primary w-full">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ExplorePage 