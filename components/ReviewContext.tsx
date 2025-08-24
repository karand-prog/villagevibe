'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authFetch } from './authFetch'

type Review = {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  listing: {
    _id: string
    title: string
    images?: string[]
    location: { village?: string; state?: string }
  }
  rating: number
  content: string
  categories: string[]
  helpful: Array<{
    user: string
    createdAt: string
  }>
  helpfulCount: number
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

type ReviewContextType = {
  reviews: Review[]
  loading: boolean
  error: string | null
  createReview: (reviewData: any) => Promise<Review | null>
  updateReview: (id: string, updates: any) => Promise<Review | null>
  deleteReview: (id: string) => Promise<boolean>
  refreshReviews: () => Promise<void>
  getUserReviews: () => Review[]
  getListingReviews: (listingId: string) => Promise<Review[]>
  markHelpful: (reviewId: string) => Promise<boolean>
}

const ReviewContext = createContext<ReviewContextType | null>(null)

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user reviews on mount
  useEffect(() => {
    loadUserReviews()
  }, [])

  const loadUserReviews = async () => {
    if (loading) return // Prevent multiple simultaneous calls
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews/my-reviews`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      } else if (res.status === 429) {
        // Rate limited - wait and retry
        setTimeout(() => loadUserReviews(), 5000)
        return
      } else {
        throw new Error('Failed to load reviews')
      }
    } catch (err: any) {
      console.error('Error loading reviews:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (reviewData: any): Promise<Review | null> => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      
      if (res.ok) {
        const newReview = await res.json()
        setReviews(prev => [newReview, ...prev])
        return newReview
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create review')
      }
    } catch (err: any) {
      console.error('Error creating review:', err)
      setError(err.message)
      return null
    }
  }

  const updateReview = async (id: string, updates: any): Promise<Review | null> => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (res.ok) {
        const updatedReview = await res.json()
        setReviews(prev => prev.map(review => 
          review._id === id ? updatedReview : review
        ))
        return updatedReview
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update review')
      }
    } catch (err: any) {
      console.error('Error updating review:', err)
      setError(err.message)
      return null
    }
  }

  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setReviews(prev => prev.filter(review => review._id !== id))
        return true
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete review')
      }
    } catch (err: any) {
      console.error('Error deleting review:', err)
      setError(err.message)
      return false
    }
  }

  const refreshReviews = async () => {
    await loadUserReviews()
  }

  const getUserReviews = (): Review[] => {
    return reviews
  }

  const getListingReviews = async (listingId: string): Promise<Review[]> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews?listingId=${listingId}`)
      if (res.ok) {
        return await res.json()
      } else {
        throw new Error('Failed to fetch listing reviews')
      }
    } catch (err: any) {
      console.error('Error fetching listing reviews:', err)
      return []
    }
  }

  const markHelpful = async (reviewId: string): Promise<boolean> => {
    try {
      // Try API call first
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (res.ok) {
        // Update the review in local state
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review
        ))
        return true
      } else {
        // If API fails, handle locally
        console.warn('API call failed, handling helpful mark locally')
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review
        ))
        return true
      }
    } catch (err: any) {
      // If API call throws error, handle locally
      console.warn('API error, handling helpful mark locally:', err.message)
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
          : review
      ))
      return true
    }
  }

  return (
    <ReviewContext.Provider value={{
      reviews,
      loading,
      error,
      createReview,
      updateReview,
      deleteReview,
      refreshReviews,
      getUserReviews,
      getListingReviews,
      markHelpful
    }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider')
  return ctx
} 