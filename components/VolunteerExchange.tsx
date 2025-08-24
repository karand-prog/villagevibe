'use client'

import React, { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, Users, Award, Heart, MessageCircle, Filter, Plus, Star, Clock, X } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useTranslation } from './LanguageDetector'
import { useBookings } from './BookingContext'
import Toast from './Toast'

interface VolunteerOpportunity {
  id: string
  title: string
  village: {
    name: string
    state: string
    image: string
  }
  description: string
  skills: string[]
  duration: string
  startDate: string
  endDate: string
  accommodation: string
  meals: string
  maxVolunteers: number
  currentVolunteers: number
  rating: number
  reviews: number
  host: {
    name: string
    avatar: string
  }
  category: 'education' | 'healthcare' | 'agriculture' | 'construction' | 'arts' | 'environment' | 'technology'
  status: 'open' | 'full' | 'closed'
  price?: number
}

interface UserSkill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'expert'
  category: string
}

const VolunteerExchange = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<VolunteerOpportunity[]>([])
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedState, setSelectedState] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' as const, category: '' })

  useEffect(() => {
    // Initialize sample data
    const sampleOpportunities: VolunteerOpportunity[] = [
      {
        id: '1',
        title: 'Teach English to Village Children',
        village: {
          name: 'Kodagu Village',
          state: 'Karnataka',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
        },
        description: 'Help children in our village learn English through interactive activities and games. Perfect for those who love teaching and working with kids.',
        skills: ['Teaching', 'English', 'Communication', 'Patience'],
        duration: '2-4 weeks',
        startDate: '2024-03-15',
        endDate: '2024-04-15',
        accommodation: 'Homestay with local family',
        meals: '3 meals per day included',
        maxVolunteers: 3,
        currentVolunteers: 1,
        rating: 4.8,
        reviews: 12,
        host: {
          name: 'Priya Sharma',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
        },
        category: 'education',
        status: 'open'
      },
      {
        id: '2',
        title: 'Healthcare Support in Rural Clinic',
        village: {
          name: 'Bastar Region',
          state: 'Chhattisgarh',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'
        },
        description: 'Assist local healthcare workers in providing basic medical care to tribal communities. Great for medical students and healthcare professionals.',
        skills: ['Healthcare', 'First Aid', 'Patient Care', 'Communication'],
        duration: '3-6 weeks',
        startDate: '2024-04-01',
        endDate: '2024-05-15',
        accommodation: 'Community center',
        meals: '2 meals per day included',
        maxVolunteers: 2,
        currentVolunteers: 0,
        rating: 4.9,
        reviews: 8,
        host: {
          name: 'Dr. Rajesh Kumar',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        category: 'healthcare',
        status: 'open'
      },
      {
        id: '3',
        title: 'Sustainable Farming Practices',
        village: {
          name: 'Sikkim Valley',
          state: 'Sikkim',
          image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=400'
        },
        description: 'Learn and teach organic farming techniques to local farmers. Help promote sustainable agriculture in the Himalayan region.',
        skills: ['Agriculture', 'Organic Farming', 'Sustainability', 'Teaching'],
        duration: '4-8 weeks',
        startDate: '2024-05-01',
        endDate: '2024-07-01',
        accommodation: 'Farm stay',
        meals: '3 meals per day included',
        maxVolunteers: 4,
        currentVolunteers: 2,
        rating: 4.7,
        reviews: 15,
        host: {
          name: 'Lakpa Sherpa',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        category: 'agriculture',
        status: 'open'
      },
      {
        id: '4',
        title: 'Women Empowerment Through Crafts',
        village: {
          name: 'Kutch Region',
          state: 'Gujarat',
          image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400'
        },
        description: 'Help local women develop their traditional craft skills and create marketable products. Support women entrepreneurship in rural areas.',
        skills: ['Crafts', 'Business', 'Women Empowerment', 'Marketing'],
        duration: '3-5 weeks',
        startDate: '2024-06-01',
        endDate: '2024-07-15',
        accommodation: 'Women\'s cooperative center',
        meals: '2 meals per day included',
        maxVolunteers: 3,
        currentVolunteers: 1,
        rating: 4.6,
        reviews: 10,
        host: {
          name: 'Fatima Patel',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
        },
        category: 'arts',
        status: 'open'
      },
      {
        id: '5',
        title: 'Environmental Conservation Project',
        village: {
          name: 'Western Ghats',
          state: 'Kerala',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        },
        description: 'Participate in forest conservation, wildlife monitoring, and environmental education programs in the biodiversity hotspot.',
        skills: ['Environmental Science', 'Wildlife', 'Conservation', 'Education'],
        duration: '2-6 weeks',
        startDate: '2024-07-01',
        endDate: '2024-08-15',
        accommodation: 'Eco-lodge',
        meals: '3 meals per day included',
        maxVolunteers: 5,
        currentVolunteers: 3,
        rating: 4.9,
        reviews: 20,
        host: {
          name: 'Dr. Maya Iyer',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
        },
        category: 'environment',
        status: 'open'
      },
      {
        id: '6',
        title: 'Digital Literacy for Rural Youth',
        village: {
          name: 'Telangana Village',
          state: 'Telangana',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
        },
        description: 'Teach basic computer skills, internet usage, and digital tools to help rural youth access better opportunities.',
        skills: ['Technology', 'Teaching', 'Digital Skills', 'Youth Development'],
        duration: '3-4 weeks',
        startDate: '2024-08-01',
        endDate: '2024-09-01',
        accommodation: 'Community center',
        meals: '2 meals per day included',
        maxVolunteers: 3,
        currentVolunteers: 0,
        rating: 4.5,
        reviews: 6,
        host: {
          name: 'Arjun Reddy',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        category: 'technology',
        status: 'open'
      }
    ]
    setOpportunities(sampleOpportunities)
    setFilteredOpportunities(sampleOpportunities)
  }, [])

  // Remove all booking-related functions
  const handleApply = async (opportunity: VolunteerOpportunity) => {
    if (!user) {
      setToast({ message: 'Please sign in to apply for volunteering', type: 'error' })
      return
    }
    
    setToast({ 
      message: `Application submitted for ${opportunity.title}! We'll contact you soon.`, 
      type: 'success' 
    })
  }

  // Define categories and states arrays
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'education', name: 'Education' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'construction', name: 'Construction' },
    { id: 'arts', name: 'Arts & Culture' },
    { id: 'environment', name: 'Environment' },
    { id: 'technology', name: 'Technology' }
  ]

  const states = [
    'All States',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Jammu & Kashmir',
    'Ladakh'
  ]

  useEffect(() => {
    let filtered = opportunities

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.village.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(opp => opp.category === selectedCategory)
    }

    // State filter
    if (selectedState && selectedState !== 'All States') {
      filtered = filtered.filter(opp => opp.village.state === selectedState)
    }

    setFilteredOpportunities(filtered)
  }, [opportunities, searchQuery, selectedCategory, selectedState])

  const addSkill = () => {
    if (newSkill.name && newSkill.category) {
      const skill: UserSkill = {
        id: Date.now().toString(),
        name: newSkill.name,
        level: newSkill.level,
        category: newSkill.category
      }
      setUserSkills([...userSkills, skill])
      setNewSkill({ name: '', level: 'intermediate', category: '' })
      setShowSkillForm(false)
    }
  }

  const getMatchingScore = (opportunity: VolunteerOpportunity) => {
    if (!userSkills || !opportunity.skills) return 0

    const userSkillNames = userSkills.map(skill => skill.name.toLowerCase())
    const opportunitySkills = opportunity.skills.map(skill => skill.toLowerCase())

    const matches = opportunitySkills.filter(skill =>
      userSkillNames.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    )

    return Math.round((matches.length / opportunitySkills.length) * 100)
  }

  // Safety check for arrays
  const safeCategories = categories || []
  const safeStates = states || []
  const safeUserSkills = userSkills || []
  const safeFilteredOpportunities = filteredOpportunities || []

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Volunteer Exchange</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Connect your skills with village needs. Make a difference while experiencing authentic rural life.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {safeCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input-field"
              >
                {safeStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <button
                className="btn-primary flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Skills Section */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-800">Your Skills</h2>
            <button
              onClick={() => setShowSkillForm(true)}
              className="btn-secondary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {safeUserSkills.map(skill => (
              <div
                key={skill.id}
                className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
              >
                <span>{skill.name}</span>
                <span className="text-xs bg-primary-200 px-2 py-1 rounded-full">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-earth-800">
              {safeFilteredOpportunities.length} Opportunities Found
            </h2>
            <div className="text-sm text-earth-600">
              Showing opportunities that match your skills
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safeFilteredOpportunities.map(opportunity => {
              const matchingScore = getMatchingScore(opportunity)
              const isFull = opportunity.currentVolunteers >= opportunity.maxVolunteers

              return (
                <div key={opportunity.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={opportunity.village.image}
                      alt={opportunity.village.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                      {opportunity.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-earth-800">
                      {opportunity.duration}
                    </div>
                    {matchingScore > 50 && (
                      <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {matchingScore}% Match
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-earth-800 mb-2">{opportunity.title}</h3>

                    <div className="flex items-center text-earth-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {opportunity.village.name}, {opportunity.village.state}
                    </div>

                    <p className="text-earth-600 mb-4 line-clamp-3">{opportunity.description}</p>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-earth-800 mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(opportunity.skills || []).map((skill, index) => (
                          <span key={index} className="bg-earth-100 text-earth-700 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Host Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={opportunity.host.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                          alt={opportunity.host.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-sm">{opportunity.host.name}</p>
                          <div className="flex items-center text-xs text-earth-600">
                            <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                            {opportunity.rating} ({opportunity.reviews} reviews)
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-earth-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {opportunity.currentVolunteers}/{opportunity.maxVolunteers}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {opportunity.startDate}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApply(opportunity)}
                        disabled={isFull}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          isFull
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {isFull ? 'Full' : 'Apply Now'}
                      </button>
                      <button className="btn-secondary flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* No Results */}
          {safeFilteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-earth-400" />
              <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
              <p className="text-earth-600 mb-4">Try adjusting your search criteria or add more skills to your profile.</p>
              <button
                onClick={() => setShowSkillForm(true)}
                className="btn-primary"
              >
                Add Skills
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Add Skill Modal */}
      {showSkillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Skill</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Teaching, Photography"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Education, Arts, Technology"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addSkill}
                className="btn-primary flex-1"
              >
                Add Skill
              </button>
              <button
                onClick={() => setShowSkillForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
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

export default VolunteerExchange

 