import { authFetch, API_ENDPOINTS, apiHelpers } from '@/components/authFetch'

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface Listing {
  _id: string
  title: string
  description: string
  location: {
    state: string
    village: string
    coordinates?: [number, number]
  }
  price: number
  experienceType: string
  maxGuests: number
  amenities: string[]
  images: string[]
  host: {
    _id: string
    name: string
    email: string
  }
  rating?: number
  reviews?: number
  availability: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  _id: string
  listing: Listing
  user: {
    _id: string
    name: string
    email: string
  }
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  preferences?: {
    interests: string[]
    travelStyle: string[]
    budget: number
  }
  createdAt: string
  updatedAt: string
}

export interface Badge {
  _id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedDate?: string
}

export interface Achievement {
  _id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
  points: number
  category: string
}

export interface LiveStream {
  _id: string
  title: string
  host: {
    _id: string
    name: string
    avatar?: string
  }
  village: string
  viewers: number
  duration: string
  thumbnail: string
  isLive: boolean
  category: string
  description: string
  tags: string[]
  donations: number
  streamUrl?: string
  createdAt: string
}

// Listing API Services
export const listingApi = {
  // Get all listings
  getAll: async (): Promise<Listing[]> => {
    return apiHelpers.get(API_ENDPOINTS.LISTINGS)
  },

  // Get listing by ID
  getById: async (id: string): Promise<Listing> => {
    return apiHelpers.get(API_ENDPOINTS.LISTING_BY_ID(id))
  },

  // Create new listing
  create: async (listingData: Partial<Listing>): Promise<Listing> => {
    return apiHelpers.post(API_ENDPOINTS.CREATE_LISTING, listingData)
  },

  // Update listing
  update: async (id: string, listingData: Partial<Listing>): Promise<Listing> => {
    return apiHelpers.put(API_ENDPOINTS.UPDATE_LISTING(id), listingData)
  },

  // Delete listing
  delete: async (id: string): Promise<{ message: string }> => {
    return apiHelpers.delete(API_ENDPOINTS.DELETE_LISTING(id))
  },

  // Search listings
  search: async (params: {
    location?: string
    priceMin?: number
    priceMax?: number
    experienceType?: string
    guests?: number
    checkIn?: string
    checkOut?: string
  }): Promise<Listing[]> => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    return apiHelpers.get(`${API_ENDPOINTS.LISTINGS}?${queryParams.toString()}`)
  }
}

// Booking API Services
export const bookingApi = {
  // Get user's bookings
  getUserBookings: async (): Promise<Booking[]> => {
    return apiHelpers.get(API_ENDPOINTS.BOOKINGS)
  },

  // Get booking by ID
  getById: async (id: string): Promise<Booking> => {
    return apiHelpers.get(API_ENDPOINTS.BOOKING_BY_ID(id))
  },

  // Create new booking
  create: async (bookingData: {
    listingId: string
    checkIn: string
    checkOut: string
    guests: number
  }): Promise<Booking> => {
    return apiHelpers.post(API_ENDPOINTS.CREATE_BOOKING, bookingData)
  },

  // Update booking
  update: async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
    return apiHelpers.put(API_ENDPOINTS.UPDATE_BOOKING(id), bookingData)
  },

  // Cancel booking
  cancel: async (id: string): Promise<{ message: string }> => {
    return apiHelpers.post(API_ENDPOINTS.CANCEL_BOOKING(id), {})
  }
}

// User API Services
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    return apiHelpers.get(API_ENDPOINTS.USER_PROFILE)
  },

  // Update user profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return apiHelpers.put(API_ENDPOINTS.UPDATE_PROFILE, profileData)
  },

  // Get user badges
  getBadges: async (): Promise<Badge[]> => {
    return apiHelpers.get(API_ENDPOINTS.USER_BADGES)
  },

  // Get user achievements
  getAchievements: async (): Promise<Achievement[]> => {
    return apiHelpers.get(API_ENDPOINTS.USER_ACHIEVEMENTS)
  },

  // Get user challenges
  getChallenges: async (): Promise<any[]> => {
    return apiHelpers.get(API_ENDPOINTS.USER_CHALLENGES)
  }
}

// Social API Services
export const socialApi = {
  // Get leaderboard
  getLeaderboard: async (): Promise<any[]> => {
    return apiHelpers.get(API_ENDPOINTS.LEADERBOARD)
  },

  // Get friends
  getFriends: async (): Promise<any[]> => {
    return apiHelpers.get(API_ENDPOINTS.FRIENDS)
  },

  // Add friend
  addFriend: async (userId: string): Promise<{ message: string }> => {
    return apiHelpers.post(API_ENDPOINTS.FRIENDS, { userId })
  }
}

// Live Streaming API Services
export const liveStreamApi = {
  // Get all live streams
  getAll: async (): Promise<LiveStream[]> => {
    return apiHelpers.get(API_ENDPOINTS.LIVE_STREAMS)
  },

  // Get stream by ID
  getById: async (id: string): Promise<LiveStream> => {
    return apiHelpers.get(API_ENDPOINTS.STREAM_BY_ID(id))
  },

  // Get stream chat
  getChat: async (id: string): Promise<any[]> => {
    return apiHelpers.get(API_ENDPOINTS.STREAM_CHAT(id))
  },

  // Send chat message
  sendMessage: async (id: string, message: string): Promise<any> => {
    return apiHelpers.post(API_ENDPOINTS.STREAM_CHAT(id), { message })
  },

  // Get stream donations
  getDonations: async (id: string): Promise<any[]> => {
    return apiHelpers.get(API_ENDPOINTS.STREAM_DONATIONS(id))
  },

  // Send donation
  sendDonation: async (id: string, amount: number, message?: string): Promise<any> => {
    return apiHelpers.post(API_ENDPOINTS.STREAM_DONATIONS(id), { amount, message })
  }
}

// AI Planner API Services
export const aiPlannerApi = {
  // Generate travel plan
  generatePlan: async (preferences: {
    destination?: string
    duration: number
    budget: number
    groupSize: number
    interests: string[]
    travelStyle: string
    accommodation: string
  }): Promise<any> => {
    return apiHelpers.post(API_ENDPOINTS.AI_PLAN, preferences)
  },

  // Get AI suggestions
  getSuggestions: async (query: string): Promise<any[]> => {
    return apiHelpers.get(`${API_ENDPOINTS.AI_SUGGESTIONS}?q=${encodeURIComponent(query)}`)
  }
}

// Impact Tracking API Services
export const impactApi = {
  // Get impact metrics
  getMetrics: async (bookingId?: string): Promise<any> => {
    const endpoint = bookingId 
      ? `${API_ENDPOINTS.IMPACT_METRICS}?bookingId=${bookingId}`
      : API_ENDPOINTS.IMPACT_METRICS
    return apiHelpers.get(endpoint)
  },

  // Generate impact certificate
  generateCertificate: async (bookingId: string): Promise<any> => {
    return apiHelpers.get(API_ENDPOINTS.IMPACT_CERTIFICATE(bookingId))
  }
}

// Payment API Services
export const paymentApi = {
  // Create payment
  create: async (bookingId: string, amount: number): Promise<any> => {
    return apiHelpers.post(API_ENDPOINTS.CREATE_PAYMENT, { bookingId, amount })
  },

  // Verify payment
  verify: async (paymentId: string, signature: string): Promise<any> => {
    return apiHelpers.post(API_ENDPOINTS.VERIFY_PAYMENT, { paymentId, signature })
  }
}

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  return 'An unexpected error occurred'
} 