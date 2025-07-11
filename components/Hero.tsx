'use client'

import React, { useState } from 'react'
import { Search, MapPin, Calendar, Users } from 'lucide-react'

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [guests, setGuests] = useState('')

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-earth-50 to-sunset-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-sunset-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-earth-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-earth-800">Discover the </span>
            <span className="text-gradient">Real India</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-earth-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect directly with rural communities. Experience authentic village life, 
            traditional culture, and local hospitality without middlemen.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Search */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Date Picker */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Guests */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="input-field pl-10"
                >
                  <option value="">Guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="btn-primary flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search Villages
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-earth-600">Villages Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-earth-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">₹2.5Cr+</div>
              <div className="text-earth-600">Earned by Locals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-earth-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-earth-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero 