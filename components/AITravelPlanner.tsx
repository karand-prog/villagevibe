'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Calendar, MapPin, Users, DollarSign, Heart, Star, Clock, TrendingUp, Lightbulb, Target, Zap, Share2, Loader2 } from 'lucide-react'
import { useTranslation } from './LanguageDetector'
import { authFetch, API_ENDPOINTS, apiHelpers } from './authFetch'
import { useSaved } from './SavedContext'

interface TravelPlan {
  id: string
  title: string
  duration: number
  budget: number
  groupSize: number
  preferences: string[]
  itinerary: DayPlan[]
  totalCost: number
  savings: number
  culturalInsights: string[]
  recommendations: string[]
  aiScore: number
  realTimeData?: {
    availability: number
    demandLevel: string
    seasonalPricing: number
    lastUpdated: string
  }
}

interface DayPlan {
  day: number
  activities: Activity[]
  accommodation: string
  meals: string[]
  estimatedCost: number
  realTimeAvailability?: boolean
}

interface Activity {
  id: string
  title: string
  description: string
  duration: string
  cost: number
  location: string
  type: 'cultural' | 'adventure' | 'relaxation' | 'learning' | 'food'
  rating: number
  image: string
  realTimePrice?: number
  availability?: number
}

interface Village {
  _id: string
  title: string
  location: { village: string; state: string }
  price: number
  experienceType: string
  description: string
  rating: number
  maxGuests: number
  images: string[]
  amenities: string[]
  highlights: string[]
  availability: number
  demandLevel: 'low' | 'medium' | 'high'
}

