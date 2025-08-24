"use client"

import React, { useState } from 'react'
import { Search, MapPin, Filter, X } from 'lucide-react'

interface AdvancedSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedState: string
  setSelectedState: (state: string) => void
  selectedExperience: string
  setSelectedExperience: (experience: string) => void
  priceRange: string
  setPriceRange: (range: string) => void
  selectedAmenities: string[]
  setSelectedAmenities: (amenities: string[]) => void
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedState,
  setSelectedState,
  selectedExperience,
  setSelectedExperience,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  const experienceTypes = [
    'Cultural Immersion', 'Adventure', 'Wellness', 'Culinary', 'Art & Craft',
    'Agriculture', 'Wildlife', 'Spiritual', 'Heritage', 'Community Service'
  ]

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-1000', label: 'Under ₹1,000' },
    { value: '1000-2000', label: '₹1,000 - ₹2,000' },
    { value: '2000-5000', label: '₹2,000 - ₹5,000' },
    { value: '5000+', label: 'Above ₹5,000' }
  ]

  const amenities = [
    'WiFi', 'Air Conditioning', 'Hot Water', 'Kitchen', 'Garden',
    'Parking', 'Local Guide', 'Meals Included', 'Cultural Activities',
    'Transportation', 'Laundry', 'Medical Support'
  ]

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedState('')
    setSelectedExperience('')
    setPriceRange('')
    setSelectedAmenities([])
  }

  const hasActiveFilters = searchQuery || selectedState || selectedExperience || priceRange || selectedAmenities.length > 0

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="flex items-center bg-white rounded-full shadow-lg border border-earth-200 overflow-hidden">
          <div className="flex-1 flex items-center px-6 py-4">
            <Search className="w-5 h-5 text-earth-400 mr-3" />
            <input
              type="text"
              placeholder="Search villages, experiences, or activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-earth-800 placeholder-earth-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 flex items-center gap-2 transition-colors ${
              hasActiveFilters 
                ? 'bg-primary-600 text-white' 
                : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="bg-white text-primary-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {[searchQuery, selectedState, selectedExperience, priceRange, selectedAmenities.length].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg border border-earth-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-earth-800">Advanced Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-earth-600 hover:text-earth-800 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Experience Type Filter */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Experience Type
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Experiences</option>
                {experienceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Active Filters Count */}
            <div className="flex items-end">
              <div className="w-full text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {[searchQuery, selectedState, selectedExperience, priceRange, selectedAmenities.length].filter(Boolean).length}
                </div>
                <div className="text-sm text-earth-600">Active Filters</div>
              </div>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-earth-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {amenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-earth-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Amenities Tags */}
          {selectedAmenities.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {selectedAmenities.map(amenity => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      onClick={() => toggleAmenity(amenity)}
                      className="ml-1 hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch
