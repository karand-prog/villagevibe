// Enhanced authFetch utility for backend integration

export const authFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let token: string | null = null
  
  // Try to get token from localStorage (works in both client and server)
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }

  // Build the full URL if it's a relative path
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  const url = typeof input === 'string' && input.startsWith('/') 
    ? `${baseUrl}${input}` 
    : input

  const headers = {
    ...init?.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  try {
    const response = await fetch(url, { 
      ...init, 
      headers,
      credentials: 'include' // Include cookies for session management
    })

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        // Redirect to login if not already there
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin'
        }
      }
      throw new Error('Authentication required')
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Utility function for API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',
  
  // Listings endpoints
  LISTINGS: '/listings',
  LISTING_BY_ID: (id: string) => `/listings/${id}`,
  CREATE_LISTING: '/listings',
  UPDATE_LISTING: (id: string) => `/listings/${id}`,
  DELETE_LISTING: (id: string) => `/listings/${id}`,
  
  // Bookings endpoints
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  CREATE_BOOKING: '/bookings',
  UPDATE_BOOKING: (id: string) => `/bookings/${id}`,
  CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,
  
  // Payment endpoints
  CREATE_PAYMENT: '/payment/create',
  VERIFY_PAYMENT: '/payment/verify',
  
  // User profile endpoints
  USER_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  
  // Social features endpoints
  USER_BADGES: '/user/badges',
  USER_ACHIEVEMENTS: '/user/achievements',
  USER_CHALLENGES: '/user/challenges',
  LEADERBOARD: '/social/leaderboard',
  FRIENDS: '/social/friends',
  
  // Live streaming endpoints
  LIVE_STREAMS: '/live-streams',
  STREAM_BY_ID: (id: string) => `/live-streams/${id}`,
  STREAM_CHAT: (id: string) => `/live-streams/${id}/chat`,
  STREAM_DONATIONS: (id: string) => `/live-streams/${id}/donations`,
  
  // AI planner endpoints
  AI_PLAN: '/ai/plan',
  AI_SUGGESTIONS: '/ai/suggestions',
  
  // Impact tracking endpoints
  IMPACT_METRICS: '/impact/metrics',
  IMPACT_CERTIFICATE: (bookingId: string) => `/impact/certificate/${bookingId}`,
}

// Helper function to handle API responses
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Helper function for common API operations
export const apiHelpers = {
  // GET request
  get: async (endpoint: string) => {
    const response = await authFetch(endpoint, { method: 'GET' })
    return handleApiResponse(response)
  },

  // POST request
  post: async (endpoint: string, data: any) => {
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return handleApiResponse(response)
  },

  // PUT request
  put: async (endpoint: string, data: any) => {
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return handleApiResponse(response)
  },

  // DELETE request
  delete: async (endpoint: string) => {
    const response = await authFetch(endpoint, { method: 'DELETE' })
    return handleApiResponse(response)
  },

  // PATCH request
  patch: async (endpoint: string, data: any) => {
    const response = await authFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    return handleApiResponse(response)
  }
}