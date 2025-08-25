'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Heart, Users, MapPin, Calendar, Clock, Star, Send, Phone, Mail, MessageSquare } from 'lucide-react'
import Toast from '@/components/Toast'

interface VolunteerForm {
  name: string
  email: string
  phone: string
  age: string
  skills: string[]
  experience: string
  availability: string
  motivation: string
  preferredLocation: string
  duration: string
}

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export default function VolunteerPage() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'apply' | 'contact'>('opportunities')
  const [volunteerForm, setVolunteerForm] = useState<VolunteerForm>({
    name: '',
    email: '',
    phone: '',
    age: '',
    skills: [],
    experience: '',
    availability: '',
    motivation: '',
    preferredLocation: '',
    duration: ''
  })
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const volunteerOpportunities = [
    {
      id: 1,
      title: 'Teaching Assistant',
      location: 'Rural Schools, Various States',
      duration: '2-6 months',
      description: 'Help local teachers in rural schools with English, Math, and Science subjects.',
      requirements: ['Basic teaching skills', 'Patience with children', 'English proficiency'],
      benefits: ['Accommodation provided', 'Local cultural immersion', 'Teaching experience'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Healthcare Support',
      location: 'Village Health Centers',
      duration: '1-3 months',
      description: 'Assist healthcare workers in rural health centers and mobile clinics.',
      requirements: ['Medical background preferred', 'Compassionate nature', 'Basic first aid'],
      benefits: ['Healthcare experience', 'Rural healthcare exposure', 'Community impact'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Environmental Conservation',
      location: 'Forest Villages',
      duration: '3-12 months',
      description: 'Work on environmental projects including tree planting and wildlife conservation.',
      requirements: ['Physical fitness', 'Environmental awareness', 'Outdoor skills'],
      benefits: ['Nature immersion', 'Conservation experience', 'Adventure activities'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Women Empowerment',
      location: 'Rural Communities',
      duration: '2-8 months',
      description: 'Support women\'s self-help groups and skill development programs.',
      requirements: ['Gender sensitivity', 'Communication skills', 'Empathy'],
      benefits: ['Social impact', 'Leadership skills', 'Cultural exchange'],
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Digital Literacy',
      location: 'Village Community Centers',
      duration: '1-4 months',
      description: 'Teach basic computer skills and digital literacy to rural communities.',
      requirements: ['Computer skills', 'Teaching ability', 'Patience'],
      benefits: ['Tech teaching experience', 'Digital inclusion impact', 'Skill development'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Agricultural Support',
      location: 'Farming Villages',
      duration: '2-6 months',
      description: 'Assist farmers with sustainable farming practices and organic agriculture.',
      requirements: ['Agricultural interest', 'Physical stamina', 'Learning attitude'],
      benefits: ['Farming knowledge', 'Sustainable practices', 'Rural lifestyle'],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'
    }
  ]

  const skillOptions = [
    'Teaching', 'Healthcare', 'Agriculture', 'Technology', 'Arts & Crafts',
    'Sports', 'Music', 'Cooking', 'Construction', 'Environmental Science',
    'Social Work', 'Business', 'Engineering', 'Languages', 'Photography'
  ]

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setToast({ message: 'Volunteer application submitted successfully! We\'ll contact you soon.', type: 'success' })
      setVolunteerForm({
        name: '', email: '', phone: '', age: '', skills: [],
        experience: '', availability: '', motivation: '', preferredLocation: '', duration: ''
      })
    } catch (error) {
      setToast({ message: 'Failed to submit application. Please try again.', type: 'error' })
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setToast({ message: 'Message sent successfully! We\'ll get back to you soon.', type: 'success' })
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' })
    }
  }

  const handleSkillToggle = (skill: string) => {
    setVolunteerForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-16 h-16 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Volunteer Exchange</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Make a difference in rural communities while experiencing authentic village life
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'opportunities' 
                  ? 'bg-white text-primary-600' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              View Opportunities
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'apply' 
                  ? 'bg-white text-primary-600' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              Apply Now
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'contact' 
                  ? 'bg-white text-primary-600' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'opportunities' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-earth-800 mb-4">Volunteer Opportunities</h2>
              <p className="text-earth-600 max-w-2xl mx-auto">
                Choose from various meaningful opportunities to contribute to rural communities 
                while gaining valuable experience and cultural insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {volunteerOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={opportunity.image}
                      alt={opportunity.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {opportunity.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-earth-800 mb-2">{opportunity.title}</h3>
                    <div className="flex items-center text-earth-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      {opportunity.location}
                    </div>
                    <p className="text-earth-700 mb-4">{opportunity.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-earth-800 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.requirements.map((req, index) => (
                          <span key={index} className="bg-earth-100 text-earth-700 px-2 py-1 rounded text-sm">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-earth-800 mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.benefits.map((benefit, index) => (
                          <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-earth-800 mb-4">Volunteer Application</h2>
              <p className="text-earth-600">
                Fill out the form below to apply for volunteer opportunities. We'll review your application 
                and get back to you within 48 hours.
              </p>
            </div>
            
            <form onSubmit={handleVolunteerSubmit} className="bg-white rounded-2xl shadow-sm border border-earth-100 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={volunteerForm.phone}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Age *</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="65"
                    value={volunteerForm.age}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-earth-700 mb-2">Skills & Expertise</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {skillOptions.map((skill) => (
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={volunteerForm.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-earth-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-earth-700 mb-2">Previous Experience</label>
                  <textarea
                    value={volunteerForm.experience}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, experience: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe any relevant volunteer or work experience"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Availability *</label>
                  <select
                    required
                    value={volunteerForm.availability}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select availability</option>
                    <option value="immediate">Immediate</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Preferred Duration</label>
                  <select
                    value={volunteerForm.duration}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="1+ year">1+ year</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-earth-700 mb-2">Preferred Location</label>
                  <select
                    value={volunteerForm.preferredLocation}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, preferredLocation: e.target.value }))}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select preferred location</option>
                    <option value="north">North India</option>
                    <option value="south">South India</option>
                    <option value="east">East India</option>
                    <option value="west">West India</option>
                    <option value="central">Central India</option>
                    <option value="any">Any location</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-earth-700 mb-2">Motivation & Goals *</label>
                  <textarea
                    required
                    value={volunteerForm.motivation}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, motivation: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Why do you want to volunteer? What do you hope to achieve?"
                  />
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-earth-800 mb-4">Contact Us</h2>
              <p className="text-earth-600">
                Have questions about volunteering? Get in touch with our team for more information.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-8">
                <h3 className="text-xl font-bold text-earth-800 mb-6">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 rounded-xl">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-800">Phone</h4>
                      <p className="text-earth-600">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 rounded-xl">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-800">Email</h4>
                      <p className="text-earth-600">volunteer@villagevibe.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-800">WhatsApp</h4>
                      <p className="text-earth-600">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-earth-50 rounded-xl">
                  <h4 className="font-semibold text-earth-800 mb-3">Office Hours</h4>
                  <p className="text-earth-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-earth-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-earth-600">Sunday: Closed</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-earth-100 p-8">
                <h3 className="text-xl font-bold text-earth-800 mb-6">Send Message</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your message"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

