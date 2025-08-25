'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { MapPin, Star, Clock, Heart, Calendar } from 'lucide-react'
import { useSaved } from '@/components/SavedContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import { useDataBus } from '@/components/DataBus'
import EnhancedBookingModal from '@/components/EnhancedBookingModal'

interface Experience {
  _id: string
  title: string
  description: string
  price: number
  rating: number
  maxParticipants: number
  duration: string
  location: {
    village: string
    state: string
    coordinates: number[]
  }
  images: string[]
  host: {
    name: string
    avatar: string
    rating: number
    totalExperiences: number
  }
  included: string[]
  schedule: string[]
  type: string
}

const categories = ['All', 'Mountain Homestay', 'Beach Homestay', 'Desert Camp', 'Tea Estate Stay', 'Houseboat Stay', 'Tribal Homestay']

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sort, setSort] = useState<'rating_desc'|'price_asc'|'price_desc'>('rating_desc')
  const [visible, setVisible] = useState(9)
  const { savedExperiences, toggleExperience } = useSaved()
  const router = useRouter()
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const { counters } = useDataBus()
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const handleBookNow = (experience: Experience) => {
    setSelectedExperience(experience)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = () => {
    setToast({ 
      message: 'Experience booked successfully!', 
      type: 'success' 
    })
    setShowBookingModal(false)
    setSelectedExperience(null)
    // Dispatch dashboard refresh event
    window.dispatchEvent(new CustomEvent('dashboardRefresh'))
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Since we don't have a real API endpoint, use fallback data directly
        setExperiences(sampleExperiences)
      } catch (e: any) {
        setError('Unable to load experiences right now.')
        // Use sample data as fallback
        setExperiences(sampleExperiences)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    const arr = experiences.filter((exp) => {
      const matchQuery = !query ||
        exp.title.toLowerCase().includes(query.toLowerCase()) ||
        exp.description.toLowerCase().includes(query.toLowerCase()) ||
        exp.location.village.toLowerCase().includes(query.toLowerCase()) ||
        exp.location.state.toLowerCase().includes(query.toLowerCase())
      const matchCategory = selectedCategory === 'All' || exp.type === selectedCategory
      return matchQuery && matchCategory
    })
    const sorted = arr.sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      return b.rating - a.rating
    })
    return sorted
  }, [experiences, query, selectedCategory, sort])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) {
        setVisible((v) => Math.min(v + 9, filtered.length))
      }
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [filtered.length])

  const sampleExperiences = [
    {
      _id: '1',
      title: 'Himalayan Village Trekking Adventure',
      description: 'Embark on an unforgettable journey through remote Himalayan villages. Experience authentic mountain culture, traditional hospitality, and breathtaking landscapes while learning about local customs and traditions.',
      price: 3500,
      rating: 4.9,
      maxParticipants: 8,
      duration: '3 days',
      location: {
        village: 'Manali Valley',
        state: 'Himachal Pradesh',
        coordinates: [32.2432, 77.1892]
      },
      images: [
        'https://picsum.photos/800/600?random=11',
        'https://picsum.photos/800/600?random=12'
      ],
      host: {
        name: 'Rajesh Kumar',
        avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random&color=fff&size=100',
        rating: 4.8,
        totalExperiences: 45
      },
      included: ['Accommodation', 'All Meals', 'Local Guide', 'Equipment', 'Transport'],
      schedule: [
        'Day 1: Arrival and village orientation',
        'Day 2: Mountain trekking and cultural activities',
        'Day 3: Local market visit and departure'
      ],
      type: 'experience'
    },
    {
      _id: '2',
      title: 'Coastal Fishing Village Experience',
      description: 'Immerse yourself in the traditional fishing lifestyle of coastal India. Learn traditional fishing techniques, enjoy fresh seafood, and experience the rhythm of ocean life with local fishermen.',
      price: 2200,
      rating: 4.7,
      maxParticipants: 6,
      duration: '2 days',
      location: {
        village: 'Gokarna Beach',
        state: 'Karnataka',
        coordinates: [14.5500, 74.3167]
      },
      images: [
        'https://picsum.photos/800/600?random=13',
        'https://picsum.photos/800/600?random=14'
      ],
      host: {
        name: 'Priya Sharma',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=random&color=fff&size=100',
        rating: 4.6,
        totalExperiences: 32
      },
      included: ['Fishing Equipment', 'Local Guide', 'Traditional Meals', 'Beach Accommodation', 'Boat Rides'],
      schedule: [
        'Day 1: Fishing techniques and boat preparation',
        'Day 2: Deep sea fishing and seafood cooking'
      ],
      type: 'experience'
    },
    {
      _id: '3',
      title: 'Desert Cultural Immersion',
      description: 'Experience the magic of the Thar Desert with traditional music, dance, and storytelling. Stay in traditional mud houses, enjoy camel safaris, and learn about desert survival skills.',
      price: 2800,
      rating: 4.8,
      maxParticipants: 10,
      duration: '2 days',
      location: {
        village: 'Jaisalmer Desert',
        state: 'Rajasthan',
        coordinates: [26.9117, 70.9227]
      },
      images: [
        'https://picsum.photos/800/600?random=15',
        'https://picsum.photos/800/600?random=16'
      ],
      host: {
        name: 'Amit Singh',
        avatar: 'https://ui-avatars.com/api/?name=Amit+Singh&background=random&color=fff&size=100',
        rating: 4.7,
        totalExperiences: 28
      },
      included: ['Desert Camp', 'Camel Safari', 'Cultural Performances', 'Traditional Meals', 'Stargazing'],
      schedule: [
        'Day 1: Desert arrival and cultural activities',
        'Day 2: Camel safari and sunset experience'
      ],
      type: 'experience'
    },
    {
      _id: '4',
      title: 'Tea Plantation Masterclass',
      description: 'Discover the art of tea making in the misty hills of Darjeeling. Learn about tea cultivation, processing, and tasting while staying in a traditional tea estate bungalow.',
      price: 4200,
      rating: 4.9,
      maxParticipants: 6,
      duration: '3 days',
      location: {
        village: 'Darjeeling Hills',
        state: 'West Bengal',
        coordinates: [27.0360, 88.3957]
      },
      images: [
        'https://picsum.photos/800/600?random=17',
        'https://picsum.photos/800/600?random=18'
      ],
      host: {
        name: 'Deepika Rai',
        avatar: 'https://ui-avatars.com/api/?name=Deepika+Rai&background=random&color=fff&size=100',
        rating: 4.9,
        totalExperiences: 67
      },
      included: ['Tea Estate Stay', 'Plantation Tours', 'Tea Tasting Sessions', 'Mountain Views', 'Local Cuisine'],
      schedule: [
        'Day 1: Tea estate orientation and history',
        'Day 2: Tea processing and tasting',
        'Day 3: Mountain trekking and local markets'
      ],
      type: 'experience'
    },
    {
      _id: '5',
      title: 'Backwaters Houseboat Journey',
      description: 'Float through the serene backwaters of Kerala in traditional houseboats. Experience the unique lifestyle of water villages, learn local fishing, and enjoy authentic Kerala cuisine.',
      price: 3800,
      rating: 4.6,
      maxParticipants: 8,
      duration: '2 days',
      location: {
        village: 'Alleppey Backwaters',
        state: 'Kerala',
        coordinates: [9.4981, 76.3388]
      },
      images: [
        'https://picsum.photos/800/600?random=19',
        'https://picsum.photos/800/600?random=20'
      ],
      host: {
        name: 'Krishna Menon',
        avatar: 'https://ui-avatars.com/api/?name=Krishna+Menon&background=random&color=fff&size=100',
        rating: 4.5,
        totalExperiences: 41
      },
      included: ['Houseboat Stay', 'Backwater Cruises', 'Fishing Experience', 'Ayurvedic Spa', 'Local Meals'],
      schedule: [
        'Day 1: Houseboat check-in and backwater cruise',
        'Day 2: Village visits and fishing activities'
      ],
      type: 'experience'
    },
    {
      _id: '6',
      title: 'Tribal Village Cultural Exchange',
      description: 'Connect with indigenous tribal communities in the dense forests of Central India. Learn traditional crafts, music, and sustainable living practices while supporting local communities.',
      price: 1900,
      rating: 4.4,
      maxParticipants: 5,
      duration: '2 days',
      location: {
        village: 'Bastar Region',
        state: 'Chhattisgarh',
        coordinates: [19.1071, 81.9535]
      },
      images: [
        'https://picsum.photos/800/600?random=21',
        'https://picsum.photos/800/600?random=22'
      ],
      host: {
        name: 'Suresh Patel',
        avatar: 'https://ui-avatars.com/api/?name=Suresh+Patel&background=random&color=fff&size=100',
        rating: 4.4,
        totalExperiences: 23
      },
      included: ['Tribal Homestay', 'Cultural Workshops', 'Forest Walks', 'Traditional Meals', 'Local Guide'],
      schedule: [
        'Day 1: Tribal village arrival and cultural introduction',
        'Day 2: Craft workshops and forest exploration'
      ],
      type: 'experience'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="hero-modern">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Cultural Experiences</h1>
          <p className="text-earth-600 mb-8 max-w-3xl mx-auto">Hands-on workshops and performances led by local artisans and artists.</p>
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input w-full"
                placeholder="Search experiences, villages, or states"
                aria-label="Search experiences"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category explainer */}
      <section className="py-6 bg-earth-50">
        <div className="container-custom text-center text-sm text-earth-600">
          Explore hands-on sessions like pottery and weaving under Crafts, authentic cooking with locals under Culinary,
          and folk music/dance workshops under Performance.
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-earth-600">{filtered.length} results</div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-earth-600">Sort by</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="input py-1 pr-8">
                <option value="rating_desc">Top rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded text-center">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-earth-600">No experiences found. Try different filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.slice(0, visible).map((exp) => (
                <div key={exp._id} className="card overflow-hidden hover:shadow-lg transition-shadow hover-card">
                  <div className="relative">
                    <Link href={`/experiences/${exp._id}`}>
                      <Image src={exp.images[0]} alt={exp.title} width={400} height={192} className="w-full h-48 object-cover" style={{ width: 'auto', height: 'auto' }} />
                    </Link>
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                      {exp.type}
                    </div>
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-earth-700">
                      Max: {exp.maxParticipants}
                    </div>
                  </div>
                  <div className="p-6">
                    <Link href={`/experiences/${exp._id}`} className="text-lg font-semibold text-earth-800 mb-1 block hover:underline">{exp.title}</Link>
                    <div className="flex items-center text-earth-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.location.village}, {exp.location.state}
                    </div>
                    <p className="text-sm text-earth-600 line-clamp-3 mb-3">{exp.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-earth-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {exp.duration}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{exp.rating}</span>
                        <span className="text-earth-600 text-sm ml-2">({exp.host.totalExperiences} experiences)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary-600">₹{exp.price.toLocaleString()}</div>
                      <div className="text-sm text-earth-600">per person</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.included.slice(0, 3).map((inc) => (
                        <span key={inc} className="badge">{inc}</span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-earth-500">
                      Schedule: {exp.schedule.join(' • ')}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        className={`flex-1 text-sm px-3 py-2 rounded-lg ${savedExperiences.has(exp._id) ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}
                        onClick={() => {
                          toggleExperience(exp._id)
                          setToast({ message: savedExperiences.has(exp._id) ? 'Removed from saved' : 'Saved to favorites', type: 'success' })
                        }}
                      >
                        {savedExperiences.has(exp._id) ? 'Saved' : 'Save'}
                      </button>
                      <button className="btn-primary flex-1" onClick={() => handleBookNow(exp)}>Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />
        </div>
      </section>

      {/* Tourist Experiences */}
      <section className="py-16 bg-earth-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">What travelers experienced</h2>
            <p className="text-earth-600">Real thoughts from tourists who joined cultural experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              name: 'Aarav', quote: 'The pottery workshop felt like going back in time. The artisan was so patient!', exp: 'Pottery - Crafts'
            },{
              name: 'Diya', quote: 'We learned to cook 3 traditional dishes and ate with the host family. Unforgettable!', exp: 'Cooking - Culinary'
            },{
              name: 'Kabir', quote: 'The folk dance workshop was energetic and welcoming. We even performed!', exp: 'Dance - Performance'
            }].map((t, i) => (
              <div key={i} className="card p-6">
                <div className="text-earth-700 italic mb-3">“{t.quote}”</div>
                <div className="text-sm text-earth-600">— {t.name} • {t.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedExperience && (
        <EnhancedBookingModal
          isOpen={showBookingModal}
          village={{
            _id: selectedExperience._id,
            title: selectedExperience.title,
            description: selectedExperience.description,
            price: selectedExperience.price,
            rating: selectedExperience.rating,
            images: selectedExperience.images,
            location: selectedExperience.location
          }}
          onBookingSuccess={handleBookingSuccess}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedExperience(null)
          }}
        />
      )}
    </div>
  )
}


