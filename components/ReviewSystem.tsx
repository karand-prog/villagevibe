'use client'

import React, { useState, useEffect } from 'react'
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react'
import { authFetch } from './authFetch'
import { useAuth } from './AuthContext'

interface Review {
  _id: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  categories: string[]
  createdAt: string
  helpful: number
}

interface ReviewSystemProps {
  listingId: string
  onReviewSubmitted?: () => void
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ listingId, onReviewSubmitted }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    categories: [] as string[]
  })
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    'Cleanliness', 'Communication', 'Check-in', 'Accuracy', 'Location', 'Value'
  ]

  useEffect(() => {
    fetchReviews()
  }, [listingId])

  const fetchReviews = async () => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews?listing=${listingId}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to submit a review')
      return
    }

    setSubmitting(true)
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing: listingId,
          rating: newReview.rating,
          comment: newReview.comment,
          categories: newReview.categories
        })
      })

      if (res.ok) {
        setShowReviewForm(false)
        setNewReview({ rating: 5, comment: '', categories: [] })
        fetchReviews()
        onReviewSubmitted?.()
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCategory = (category: string) => {
    setNewReview(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-earth-600">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-earth-800">Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-earth-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 font-semibold">{averageRating.toFixed(1)}</span>
            <span className="ml-1 text-earth-600">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn-primary flex items-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-earth-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-earth-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-earth-600">
                  {newReview.rating} out of 5
                </span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                What was great about your stay?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newReview.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-earth-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this village homestay..."
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-earth-300 mx-auto mb-4" />
            <p className="text-earth-600">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-earth-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-earth-800">{review.user.name}</h4>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-earth-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-earth-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {review.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {review.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-block bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-earth-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-sm text-earth-600 hover:text-earth-800">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewSystem

