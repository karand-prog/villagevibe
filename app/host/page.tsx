'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Camera, Mic, Upload, X, Shield, Users, Star, Sparkles, CheckCircle, DollarSign, ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { authFetch } from '@/components/authFetch'
import { useAuth } from '@/components/AuthContext'
import Toast from '@/components/Toast'
import { useDataBus } from '@/components/DataBus'

// VoiceInputButton: Reusable button for voice input
const VoiceInputButton = ({ onResult, disabled }: { onResult: (text: string) => void; disabled?: boolean }) => {
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Sorry, your browser does not support speech recognition.');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
    const recognition = recognitionRef.current;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        onResult(event.results[0][0].transcript);
      }
    };
    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      disabled={disabled}
      className={`ml-2 p-2 rounded-full border ${listening ? 'bg-green-100 border-green-400' : 'bg-earth-100 border-earth-300'} focus:outline-none`}
      title={listening ? 'Listening...' : 'Speak'}
      aria-label="Voice input"
    >
      <Mic className={`w-5 h-5 ${listening ? 'text-green-600 animate-pulse' : 'text-earth-600'}`} />
    </button>
  );
};

const HostPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    village: '',
    state: '',
    price: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    experiences: [] as string[]
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<'village' | 'experience' | 'volunteer'>('village')

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  const amenities = [
    'WiFi', 'Air Conditioning', 'Hot Water', 'Kitchen', 'Garden',
    'Parking', 'Local Guide', 'Meals Included', 'Cultural Activities',
    'Transportation', 'Laundry', 'Medical Support'
  ]

  const experienceTypes = [
    'Cultural Immersion', 'Adventure', 'Wellness', 'Culinary', 'Art & Craft',
    'Agriculture', 'Wildlife', 'Spiritual', 'Heritage', 'Community Service'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length + images.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const toggleExperience = (experience: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.includes(experience)
        ? prev.experiences.filter(e => e !== experience)
        : [...prev.experiences, experience]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || !formData.village) {
        throw new Error('Please fill in all required fields')
      }

      if (images.length === 0) {
        throw new Error('Please upload at least one image')
      }

      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value))
          } else {
            formDataToSend.append(key, value.toString())
          }
        }
      })

      // Add images
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      try {
        // Try API call first
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/listings`, {
          method: 'POST',
          body: formDataToSend
        })

        if (res.ok) {
          const data = await res.json()
          router.push(`/explore/${data._id}`)
          return
        } else {
          throw new Error('API call failed')
        }
      } catch (apiError) {
        // If API fails, handle locally
        console.warn('API call failed, handling listing creation locally:', apiError)
        
        // Create a mock listing ID
        const mockListingId = `listing-${Date.now()}`
        
        // Store in localStorage for demonstration
        const mockListing = {
          _id: mockListingId,
          ...formData,
          highlights: ['Traditional Village Experience'],
          amenities: formData.amenities || ['WiFi', 'Traditional Food'],
          location: {
            village: formData.village,
            state: formData.state
          },
          images: images.map((_, index) => `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&v=${index}`),
          createdAt: new Date().toISOString(),
          host: {
            name: 'Demo Host',
            rating: 4.8
          },
          rating: 4.5,
          totalReviews: 0,
          status: 'active',
          bookings: 0,
          earnings: 0
        }
        
        // Store in localStorage
        const existingListings = JSON.parse(localStorage.getItem('mockListings') || '[]')
        existingListings.push(mockListing)
        localStorage.setItem('mockListings', JSON.stringify(existingListings))
        
        // Show success message
        setToast({ 
          message: 'Listing created successfully! (Demo mode - stored locally)', 
          type: 'success' 
        })
        
        // Redirect to explore page
        setTimeout(() => {
          router.push('/explore')
        }, 2000)
      }
    } catch (err: any) {
      console.error('Error creating listing:', err)
      setError(err.message || 'Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle experience submission
  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Demo mode - just show success message
      setToast({ 
        message: 'Experience created successfully! (Demo mode)', 
        type: 'success' 
      })
      setTimeout(() => {
        router.push('/experiences')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create experience. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle volunteer submission
  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Demo mode - just show success message
      setToast({ 
        message: 'Volunteer opportunity created successfully! (Demo mode)', 
        type: 'success' 
      })
      setTimeout(() => {
        router.push('/volunteer')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create volunteer opportunity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const Benefit = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
    <div className="card p-6 text-center hover-card">
      <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div className="font-semibold text-earth-800">{title}</div>
      <div className="text-sm text-earth-600 mt-1">{desc}</div>
    </div>
  )

  // Earnings calculator (interactive)
  function EarningsCalculator() {
    const [nightly, setNightly] = useState<number>(Number(formData.price) || 2500)
    const [occupancy, setOccupancy] = useState<number>(50)
    const [nights, setNights] = useState<number>(30)

    const monthly = Math.round(nightly * (occupancy / 100) * nights)

    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-earth-800">Estimate your monthly earnings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Nightly price (₹)</label>
            <input type="number" className="input" min={0} value={nightly} onChange={(e) => setNightly(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Occupancy (%)</label>
            <input type="number" className="input" min={0} max={100} value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Nights per month</label>
            <input type="number" className="input" min={1} max={31} value={nights} onChange={(e) => setNights(Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="mt-4 p-4 bg-earth-50 rounded-lg text-center">
          <div className="text-sm text-earth-600">Estimated monthly earnings</div>
          <div className="text-2xl font-bold text-earth-800">₹{monthly.toLocaleString()}</div>
          <div className="text-xs text-earth-500 mt-1">Actual earnings depend on seasonality and demand</div>
        </div>
      </div>
    )
  }

  // Host testimonials (simple carousel)
  function HostStories() {
    const stories = [
      {
        name: 'Sita Devi',
        village: 'Kumbhalgarh, Rajasthan',
        content: 'Hosting travelers helped us restore our home and keep traditional cooking alive. Guests love our stories!'
      },
      {
        name: 'Anil Kumar',
        village: 'Alleppey, Kerala',
        content: 'We started small, but bookings now support local artisans. The platform was easy to set up.'
      },
      {
        name: 'Leela Bai',
        village: 'Kutch, Gujarat',
        content: 'Visitors learn embroidery from our group. It feels like family welcoming family.'
      }
    ]
    const [index, setIndex] = useState(0)
    const next = () => setIndex((prev) => (prev + 1) % stories.length)
    const prev = () => setIndex((prev) => (prev - 1 + stories.length) % stories.length)
    const s = stories[index]

    return (
      <div className="card p-6">
        <div className="text-center">
          <div className="text-lg text-earth-700 italic mb-3">“{s.content}”</div>
          <div className="font-semibold text-earth-800">{s.name}</div>
          <div className="text-sm text-earth-600">{s.village}</div>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={prev} className="btn-secondary text-sm">Previous</button>
            <button onClick={next} className="btn-primary text-sm">Next</button>
          </div>
        </div>
      </div>
    )
  }

  // FAQ accordion
  function HostFAQ() {
    const faqs = [
      { q: 'How do payouts work?', a: 'You keep 85% of booking revenue. Payouts are made directly to your account after confirmation.' },
      { q: 'Do I need special permits?', a: 'Most homestays do not, but check local rules. We provide guidance during onboarding.' },
      { q: 'What support do I get?', a: 'We help with listing setup, pricing tips, and guest communication best practices.' },
    ]
    const [open, setOpen] = useState<number | null>(0)
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-800 mb-4">Frequently asked questions</h3>
        <div className="divide-y divide-earth-200">
          {faqs.map((f, i) => (
            <button key={i} className="w-full text-left py-3 focus:outline-none" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-earth-800">{f.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </div>
              {open === i && <div className="mt-2 text-sm text-earth-600">{f.a}</div>}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="hero-modern">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <div className="kicker mb-2">Become a Host</div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Share your village with the world</h1>
            <p className="text-earth-600 mb-6">Earn income, celebrate culture, and welcome travelers to authentic rural experiences.</p>
            <div className="flex gap-3 justify-center">
              <a href="#create-listing" className="btn-primary">Create your listing</a>
              <a href="/about" className="btn-ghost">Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Benefit icon={Shield} title="Fair earnings" desc="Keep 85% of booking revenue with transparent splits" />
            <Benefit icon={Users} title="Community first" desc="Bring visibility and opportunities to local families" />
            <Benefit icon={Sparkles} title="Easy setup" desc="List with photos and voice input in minutes" />
          </div>
        </div>
      </section>

      {/* How it works (compact) */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ n: '1', t: 'Add details', d: 'Describe your homestay and experiences' }, { n: '2', t: 'Upload photos', d: 'Show your place, food, and activities' }, { n: '3', t: 'Go live', d: 'Get bookings and welcome guests' }].map((s) => (
              <div key={s.n} className="card p-6">
                <div className="badge mb-3">Step {s.n}</div>
                <div className="font-semibold text-earth-800">{s.t}</div>
                <div className="text-sm text-earth-600">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-custom py-8" id="create-listing">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-earth-800 mb-2">Create your first listing</h2>
            <p className="text-earth-600">Share your village culture and hospitality with travelers</p>
          </div>

          {/* Tabbed Interface */}
          <div className="bg-white rounded-xl shadow-sm border border-earth-200 mb-6">
            <div className="flex border-b border-earth-200">
              <button
                type="button"
                onClick={() => setActiveTab('village')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'village' 
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
                    : 'text-earth-600 hover:text-earth-800 hover:bg-earth-50'
                }`}
              >
                <MapPin className="w-5 h-5 inline mr-2" />
                Village Listing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'experience' 
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
                    : 'text-earth-600 hover:text-earth-800 hover:bg-earth-50'
                }`}
              >
                <Star className="w-5 h-5 inline mr-2" />
                Experience
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('volunteer')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'volunteer' 
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
                    : 'text-earth-600 hover:text-earth-800 hover:bg-earth-50'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Volunteer Opportunity
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">
              {error}
            </div>
          )}

          {/* Village Listing Form */}
          {activeTab === 'village' && (
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
              <h3 className="text-xl font-semibold text-earth-800 mb-6">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Experience Title *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Traditional Rajasthani Village Homestay"
                      className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <VoiceInputButton
                      onResult={(text) => handleInputChange('title', text)}
                      disabled={false}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Village Name *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      placeholder="e.g., Pushkar"
                      className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <VoiceInputButton
                      onResult={(text) => handleInputChange('village', text)}
                      disabled={false}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Price per Night (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="2500"
                    min="0"
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Description *
                </label>
                <div className="flex">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your village experience, what makes it unique, and what guests can expect..."
                    rows={4}
                    className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <VoiceInputButton
                    onResult={(text) => handleInputChange('description', formData.description ? formData.description + ' ' + text : text)}
                    disabled={false}
                  />
                </div>
              </div>
            </div>

            {/* Accommodation Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
              <h3 className="text-xl font-semibold text-earth-800 mb-6">Accommodation Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Maximum Guests *
                  </label>
                  <input
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                    placeholder="4"
                    min="1"
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="2"
                    min="0"
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="1"
                    min="0"
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
              <h3 className="text-xl font-semibold text-earth-800 mb-6">Amenities</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-earth-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experiences */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
              <h3 className="text-xl font-semibold text-earth-800 mb-6">Experiences Offered</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experienceTypes.map(experience => (
                  <label key={experience} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.experiences.includes(experience)}
                      onChange={() => toggleExperience(experience)}
                      className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-earth-700">{experience}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
              <h3 className="text-xl font-semibold text-earth-800 mb-6">Photos</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-earth-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-earth-400 mx-auto mb-2" />
                  <p className="text-earth-600 mb-2">Upload photos of your village experience</p>
                  <p className="text-sm text-earth-500 mb-4">Maximum 10 images, JPG or PNG</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary cursor-pointer"
                  >
                    Choose Images
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block align-middle"></div>
                    <span className="align-middle ml-2">Creating Listing...</span>
                  </>
                ) : (
                  'Create Listing'
                )}
              </button>
              <div className="mt-3 text-sm text-earth-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                You can edit your listing anytime from Host Dashboard
              </div>
            </div>
          </form>
          )}

          {/* Experience Form */}
          {activeTab === 'experience' && (
            <form onSubmit={handleExperienceSubmit} className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
                <h3 className="text-xl font-semibold text-earth-800 mb-6">Experience Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Experience Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Traditional Pottery Workshop"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      placeholder="2"
                      min="1"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Price per person (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="500"
                      min="0"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Village Center"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Experience Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what guests will experience, learn, and take away..."
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    What's Included
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Materials, refreshments, take-home items, etc."
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Create Experience
                </button>
              </div>
            </form>
          )}

          {/* Volunteer Form */}
          {activeTab === 'volunteer' && (
            <form onSubmit={handleVolunteerSubmit} className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200">
                <h3 className="text-xl font-semibold text-earth-800 mb-6">Volunteer Opportunity Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Opportunity Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Teaching English to Village Children"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Duration (weeks) *
                    </label>
                    <input
                      type="number"
                      placeholder="2"
                      min="1"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Hours per day *
                    </label>
                    <input
                      type="number"
                      placeholder="4"
                      min="1"
                      max="12"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Accommodation Provided
                    </label>
                    <select className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Opportunity Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the volunteer work, impact, and what volunteers will contribute..."
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Skills Required
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Language skills, teaching experience, specific expertise..."
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Benefits for Volunteers
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Cultural immersion, skill development, accommodation, meals..."
                    className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Create Volunteer Opportunity
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Interactive sections */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EarningsCalculator />
            <HostStories />
          </div>
          <div className="space-y-6">
            <HostFAQ />
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-earth-800 mb-2">Need help?</h3>
              <p className="text-sm text-earth-600 mb-3">Our team can guide you through onboarding and best practices.</p>
              <a href="/contact" className="btn-primary w-full text-center">Talk to us</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default HostPage