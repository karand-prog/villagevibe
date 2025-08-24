'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Star, Users, Calendar, Heart, Clock, Award, Navigation, Info, Camera, Utensils, Mountain, TreePine, Building2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StrongMap from '@/components/StrongMap'
import { useAuth } from '@/components/AuthContext'
import { useSaved } from '@/components/SavedContext'
import { useBookings } from '@/components/BookingContext'
import EnhancedBookingModal from '@/components/EnhancedBookingModal'
import ReviewsSection from '@/components/ReviewsSection'
import Toast from '@/components/Toast'

// Sample data for the villages
const villageData: { [key: string]: any } = {
  'manali-valley': {
    _id: 'manali-valley',
    title: 'Serene Mountain Retreat - Manali',
    description: 'Nestled in the majestic Himalayas, this traditional village offers breathtaking views of snow-capped peaks and pristine valleys. Experience authentic mountain culture and warm hospitality.',
    location: { 
      village: 'Manali Valley', 
      state: 'Himachal Pradesh',
      coordinates: [32.2432, 77.1892]
    },
    price: 2500,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    amenities: ['Mountain View', 'Traditional Food', 'Local Guide', 'Adventure Activities', 'WiFi', 'Hot Water', 'Garden'],
    host: {
      name: 'Rajesh Thakur',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.9,
      totalHostings: 45,
      description: 'Local mountain guide with 15+ years of experience in Himalayan tourism'
    },
    highlights: ['Himalayan Trekking', 'Local Cuisine', 'Cultural Festivals', 'Adventure Sports'],
    gettingThere: 'Fly to Kullu Airport (KUU) or take a bus from Delhi. The village is 2 hours from Manali town.',
    bestTime: 'March to June and September to November',
    activities: ['Mountain Trekking', 'Local Market Visit', 'Traditional Cooking Classes', 'Village Walks'],
    experienceDetails: 'Immerse yourself in the authentic mountain lifestyle. Learn traditional cooking methods, participate in local festivals, and explore hidden trails with experienced guides.',
    accommodation: 'Traditional wooden cottages with modern amenities, offering panoramic mountain views.',
    localCuisine: 'Authentic Himachali dishes including Dham, Siddu, and local trout preparations.',
    culturalHighlights: 'Experience traditional folk dances, music performances, and local handicraft workshops.',
    adventureOptions: 'Guided treks to nearby peaks, river rafting, and mountain biking adventures.',
    seasonalAttractions: 'Spring brings blooming rhododendrons, summer offers pleasant weather, autumn showcases golden landscapes, and winter provides snow activities.'
  },
  'gokarna-beach': {
    _id: 'gokarna-beach',
    title: 'Coastal Paradise Village - Gokarna',
    description: 'Discover the untouched beauty of coastal India where pristine beaches meet traditional fishing communities. Experience the rhythm of ocean life and authentic coastal culture.',
    location: { 
      village: 'Gokarna Beach', 
      state: 'Karnataka',
      coordinates: [14.5500, 74.3167]
    },
    price: 1800,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
    ],
    amenities: ['Beach Access', 'Fresh Seafood', 'Boat Tours', 'Sunset Views', 'Beach Huts', 'Local Guide'],
    host: {
      name: 'Priya Menon',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      rating: 4.7,
      totalHostings: 32,
      description: 'Local fishing community leader and cultural ambassador'
    },
    highlights: ['Pristine Beaches', 'Fresh Seafood', 'Traditional Fishing', 'Sunset Views'],
    gettingThere: 'Fly to Goa Airport (GOI) or take a train to Gokarna Road. The village is 30 minutes from the station.',
    bestTime: 'October to March',
    activities: ['Beach Walks', 'Fishing Tours', 'Seafood Cooking', 'Sunset Cruises'],
    experienceDetails: 'Live like a local fisherman in this coastal paradise. Learn traditional fishing techniques, enjoy fresh seafood, and experience the peaceful rhythm of coastal life.',
    accommodation: 'Traditional beach huts and modern cottages with ocean views and sea breeze.',
    localCuisine: 'Fresh seafood including prawns, fish curry, and traditional coastal delicacies.',
    culturalHighlights: 'Traditional fishing demonstrations, local temple visits, and cultural performances.',
    adventureOptions: 'Boat tours, snorkeling, and guided beach exploration.',
    seasonalAttractions: 'Monsoon brings lush greenery, post-monsoon offers clear skies, and winter provides pleasant weather for beach activities.'
  },
  'jaisalmer-desert': {
    _id: 'jaisalmer-desert',
    title: 'Golden Desert Village - Jaisalmer',
    description: 'Experience the magic of the Thar Desert in this traditional Rajasthani village. Stay in authentic mud houses and experience the rich culture of the desert people.',
    location: { 
      village: 'Jaisalmer Desert', 
      state: 'Rajasthan',
      coordinates: [26.9157, 70.9083]
    },
    price: 2200,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    amenities: ['Desert Views', 'Traditional Food', 'Camel Rides', 'Cultural Shows', 'Desert Camp', 'Local Guide'],
    host: {
      name: 'Lakshmi Singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.8,
      totalHostings: 28,
      description: 'Desert culture expert and traditional crafts preservationist'
    },
    highlights: ['Desert Landscape', 'Traditional Architecture', 'Cultural Heritage', 'Camel Safaris'],
    gettingThere: 'Fly to Jaisalmer Airport (JSA) or take a train to Jaisalmer Junction. The village is 45 minutes from the city.',
    bestTime: 'October to March',
    activities: ['Desert Safaris', 'Cultural Performances', 'Traditional Cooking', 'Village Tours'],
    experienceDetails: 'Experience the authentic desert lifestyle in traditional mud houses. Learn about desert culture, enjoy folk music, and explore the golden sands on camelback.',
    accommodation: 'Traditional mud houses with modern comforts, offering stunning desert views.',
    localCuisine: 'Authentic Rajasthani dishes including Dal Baati Churma, Gatte ki Sabzi, and traditional sweets.',
    culturalHighlights: 'Folk music performances, traditional dance shows, and local handicraft demonstrations.',
    adventureOptions: 'Camel safaris, desert camping, and cultural village tours.',
    seasonalAttractions: 'Winter offers pleasant weather, spring brings desert blooms, and monsoon transforms the landscape with greenery.'
  },
  'darjeeling-hills': {
    _id: 'darjeeling-hills',
    title: 'Tea Estate Village - Darjeeling',
    description: 'Immerse yourself in the world of tea in this picturesque hill station. Stay in traditional tea estate bungalows and learn about tea cultivation from local experts.',
    location: { 
      village: 'Darjeeling Hills', 
      state: 'West Bengal',
      coordinates: [27.0360, 88.2626]
    },
    price: 3000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    amenities: ['Tea Estate Views', 'Tea Tasting', 'Mountain Trekking', 'Local Guide', 'Garden', 'WiFi'],
    host: {
      name: 'Amit Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.9,
      totalHostings: 56,
      description: 'Tea estate owner and expert tea taster with generations of experience'
    },
    highlights: ['Tea Plantations', 'Mountain Views', 'Local Culture', 'Adventure Activities'],
    gettingThere: 'Fly to Bagdogra Airport (IXB) or take a train to New Jalpaiguri. The village is 3 hours from the airport.',
    bestTime: 'March to May and September to November',
    activities: ['Tea Tasting Tours', 'Mountain Trekking', 'Local Market Visit', 'Cultural Shows'],
    experienceDetails: 'Live in the heart of tea country and learn the art of tea cultivation. Experience the traditional tea-making process and enjoy panoramic mountain views.',
    accommodation: 'Heritage tea estate bungalows with modern amenities and stunning plantation views.',
    localCuisine: 'Traditional Darjeeling tea, local Nepali dishes, and fresh organic produce from the estate.',
    culturalHighlights: 'Tea cultivation workshops, local market visits, and cultural performances.',
    adventureOptions: 'Mountain trekking, tea garden walks, and local village exploration.',
    seasonalAttractions: 'Spring brings tea garden blooms, summer offers pleasant weather, autumn showcases golden landscapes, and winter provides clear mountain views.'
  },
  'alleppey-backwaters': {
    _id: 'alleppey-backwaters',
    title: 'Backwaters Village - Alleppey',
    description: 'Experience the serene beauty of Kerala\'s backwaters in this traditional village. Stay in houseboats and experience the unique lifestyle of the backwater communities.',
    location: { 
      village: 'Alleppey Backwaters', 
      state: 'Kerala',
      coordinates: [9.4981, 76.3388]
    },
    price: 2800,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
    ],
    amenities: ['Backwater Views', 'Houseboat Stay', 'Local Cuisine', 'Boat Tours', 'Fishing', 'Local Guide'],
    host: {
      name: 'Maria Fernandes',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      rating: 4.8,
      totalHostings: 41,
      description: 'Local backwater expert and traditional houseboat operator'
    },
    highlights: ['Backwater Views', 'Traditional Houseboats', 'Local Cuisine', 'Cultural Heritage'],
    gettingThere: 'Fly to Cochin Airport (COK) or take a train to Alleppey. The village is 1 hour from the station.',
    bestTime: 'June to March',
    activities: ['Houseboat Cruises', 'Local Cooking Classes', 'Village Walks', 'Cultural Performances'],
    experienceDetails: 'Float through the serene backwaters in traditional houseboats. Experience the unique lifestyle of backwater communities and learn about local traditions.',
    accommodation: 'Traditional houseboats with modern comforts, offering stunning backwater views.',
    localCuisine: 'Fresh seafood, traditional Kerala dishes, and local spices and flavors.',
    culturalHighlights: 'Traditional boat races, local temple visits, and cultural performances.',
    adventureOptions: 'Houseboat cruises, fishing tours, and village exploration.',
    seasonalAttractions: 'Monsoon brings lush greenery, post-monsoon offers clear skies, and winter provides pleasant weather for backwater activities.'
  },
  'bastar-tribal': {
    _id: 'bastar-tribal',
    title: 'Tribal Village - Bastar',
    description: 'Discover the rich tribal culture of Chhattisgarh in this authentic village. Experience traditional tribal life, customs, and handicrafts in their natural setting.',
    location: { 
      village: 'Bastar Region', 
      state: 'Chhattisgarh',
      coordinates: [19.1071, 81.9535]
    },
    price: 1500,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    amenities: ['Tribal Culture', 'Traditional Food', 'Local Guide', 'Handicraft Workshops', 'Cultural Shows', 'Village Tours'],
    host: {
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.6,
      totalHostings: 23,
      description: 'Local tribal community leader and cultural preservationist'
    },
    highlights: ['Tribal Culture', 'Traditional Handicrafts', 'Local Festivals', 'Natural Beauty'],
    gettingThere: 'Fly to Raipur Airport (RPR) or take a train to Jagdalpur. The village is 2 hours from the city.',
    bestTime: 'October to March',
    activities: ['Tribal Dance Shows', 'Handicraft Workshops', 'Village Tours', 'Cultural Festivals'],
    experienceDetails: 'Immerse yourself in authentic tribal culture and traditions. Learn about local customs, participate in traditional festivals, and explore tribal handicrafts.',
    accommodation: 'Traditional tribal huts with modern amenities, offering authentic cultural experience.',
    localCuisine: 'Traditional tribal dishes, local forest produce, and authentic tribal cooking methods.',
    culturalHighlights: 'Traditional dance performances, handicraft workshops, and local festival participation.',
    adventureOptions: 'Village tours, forest walks, and cultural immersion activities.',
    seasonalAttractions: 'Winter offers pleasant weather, spring brings tribal festivals, and monsoon showcases lush forest landscapes.'
  }
}