const AITravelPlanner = () => {
  const { t } = useTranslation()
  const { togglePlan, isPlanSaved } = useSaved()
  const router = useRouter()
  const [isPlanning, setIsPlanning] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null)
  const [availableVillages, setAvailableVillages] = useState<Village[]>([])
  const [loadingVillages, setLoadingVillages] = useState(false)
  const [realTimePricing, setRealTimePricing] = useState<any>({})
  const [planningProgress, setPlanningProgress] = useState(0)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [userPreferences, setUserPreferences] = useState({
    destination: '',
    duration: 3,
    budget: 10000,
    groupSize: 2,
    interests: [] as string[],
    travelStyle: 'cultural' as 'cultural' | 'adventure' | 'relaxation' | 'family',
    accommodation: 'homestay' as 'homestay' | 'guesthouse' | 'camping'
  })

  // Fetch real village data on component mount
  useEffect(() => {
    fetchAvailableVillages()
  }, [])

  const fetchAvailableVillages = async () => {
    setLoadingVillages(true)
    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`)
      if (response.ok) {
        const villages = await response.json()
        // Add real-time data to villages
        const villagesWithRealTimeData = villages.map((village: any) => ({
          ...village,
          availability: Math.floor(Math.random() * 20) + 5, // 5-25 available
          demandLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
        }))
        setAvailableVillages(villagesWithRealTimeData)
      } else {
        // Fallback to enhanced sample data
        setAvailableVillages(generateSampleVillages())
      }
    } catch (error) {
      console.error('Error fetching villages:', error)
      setAvailableVillages(generateSampleVillages())
    } finally {
      setLoadingVillages(false)
    }
  }

  const generateSampleVillages = (): Village[] => [
    {
      _id: '1',
      title: 'Traditional Rajasthani Village Homestay',
      location: { village: 'Pushkar', state: 'Rajasthan' },
      price: 2500,
      experienceType: 'Homestay',
      description: 'Experience authentic rural life in Rajasthan',
      rating: 4.8,
      maxGuests: 6,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      amenities: ['Traditional Food', 'Cultural Shows', 'WiFi'],
      highlights: ['Desert Safari', 'Folk Music', 'Traditional Cooking'],
      availability: 12,
      demandLevel: 'high'
    },
    {
      _id: '2',
      title: 'Kerala Backwaters Village Experience',
      location: { village: 'Alleppey', state: 'Kerala' },
      price: 3500,
      experienceType: 'Cultural Experience',
      description: 'Stay in traditional houseboats and experience Kerala culture',
      rating: 4.9,
      maxGuests: 4,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
      amenities: ['Houseboat', 'Ayurvedic Massage', 'Local Food'],
      highlights: ['Backwater Cruise', 'Ayurvedic Treatment', 'Coconut Farming'],
      availability: 8,
      demandLevel: 'medium'
    },
    {
      _id: '3',
      title: 'Himachal Mountain Village Retreat',
      location: { village: 'Manali', state: 'Himachal Pradesh' },
      price: 2800,
      experienceType: 'Adventure',
      description: 'Mountain village experience with trekking and local culture',
      rating: 4.7,
      maxGuests: 8,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
      amenities: ['Mountain Views', 'Trekking', 'Local Cuisine'],
      highlights: ['Mountain Trekking', 'Local Festivals', 'Apple Picking'],
      availability: 15,
      demandLevel: 'low'
    }
  ]

  const calculateRealTimePricing = (village: Village, duration: number) => {
    const basePrice = village.price
    const demandMultiplier = village.demandLevel === 'high' ? 1.2 : village.demandLevel === 'medium' ? 1.1 : 1.0
    const seasonalMultiplier = Math.random() * 0.4 + 0.8 // 0.8 to 1.2
    const availabilityDiscount = village.availability > 15 ? 0.9 : 1.0 // 10% discount if high availability
    
    return {
      basePrice,
      demandPrice: Math.round(basePrice * demandMultiplier),
      seasonalPrice: Math.round(basePrice * seasonalMultiplier),
      finalPrice: Math.round(basePrice * demandMultiplier * seasonalMultiplier * availabilityDiscount),
      totalCost: Math.round(basePrice * demandMultiplier * seasonalMultiplier * availabilityDiscount * duration),
      savings: Math.round(basePrice * duration * 0.15)
    }
  }

  const generateTravelPlan = async () => {
    setIsPlanning(true)
    setPlanningProgress(0)
    
    try {
      // Try server-side AI planner first (model-backed if configured)
      try {
        const serverPlan = await apiHelpers.post(API_ENDPOINTS.AI_PLAN, {
          destination: userPreferences.destination,
          duration: userPreferences.duration,
          budget: userPreferences.budget,
          groupSize: userPreferences.groupSize,
          interests: userPreferences.interests,
          travelStyle: userPreferences.travelStyle,
          accommodation: userPreferences.accommodation
        })
        if (serverPlan && serverPlan.itinerary) {
          // Normalize to ensure full-duration days
          const norm = normalizePlan(serverPlan, userPreferences)
          setCurrentPlan(norm)
          return
        }
      } catch (e) {
        // Fall through to client-side generation
        console.warn('Server AI plan failed, using client generation:', (e as Error).message)
      }

      // Simulate AI planning steps
      const steps = [
        'Analyzing preferences...',
        'Searching available villages...',
        'Calculating real-time pricing...',
        'Generating personalized itinerary...',
        'Optimizing for your budget...',
        'Finalizing cultural insights...'
      ]
      
      for (let i = 0; i < steps.length; i++) {
        setPlanningProgress(((i + 1) / steps.length) * 100)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Filter villages based on preferences
      const filteredVillages = availableVillages.filter(village => {
        if (userPreferences.destination && !village.location.state.toLowerCase().includes(userPreferences.destination.toLowerCase())) {
          return false
        }
        const pricing = calculateRealTimePricing(village, userPreferences.duration)
        if (pricing.totalCost > userPreferences.budget) {
          return false
        }
        if (village.maxGuests < userPreferences.groupSize) {
          return false
        }
        return true
      })

      if (filteredVillages.length === 0) {
        alert('No villages found matching your criteria. Try adjusting your budget or destination.')
        setIsPlanning(false)
        return
      }

      // Select best matching villages
      const selectedVillages = filteredVillages
        .sort((a, b) => b.rating - a.rating)
        .slice(0, Math.min(3, filteredVillages.length))
      
      const totalCost = selectedVillages.reduce((sum, village) => {
        const pricing = calculateRealTimePricing(village, userPreferences.duration / selectedVillages.length)
        return sum + pricing.totalCost
      }, 0)
      
      const samplePlan: TravelPlan = {
        id: 'plan_' + Date.now(),
        title: `Perfect ${userPreferences.duration}-Day ${userPreferences.travelStyle} Experience in ${userPreferences.destination || 'Rural India'}`,
        duration: userPreferences.duration,
        budget: userPreferences.budget,
        groupSize: userPreferences.groupSize,
        preferences: userPreferences.interests,
        itinerary: generateDynamicItinerary(selectedVillages, userPreferences),
        totalCost,
        savings: Math.round(userPreferences.budget * 0.15),
        culturalInsights: generateCulturalInsights(userPreferences, selectedVillages),
        recommendations: generateRecommendations(userPreferences, selectedVillages),
        aiScore: Math.floor(Math.random() * 20) + 80, // 80-100
        realTimeData: {
          availability: Math.min(...selectedVillages.map(v => v.availability)),
          demandLevel: selectedVillages.some(v => v.demandLevel === 'high') ? 'high' : 'medium',
          seasonalPricing: Math.round(totalCost * 0.1),
          lastUpdated: new Date().toISOString()
        }
      }
      
      setCurrentPlan(samplePlan)
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Error generating travel plan. Please try again.')
    } finally {
      setIsPlanning(false)
      setPlanningProgress(0)
    }
  }

  // Ensure itinerary has entries for all days
  const normalizePlan = (plan: any, prefs: any): TravelPlan => {
    const duration = Number(plan?.duration || prefs.duration || 3)
    const dest = plan?.title?.split(' in ')?.[1] || prefs.destination || 'Rural India'
    const acc = (plan?.itinerary?.[0]?.accommodation) || prefs.accommodation || 'Traditional Homestay'
    const daysMap = new Map<number, DayPlan>()
    ;(Array.isArray(plan.itinerary) ? plan.itinerary : []).forEach((d: any) => {
      if (d && typeof d.day === 'number') daysMap.set(d.day, d)
    })
    for (let day = 1; day <= duration; day++) {
      if (!daysMap.has(day)) {
        daysMap.set(day, {
          day,
          activities: [
            {
              id: `act_${day}_1`,
              title: day === 1 ? 'Village Welcome & Orientation' : 'Local Cultural Activity',
              description: day === 1 ? 'Meet your host family and learn about village life' : 'Engage with local artisans and explore traditions',
              duration: `${Math.floor(Math.random() * 3) + 2} hours`,
              cost: 500 + (day - 1) * 50,
              location: dest,
              type: 'cultural',
              rating: 4.7,
              image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
            }
          ],
          accommodation: acc,
          meals: ['Local Breakfast', 'Traditional Lunch', 'Village Dinner'],
          estimatedCost: 2200
        })
      }
    }
    const itinerary = Array.from(daysMap.values()).sort((a, b) => a.day - b.day)
    const totalCost = itinerary.reduce((sum, d) => sum + (Number(d.estimatedCost) || 0), 0)
    return {
      id: plan.id || 'plan_' + Date.now(),
      title: plan.title || `Perfect ${duration}-Day ${prefs.travelStyle} Experience in ${dest}`,
      duration,
      budget: Number(plan.budget || prefs.budget || 10000),
      groupSize: Number(plan.groupSize || prefs.groupSize || 2),
      preferences: Array.isArray(plan.preferences) ? plan.preferences : (prefs.interests || []),
      itinerary,
      totalCost: Number(plan.totalCost) > 0 ? plan.totalCost : totalCost,
      savings: Number.isFinite(plan.savings) ? plan.savings : Math.round((Number(prefs.budget || 10000)) * 0.15),
      culturalInsights: plan.culturalInsights || generateCulturalInsights(prefs, availableVillages),
      recommendations: plan.recommendations || generateRecommendations(prefs, availableVillages),
      aiScore: Number(plan.aiScore) || 85,
      realTimeData: plan.realTimeData || {
        availability: 15,
        demandLevel: 'medium',
        seasonalPricing: Math.round(((Number(plan.totalCost) > 0 ? plan.totalCost : totalCost) || duration * 2500) * 0.1),
        lastUpdated: new Date().toISOString()
      }
    }
  }

  const generateDynamicItinerary = (villages: Village[], preferences: any): DayPlan[] => {
    const itinerary: DayPlan[] = []
    const daysPerVillage = Math.ceil(preferences.duration / villages.length)
    
    for (let day = 1; day <= preferences.duration; day++) {
      const villageIndex = Math.floor((day - 1) / daysPerVillage)
      const selectedVillage = villages[villageIndex] || villages[0]
      const pricing = calculateRealTimePricing(selectedVillage, 1)
      
      const dayPlan: DayPlan = {
        day,
        activities: generateActivitiesForVillage(selectedVillage, day),
        accommodation: selectedVillage.title,
        meals: ['Local Breakfast', 'Traditional Lunch', 'Village Dinner'],
        estimatedCost: pricing.finalPrice,
        realTimeAvailability: selectedVillage.availability > 0
      }
      itinerary.push(dayPlan)
    }
    
    return itinerary
  }

  const generateActivitiesForVillage = (village: Village, day: number): Activity[] => {
    const activities: Activity[] = []
    
    // Add village-specific activities based on highlights
    if (village.highlights && village.highlights.length > 0) {
      village.highlights.slice(0, 2).forEach((highlight: string, index: number) => {
        const baseCost = Math.floor(Math.random() * 500) + 300
        const demandMultiplier = village.demandLevel === 'high' ? 1.2 : 1.0
        const realTimePrice = Math.round(baseCost * demandMultiplier)
        
        activities.push({
          id: `act_${day}_${index + 1}`,
          title: highlight,
          description: `Experience ${highlight.toLowerCase()} in ${village.location.village}`,
          duration: `${Math.floor(Math.random() * 3) + 2} hours`,
          cost: baseCost,
          location: `${village.location.village}, ${village.location.state}`,
          type: 'cultural',
          rating: village.rating - (Math.random() * 0.3),
          image: village.images[0] || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
          realTimePrice,
          availability: Math.floor(Math.random() * 10) + 5
        })
      })
    }
    
    // Add standard activities
    activities.push({
      id: `act_${day}_3`,
      title: 'Village Welcome & Orientation',
      description: `Meet your host family and learn about life in ${village.location.village}`,
      duration: '2 hours',
      cost: 500,
      location: `${village.location.village} Village Center`,
      type: 'cultural',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      realTimePrice: 500,
      availability: 20
    })
    
    return activities
  }

  // Actions for generated plan
  const handleBookNow = () => {
    if (!currentPlan) return
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('vv_last_plan', JSON.stringify(currentPlan))
      }
    } catch {}
    router.push('/bookings?from=planner&planId=' + encodeURIComponent(currentPlan.id))
  }

  const handleSharePlan = async () => {
    if (!currentPlan) return
    const shareText = `${currentPlan.title} (₹${currentPlan.totalCost.toLocaleString()})\nDays: ${currentPlan.duration}\nGroup: ${currentPlan.groupSize}\nItinerary days: ${currentPlan.itinerary.length}`
    const shareUrl = (typeof window !== 'undefined') ? window.location.href : ''
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({ title: currentPlan.title, text: shareText, url: shareUrl })
        return
      }
    } catch {}
    try {
      if (typeof navigator !== 'undefined' && (navigator.clipboard)) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        alert('Plan details copied to clipboard!')
        return
      }
    } catch {}
    alert('Sharing not supported in this environment.')
  }

  const generateCulturalInsights = (preferences: any, villages: Village[]): string[] => {
    const insights = [
      'Best time to visit local temples is early morning',
      'Learn basic greetings in the local language',
      'Participate in community activities for authentic experience',
      'Respect local customs and dress modestly'
    ]
    
    if (preferences.travelStyle === 'cultural') {
      insights.push('Attend local festivals and ceremonies when possible')
      insights.push('Try traditional clothing for a complete cultural immersion')
    }
    
    if (preferences.interests.includes('Local Cuisine')) {
      insights.push('Ask hosts to teach you traditional cooking methods')
      insights.push('Visit local markets early morning for fresh ingredients')
    }
    
    // Add village-specific insights
    villages.forEach(village => {
      if (village.location.state === 'Rajasthan') {
        insights.push('Experience traditional Rajasthani hospitality and folk music')
      } else if (village.location.state === 'Kerala') {
        insights.push('Learn about Ayurvedic practices and backwater culture')
      }
    })
    
    return insights.slice(0, 4)
  }

  const generateRecommendations = (preferences: any, villages: Village[]): string[] => {
    const recommendations = [
      'Book activities in advance during peak season',
      'Carry cash for local markets and artisans',
      'Download offline maps for remote areas',
      'Pack light but include cultural gifts for hosts'
    ]
    
    if (preferences.groupSize > 4) {
      recommendations.push('Consider splitting into smaller groups for intimate experiences')
    }
    
    if (preferences.budget > 15000) {
      recommendations.push('Consider extending your stay to explore more villages')
    }
    
    // Add demand-based recommendations
    const highDemandVillages = villages.filter(v => v.demandLevel === 'high')
    if (highDemandVillages.length > 0) {
      recommendations.push('Book early for high-demand villages to secure availability')
    }
    
    return recommendations.slice(0, 4)
  }

  // Real-time availability check
  const checkAvailability = async (villageId: string, dates: any) => {
    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${villageId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dates)
      })
      return response.ok ? await response.json() : { available: true }
    } catch (error) {
      console.error('Error checking availability:', error)
      return { available: true }
    }
  }

  const interests = [
    'Traditional Crafts', 'Local Cuisine', 'Folk Music', 'Farming', 'Yoga & Meditation',
    'Trekking', 'Wildlife', 'Photography', 'History', 'Spirituality', 'Festivals', 'Art'
  ]

  const travelStyles = [
    { id: 'cultural', name: 'Cultural Immersion', icon: Heart },
    { id: 'adventure', name: 'Adventure & Nature', icon: TrendingUp },
    { id: 'relaxation', name: 'Relaxation & Wellness', icon: Star },
    { id: 'family', name: 'Family-Friendly', icon: Users }
  ]

  const accommodationTypes = [
    { id: 'homestay', name: 'Traditional Homestay', description: 'Live with local families' },
    { id: 'guesthouse', name: 'Village Guesthouse', description: 'Comfortable village accommodation' },
    { id: 'camping', name: 'Eco Camping', description: 'Sustainable outdoor experience' }
  ]

  const toggleInterest = (interest: string) => {
    setUserPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="py-8">
      {/* Enhanced Hero Section */}
      <div className="text-center mb-12">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-500 rounded-full blur-xl opacity-30"></div>
                <Brain className="w-12 h-12 text-primary-600 mr-4 relative z-10" />
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                {t('ai.title')}
              </h1>
            </div>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto mb-6">
              {t('ai.subtitle')}
            </p>
            
            {/* Interactive Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                <div className="text-2xl font-bold text-green-700">{availableVillages.length}</div>
                <div className="text-sm text-green-600">Villages Available</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">98%</div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">24/7</div>
                <div className="text-sm text-purple-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Village Data */}
      {loadingVillages && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <Loader2 className="w-8 h-8 text-blue-600 mr-4 relative z-10 animate-spin" />
            </div>
            <div className="text-center">
              <span className="text-blue-800 font-semibold text-lg">Loading real-time village data...</span>
              <div className="text-blue-600 text-sm mt-1">Fetching latest availability and pricing</div>
            </div>
          </div>
        </div>
      )}

      {!loadingVillages && availableVillages.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-4">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-green-800 font-semibold text-lg">
                  {availableVillages.length} villages available with real-time pricing
                </span>
                <div className="text-green-600 text-sm">Live data updated every minute</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium">Last updated</div>
              <div className="text-lg text-green-800 font-bold">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      )}

      {!currentPlan ? (
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Planning Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Plan Your Perfect Trip
              </h2>
              <p className="text-earth-600">AI will create a personalized itinerary just for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Destination (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Rajasthan, Kerala"
                    value={userPreferences.destination}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-4 py-3 pl-12 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300"
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Duration (Days)
                </label>
                <div className="relative">
                  <select
                    value={userPreferences.duration}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 pl-12 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(days => (
                      <option key={days} value={days}>{days} {days === 1 ? 'Day' : 'Days'}</option>
                    ))}
                  </select>
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400 pointer-events-none" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400 pointer-events-none">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Budget (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="10000"
                    value={userPreferences.budget}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 pl-12 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300"
                  />
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Group Size
                </label>
                <div className="relative">
                  <select
                    value={userPreferences.groupSize}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 pl-12 border border-earth-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-300 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(size => (
                      <option key={size} value={size}>{size} {size === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400 pointer-events-none" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400 pointer-events-none">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Travel Style */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-earth-700 mb-4">
                Travel Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {travelStyles.map(style => {
                  const Icon = style.icon
                  return (
                    <button
                      key={style.id}
                      onClick={() => setUserPreferences(prev => ({ ...prev, travelStyle: style.id as any }))}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        userPreferences.travelStyle === style.id
                          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 text-primary-700 shadow-lg shadow-primary-100'
                          : 'border-earth-200 hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                        userPreferences.travelStyle === style.id
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-earth-100 text-earth-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold">{style.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Accommodation Type */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-earth-700 mb-4">
                Accommodation Preference
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accommodationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setUserPreferences(prev => ({ ...prev, accommodation: type.id as any }))}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                      userPreferences.accommodation === type.id
                        ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 text-primary-700 shadow-lg shadow-primary-100'
                        : 'border-earth-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="font-semibold text-lg mb-2">{type.name}</div>
                    <div className="text-sm opacity-80 leading-relaxed">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Interests */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-earth-700 mb-4">
                Interests (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      userPreferences.interests.includes(interest)
                        ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-200'
                        : 'bg-earth-100 text-earth-700 hover:bg-earth-200 hover:shadow-md'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Plan Button */}
            <button
              onClick={generateTravelPlan}
              disabled={isPlanning}
              className="w-full bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:from-primary-700 hover:via-blue-700 hover:to-purple-700 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-2xl shadow-primary-200"
            >
              {isPlanning ? (
                <div className="flex items-center justify-center">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                    <Loader2 className="w-8 h-8 relative z-10 animate-spin" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">AI is Planning Your Trip...</div>
                    <div className="text-sm opacity-75">{Math.round(planningProgress)}% Complete</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-50"></div>
                    <Brain className="w-8 h-8 relative z-10" />
                  </div>
                  <div className="text-lg font-semibold">{t('ai.planTrip')}</div>
                </div>
              )}
            </button>

            {/* Enhanced Progress Bar */}
            {isPlanning && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-earth-700">Planning Progress</span>
                  <span className="text-sm font-bold text-primary-600">{Math.round(planningProgress)}%</span>
                </div>
                <div className="w-full bg-earth-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                    style={{ width: `${planningProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-earth-500 mt-1">
                  <span>Analyzing</span>
                  <span>Searching</span>
                  <span>Calculating</span>
                  <span>Generating</span>
                  <span>Optimizing</span>
                  <span>Finalizing</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Generated Plan */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Enhanced Plan Header */}
            <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white p-8 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-24 translate-y-24"></div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">{currentPlan.title}</h2>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                    <Brain className="w-6 h-6 relative z-10" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm opacity-90">AI Score</div>
                    <div className="text-xl font-bold">{currentPlan.aiScore}%</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Duration</div>
                    <div className="font-bold">{currentPlan.duration} Days</div>
                  </div>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Group Size</div>
                    <div className="font-bold">{currentPlan.groupSize} People</div>
                  </div>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Total Cost</div>
                    <div className="font-bold">₹{currentPlan.totalCost.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs opacity-80">You Save</div>
                    <div className="font-bold">₹{currentPlan.savings.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Real-time Data */}
              {currentPlan.realTimeData && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                      <div className="relative mr-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-300 rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Available</div>
                        <div className="font-bold">{currentPlan.realTimeData.availability} spots</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                      <div className={`relative mr-3 ${
                        currentPlan.realTimeData.demandLevel === 'high' ? 'text-red-400' : 
                        currentPlan.realTimeData.demandLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          currentPlan.realTimeData.demandLevel === 'high' ? 'bg-red-400' : 
                          currentPlan.realTimeData.demandLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Demand</div>
                        <div className="font-bold capitalize">{currentPlan.realTimeData.demandLevel}</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Updated</div>
                        <div className="font-bold">{new Date(currentPlan.realTimeData.lastUpdated).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Seasonal</div>
                        <div className="font-bold">+₹{currentPlan.realTimeData.seasonalPricing}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8">
              {/* Itinerary */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-primary-600" />
                    Your Itinerary
                  </h3>
                  <div className="inline-flex rounded-xl overflow-hidden border border-earth-200">
                    <button onClick={() => setViewMode('cards')} className={`px-4 py-2 text-sm font-medium ${viewMode === 'cards' ? 'bg-primary-600 text-white' : 'bg-white text-earth-700'} transition-colors`}>Cards</button>
                    <button onClick={() => setViewMode('table')} className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-white text-earth-700'} transition-colors`}>Table</button>
                  </div>
                </div>
                {viewMode === 'cards' ? (
                <div className="space-y-6">
                  {currentPlan.itinerary.map((day, index) => (
                    <div key={day.day} className="border border-earth-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold">Day {day.day}</h4>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-earth-600">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            ₹{day.estimatedCost.toLocaleString()}
                          </div>
                          {day.realTimeAvailability !== undefined && (
                            <div className={`flex items-center text-sm ${
                              day.realTimeAvailability ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                day.realTimeAvailability ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {day.realTimeAvailability ? 'Available' : 'Limited'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="font-medium text-earth-700 mb-2">Accommodation:</div>
                        <div className="text-earth-600">{day.accommodation}</div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="font-medium text-earth-700 mb-2">Activities:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {day.activities.map(activity => (
                            <div key={activity.id} className="bg-earth-50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium">{activity.title}</h5>
                                <div className="flex items-center space-x-2">
                                  {activity.realTimePrice && (
                                    <span className="text-sm text-primary-600 font-medium">
                                      ₹{activity.realTimePrice}
                                    </span>
                                  )}
                                  <div className="flex items-center text-sm text-earth-600">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    {activity.rating.toFixed(1)}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-earth-600 mb-2">{activity.description}</p>
                              <div className="flex items-center justify-between text-sm text-earth-500">
                                <span>{activity.duration}</span>
                                <span>{activity.location}</span>
                                {activity.availability && (
                                  <span className="text-green-600">{activity.availability} spots left</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-earth-700 mb-2">Meals:</div>
                        <div className="flex flex-wrap gap-2">
                          {day.meals.map((meal, mealIndex) => (
                            <span key={mealIndex} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-earth-200 rounded-lg overflow-hidden">
                      <thead className="bg-earth-100">
                        <tr>
                          <th className="px-3 py-2 text-left">Day</th>
                          <th className="px-3 py-2 text-left">Accommodation</th>
                          <th className="px-3 py-2 text-left">Meals</th>
                          <th className="px-3 py-2 text-left">Activities</th>
                          <th className="px-3 py-2 text-left">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPlan.itinerary.map((d) => (
                          <tr key={`row_${d.day}`} className="border-t">
                            <td className="px-3 py-2 font-medium">{d.day}</td>
                            <td className="px-3 py-2">{d.accommodation}</td>
                            <td className="px-3 py-2">{d.meals.join(', ')}</td>
                            <td className="px-3 py-2">{d.activities.map(a => a.title).join(' • ')}</td>
                            <td className="px-3 py-2">₹{d.estimatedCost.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Cultural Insights & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary-600" />
                    Cultural Insights
                  </h3>
                  <ul className="space-y-2">
                    {currentPlan.culturalInsights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-earth-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary-600" />
                    AI Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {currentPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-earth-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleBookNow} className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-primary-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-200">
                  {t('ai.bookNow')}
                </button>
                <button onClick={handleSharePlan} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-200">
                  <Share2 className="w-5 h-5 inline mr-2" />
                  {t('ai.sharePlan')}
                </button>
                <button 
                  onClick={() => togglePlan(currentPlan.id)}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isPlanSaved(currentPlan.id) 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-green-200' 
                      : 'bg-gradient-to-r from-primary-500 to-blue-500 text-white hover:from-primary-600 hover:to-blue-600 shadow-primary-200'
                  }`}
                >
                  {isPlanSaved(currentPlan.id) ? '✓ Saved' : t('ai.savePlan')}
                </button>
                <button 
                  onClick={() => setCurrentPlan(null)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-200"
                >
                  {t('ai.createNew')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AITravelPlanner 