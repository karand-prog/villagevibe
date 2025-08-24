"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useReviews } from './ReviewContext'
import { useAuth } from './AuthContext'
import { Star, ThumbsUp, MessageCircle, User, Calendar, Edit, Trash2, Flag } from 'lucide-react'
import Toast from './Toast'

export default function ReviewsSection({ listingId }: { listingId: string }) {
  const { user } = useAuth()
  const { createReview, getListingReviews, markHelpful, updateReview, deleteReview } = useReviews()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState<number>(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editRating, setEditRating] = useState<number>(5)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        // For now, use sample reviews since we don't have a real API
        const sampleReviews = [
          {
            _id: 'review1',
            user: {
              name: 'Priya Sharma',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
            },
            rating: 5,
            content: 'Amazing experience! The village was exactly as described. The host was very welcoming and the local food was delicious. Highly recommend!',
            createdAt: new Date('2024-01-15').toISOString(),
            helpful: 3
          },
          {
            _id: 'review2',
            user: {
              name: 'Rajesh Kumar',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
            },
            rating: 4,
            content: 'Great place to experience local culture. The activities were well organized and the accommodation was comfortable. Will visit again!',
            createdAt: new Date('2024-01-10').toISOString(),
            helpful: 2
          },
          {
            _id: 'review3',
            user: {
              name: 'Maria Fernandes',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
            },
            rating: 5,
            content: 'Perfect getaway from city life. The natural beauty and local hospitality made our stay memorable. The guided tours were informative.',
            createdAt: new Date('2024-01-05').toISOString(),
            helpful: 1
          }
        ]
        setReviews(sampleReviews)
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [listingId])

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return (
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    ).toFixed(1)
  }, [reviews])

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      if (review.rating && distribution[review.rating as keyof typeof distribution] !== undefined) {
        distribution[review.rating as keyof typeof distribution]++
      }
    })
    return distribution
  }, [reviews])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { 
      setToast({ message: 'Please sign in to submit a review', type: 'error' })
      return 
    }
    if (!content.trim()) {
      setToast({ message: 'Please write a review', type: 'error' }) // Use toast for feedback
      return
    }
    
    setSubmitting(true)
    setError(null)
    try {
      // Create a new review object immediately
      const newReview = {
        _id: `review_${Date.now()}`,
        user: {
          name: user.name || 'Anonymous',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
        },
        rating,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        helpful: 0
      }
      
      // Add to reviews list immediately
      setReviews(prev => [newReview, ...prev])
      
      // Reset form
      setRating(5)
      setContent('')
      setShowForm(false) // Close form after submission
      setToast({ message: 'Review submitted successfully!', type: 'success' })
      
      // In a real app, you would also save to backend here
      // const savedReview = await createReview({ listingId, rating, content })
      // if (savedReview) {
      //   setReviews(prev => [savedReview, ...prev])
      // }
      
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to submit review', type: 'error' })
      // Remove the review from the list if backend save failed
      setReviews(prev => prev.filter(r => r._id !== `review_${Date.now()}`))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (reviewId: string) => {
    if (!editContent.trim()) {
      setToast({ message: 'Please write a review', type: 'error' })
      return
    }
    
    try {
      const updatedReview = await updateReview(reviewId, { content: editContent, rating: editRating })
      if (updatedReview) {
        setReviews(prev => prev.map(r => r._id === reviewId ? updatedReview : r))
        setEditingReview(null)
        setEditContent('')
        setEditRating(5)
        setToast({ message: 'Review updated successfully!', type: 'success' })
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update review', type: 'error' })
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const success = await deleteReview(reviewId)
      if (success) {
        setReviews(prev => prev.filter(r => r._id !== reviewId))
        setToast({ message: 'Review deleted successfully!', type: 'success' })
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete review', type: 'error' })
    }
  }

  const handleHelpful = async (id: string) => {
    const ok = await markHelpful(id)
    if (ok) {
      setReviews(prev => prev.map(r => r._id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    }
  }

  const startEdit = (review: any) => {
    setEditingReview(review._id)
    setEditContent(review.content)
    setEditRating(review.rating)
  }

  const cancelEdit = () => {
    setEditingReview(null)
    setEditContent('')
    setEditRating(5)
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header with Rating Summary */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-earth-800 mb-2">Reviews</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-primary-600">{avgRating}</div>
                <div>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-5 h-5 ${i <= Number(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-earth-600">{reviews.length} reviews</p>
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="hidden md:block">
                <div className="space-y-1">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm text-earth-600 w-4">{star}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${reviews.length > 0 ? (ratingDistribution[star as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-earth-500 w-8">{ratingDistribution[star as keyof typeof ratingDistribution]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Write Review
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="bg-earth-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-earth-800 mb-4">Write Your Review</h4>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-earth-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(i => (
                    <button 
                      type="button" 
                      key={i} 
                      onClick={() => setRating(i)} 
                      className={`p-2 rounded-lg transition-colors ${
                        i <= rating ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${i <= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  <span className="text-sm text-earth-600 ml-2">{rating}/5</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-earth-700 mb-2">Your review</label>
                <textarea 
                  className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px]" 
                  value={content} 
                  onChange={(e)=>setContent(e.target.value)} 
                  required 
                  placeholder="Share details of your experience, what you liked, and what could be improved..."
                />
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-earth-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-earth-400" />
            <p className="text-xl text-earth-600 mb-2">No reviews yet</p>
            <p className="text-earth-500 mb-4">Be the first to share your experience!</p>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Write First Review
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-earth-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                {editingReview === review._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-earth-700 mb-2">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5].map(i => (
                          <button 
                            type="button" 
                            key={i} 
                            onClick={() => setEditRating(i)} 
                            className={`p-2 rounded-lg transition-colors ${
                              i <= editRating ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          >
                            <Star className={`w-5 h-5 ${i <= editRating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                        <span className="text-sm text-earth-600 ml-2">{editRating}/5</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-earth-700 mb-2">Review</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]" 
                        value={editContent} 
                        onChange={(e)=>setEditContent(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleEdit(review._id)}
                        className="btn-primary text-sm"
                      >
                        Update Review
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-earth-800">{review.user?.name || 'Guest'}</div>
                          <div className="flex items-center gap-2 text-sm text-earth-600">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {user && (user.id === review.user?._id || user.email === review.user?.email) && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => startEdit(review)}
                            className="p-2 text-earth-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(review._id)}
                            className="p-2 text-earth-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-earth-600">{review.rating}/5</span>
                    </div>
                    
                    <div className="text-earth-700 mb-4 leading-relaxed">{review.content}</div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleHelpful(review._id)} 
                          className="inline-flex items-center gap-2 text-sm text-earth-600 hover:text-primary-700 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" /> 
                          Helpful ({review.helpfulCount || 0})
                        </button>
                        <button className="inline-flex items-center gap-2 text-sm text-earth-600 hover:text-primary-700 transition-colors">
                          <Flag className="w-4 h-4" /> 
                          Report
                        </button>
                      </div>
                      
                      {review.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          Verified
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  )
} 