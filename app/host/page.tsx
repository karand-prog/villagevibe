'use client'

import React, { useState } from 'react'
import { MapPin, Mic, Upload, Users, Shield, Award } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const HostPage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    state: '',
    phone: '',
    email: '',
    experience: '',
    description: '',
    price: '',
    capacity: '',
    amenities: [] as string[]
  })

  const states = [
    'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 
    'Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Punjab', 'Haryana'
  ]

  const experienceTypes = [
    'Homestay', 'Cultural Experience', 'Traditional Food', 'Craft Workshop', 
    'Farming Experience', 'Village Tour', 'Local Festival', 'Artisan Visit'
  ]

  const amenitiesList = [
    'Traditional Food', 'Cultural Shows', 'Village Walks', 'Craft Workshops',
    'Local Guides', 'Transportation', 'WiFi', 'Clean Rooms', 'Local Stories'
  ]

  const benefits = [
    {
      icon: Shield,
      title: '85% Revenue Share',
      description: 'Keep 85% of all bookings, highest in the industry'
    },
    {
      icon: Mic,
      title: 'Voice-Based Uploads',
      description: 'Record descriptions and stories by speaking'
    },
    {
      icon: Users,
      title: 'Direct Bookings',
      description: 'No middlemen, connect directly with travelers'
    },
    {
      icon: Award,
      title: 'Impact Tracking',
      description: 'See your positive impact on the community'
    }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-sunset text-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Share Your Village with the World
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join thousands of rural hosts who are earning sustainable income while preserving their culture. 
              It's simple, fair, and impactful.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-90">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="card p-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNumber 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-earth-200 text-earth-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-primary-600' : 'bg-earth-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-center mb-8">
                  Tell Us About Yourself
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="input-field"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Village Name *
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      className="input-field"
                      placeholder="Your village name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select your state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.phone || !formData.village || !formData.state}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Experience Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-center mb-8">
                  Describe Your Experience
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Type of Experience *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select experience type</option>
                      {experienceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="input-field h-32 resize-none"
                      placeholder="Tell travelers about your village, culture, and what they can expect..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-earth-700 mb-2">
                        Price per Night (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="input-field"
                        placeholder="1200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-earth-700 mb-2">
                        Maximum Capacity *
                      </label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        className="input-field"
                        placeholder="4"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 mb-2">
                      Amenities & Services
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-earth-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button onClick={prevStep} className="btn-secondary">
                    Previous
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.experience || !formData.description || !formData.price || !formData.capacity}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Voice Recording & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-center mb-8">
                  Add Your Voice
                </h2>
                
                <div className="text-center space-y-6">
                  <div className="bg-primary-50 rounded-xl p-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                      <Mic className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Record Your Story</h3>
                    <p className="text-earth-600 mb-6">
                      Share your village's history, traditions, or personal stories. 
                      This helps travelers connect with your culture.
                    </p>
                    <button className="btn-primary">
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </button>
                  </div>
                  
                  <div className="bg-earth-50 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">What You'll Earn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-600">85%</div>
                        <div className="text-sm text-earth-600">Revenue Share</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-600">₹0</div>
                        <div className="text-sm text-earth-600">Listing Fee</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-600">24/7</div>
                        <div className="text-sm text-earth-600">Support</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button onClick={prevStep} className="btn-secondary">
                    Previous
                  </button>
                  <button className="btn-primary">
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HostPage 