export default function VillageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { savedListings, toggleListing, isListingSaved } = useSaved()
  const [village, setVillage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)

  // Get village data including mock listings
  const getVillageData = (id: string) => {
    // First check sample data
    if (villageData[id]) {
      return villageData[id]
    }
    
    // Then check mock listings from localStorage
    if (typeof window !== 'undefined') {
      try {
        const mockListings = JSON.parse(localStorage.getItem('mockListings') || '[]')
        const mockVillage = mockListings.find((listing: any) => listing._id === id)
        if (mockVillage) {
          // Enhance mock village with additional details
          return {
            ...mockVillage,
            amenities: mockVillage.amenities || ['WiFi', 'Traditional Food', 'Local Guide'],
            highlights: mockVillage.highlights || ['Traditional Village Experience'],
            gettingThere: 'Contact host for detailed directions',
            bestTime: 'Year-round',
            activities: ['Village Walks', 'Cultural Activities', 'Local Cuisine'],
            experienceDetails: mockVillage.description,
            accommodation: 'Traditional village accommodation with modern amenities',
            localCuisine: 'Authentic local dishes prepared with fresh ingredients',
            culturalHighlights: 'Experience local traditions, festivals, and community life',
            adventureOptions: 'Guided village tours and cultural activities',
            seasonalAttractions: 'Experience different aspects of village life throughout the year'
          }
        }
      } catch (error) {
        console.warn('Error parsing mock listings:', error)
      }
    }
    
    return null
  }

  // Check if village is already booked by current user
  const isVillageBooked = () => {
    if (!user || !village) return false
    // For now, return false since we don't have real booking data
    // This will be updated when we implement real booking tracking
    return false
  }

  const handlePaymentSuccess = (paymentId: string, method: string) => {
    setToast({ 
      message: `Payment successful via ${method}! Your booking is confirmed.`, 
      type: 'success' 
    })
    setShowBookingModal(false)
  }

  const handleBookingSuccess = () => {
    setToast({ message: 'Booking successful! Your trip is confirmed.', type: 'success' })
    setShowBookingModal(false)
    // Refresh the page or update the UI
    window.dispatchEvent(new Event('dashboardRefresh'))
  }

  useEffect(() => {
    const villageId = params.id as string
    const villageInfo = getVillageData(villageId)
    
    if (villageInfo) {
      setVillage(villageInfo)
    } else {
      router.push('/explore')
    }
    setLoading(false)
  }, [params.id, router])

  const handleSaveToggle = () => {
    if (!user) {
      setToast({ message: 'Please sign in to save villages', type: 'error' })
      return
    }
    
    toggleListing(village._id)
    setToast({ 
      message: isListingSaved(village._id) ? 'Removed from saved' : 'Saved to favorites', 
      type: 'success' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!village) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-earth-800 mb-2">Village Not Found</h2>
            <p className="text-earth-600">The village you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Image Gallery */}
      <section className="relative">
        <div className="relative h-96 overflow-hidden">
          <Image
            src={village.images[currentImageIndex]}
            alt={village.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          {/* Image Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {village.images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
              </div>
              </div>
        
        {/* Village Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="container-custom">
            <h1 className="text-4xl font-display font-bold text-white mb-2">{village.title}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{village.location.village}, {village.location.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{village.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
                  <div>
                <h2 className="text-2xl font-bold text-earth-800 mb-4">About this Village</h2>
                <p className="text-earth-600 leading-relaxed">{village.description}</p>
                  </div>

              {/* Experience Details */}
                  <div>
                <h2 className="text-2xl font-bold text-earth-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary-600" />
                  Experience Details
                </h2>
                <p className="text-earth-600 leading-relaxed mb-4">{village.experienceDetails}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-earth-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-earth-800 mb-2">Accommodation</h4>
                    <p className="text-earth-600 text-sm">{village.accommodation}</p>
                  </div>
                  <div className="bg-earth-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-earth-800 mb-2">Local Cuisine</h4>
                    <p className="text-earth-600 text-sm">{village.localCuisine}</p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <h2 className="text-2xl font-bold text-earth-800 mb-4">Activities You Can Enjoy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {village.activities.map((activity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-earth-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-earth-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Getting There */}
              <div>
                <h2 className="text-2xl font-bold text-earth-800 mb-4 flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-primary-600" />
                  Getting There
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-earth-700 mb-2">{village.gettingThere}</p>
                  <div className="flex items-center gap-2 text-sm text-earth-600">
                    <Clock className="w-4 h-4" />
                    <span>Best time to visit: {village.bestTime}</span>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div>
                <h2 className="text-2xl font-bold text-earth-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary-600" />
                  Location
                </h2>
                <div className="bg-white border border-earth-200 rounded-xl overflow-hidden">
                  <StrongMap 
                    lat={village.location.coordinates[0]} 
                    lng={village.location.coordinates[1]} 
                    title={village.title}
                  />
                </div>
                <div className="mt-3 text-sm text-earth-600">
                  <p><strong>Village:</strong> {village.location.village}</p>
                  <p><strong>State:</strong> {village.location.state}</p>
                  <p><strong>Coordinates:</strong> {village.location.coordinates[0].toFixed(4)}, {village.location.coordinates[1].toFixed(4)}</p>
                </div>
              </div>

              {/* Cultural Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-earth-800 mb-4">Cultural Highlights</h2>
                <div className="space-y-3">
                  <div className="bg-earth-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-earth-800 mb-2">Local Traditions</h4>
                    <p className="text-earth-600 text-sm">{village.culturalHighlights}</p>
                  </div>
                  <div className="bg-earth-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-earth-800 mb-2">Adventure Options</h4>
                    <p className="text-earth-600 text-sm">{village.adventureOptions}</p>
                  </div>
                  <div className="bg-earth-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-earth-800 mb-2">Seasonal Attractions</h4>
                    <p className="text-earth-600 text-sm">{village.seasonalAttractions}</p>
                    </div>
                </div>
              </div>

              {/* Reviews Section */}
              <ReviewsSection listingId={village._id} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-white border border-earth-200 rounded-xl p-6 shadow-lg sticky top-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary-600 mb-1">₹{village.price.toLocaleString()}</div>
                  <div className="text-earth-600">per night</div>
                  </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full btn-primary py-3 text-lg font-semibold"
                    disabled={isVillageBooked()}
                  >
                    {isVillageBooked() ? 'Already Booked' : 'Book Now'}
                  </button>
                  
                  <button
                    onClick={handleSaveToggle}
                    className={`w-full py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                      isListingSaved(village._id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-earth-300 text-earth-700 hover:border-primary-400 hover:bg-primary-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 inline mr-2 ${isListingSaved(village._id) ? 'fill-current' : ''}`} />
                    {isListingSaved(village._id) ? 'Saved' : 'Save to Wishlist'}
                  </button>
                </div>
                
                {/* Quick Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">Rating</span>
                    <span className="font-medium">{village.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">Host</span>
                    <span className="font-medium">{village.host.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth-600">Experience</span>
                    <span className="font-medium">{village.host.totalHostings} hostings</span>
                  </div>
                </div>
              </div>

              {/* Host Information */}
              <div className="bg-earth-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-earth-800 mb-4">About Your Host</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={village.host.avatar}
                    alt={village.host.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                    <div>
                    <div className="font-medium text-earth-800">{village.host.name}</div>
                    <div className="flex items-center gap-1 text-sm text-earth-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{village.host.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-earth-600">{village.host.description}</p>
              </div>

              {/* Amenities */}
              <div className="bg-earth-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-earth-800 mb-4">What's Included</h3>
                <div className="space-y-2">
                  {village.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-earth-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Booking Modal */}
      {showBookingModal && (
        <EnhancedBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          village={village}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}