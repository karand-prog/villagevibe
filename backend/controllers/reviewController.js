const Review = require('../models/Review');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all reviews for a listing
const getReviews = async (req, res) => {
  try {
    const { listingId } = req.query;
    
    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    // Validate if listingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      // Return empty reviews array for invalid ObjectIds instead of error
      return res.json([]);
    }

    const reviews = await Review.find({ listing: listingId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get user's own reviews
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('listing', 'title images location')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    console.log('Review creation request body:', req.body)
    console.log('User ID:', req.user.id)
    
    const { listingId, rating, content, categories } = req.body
    const userId = req.user.id

    // Basic validation
    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' })
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' })
    }
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: 'Review content must be at least 10 characters' })
    }

    // Create ObjectId for listing
    let listingObjectId
    try {
      if (mongoose.Types.ObjectId.isValid(listingId)) {
        listingObjectId = new mongoose.Types.ObjectId(listingId)
      } else {
        // For sample data with string IDs, create a new ObjectId
        listingObjectId = new mongoose.Types.ObjectId()
        console.log('Created new ObjectId for listing:', listingObjectId)
      }
    } catch (error) {
      console.error('ObjectId creation error:', error)
      return res.status(400).json({ error: 'Invalid listing ID format' })
    }

    // Create review
    const review = new Review({
      user: userId,
      listing: listingObjectId,
      rating: Number(rating),
      content: content.trim(),
      categories: categories || []
    })

    console.log('Saving review:', review)
    await review.save()
    
    // Populate and return the review
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .populate('listing', 'title images location')

    console.log('Review created successfully:', populatedReview)
    res.status(201).json(populatedReview)
  } catch (error) {
    console.error('Error creating review:', error)
    res.status(500).json({ error: 'Failed to create review: ' + error.message })
  }
};

// Update a review
const updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { rating, content, categories } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    if (rating !== undefined) review.rating = rating;
    if (content !== undefined) review.content = content;
    if (categories !== undefined) review.categories = categories;

    await review.save();
    
    const updatedReview = await Review.findById(id)
      .populate('user', 'name avatar')
      .populate('listing', 'title images location');

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    await Review.findByIdAndDelete(id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id)
    if (!review) return res.status(404).json({ error: 'Review not found' })

    const already = review.helpful?.some(h => String(h.user) === String(userId))
    if (already) {
      return res.status(200).json({ message: 'Already marked helpful' })
    }

    review.helpful = review.helpful || []
    review.helpful.push({ user: userId, createdAt: new Date() })
    await review.save()

    const populated = await Review.findById(id).populate('user', 'name avatar').populate('listing', 'title images location')
    res.json(populated)
  } catch (error) {
    console.error('Error marking review helpful:', error);
    res.status(500).json({ error: 'Failed to mark review as helpful' });
  }
};

module.exports = {
  getReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
}; 