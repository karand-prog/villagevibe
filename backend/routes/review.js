const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const auth = require('../middleware/auth')
const { body } = require('express-validator')

// Get all reviews for a listing
router.get('/', reviewController.getReviews)

// Protected: Get user's own reviews
router.get('/my-reviews', auth, reviewController.getUserReviews)

// Protected: Create a new review
router.post('/', auth, [
  body('listingId').notEmpty().withMessage('Listing ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('content').isLength({ min: 10, max: 1000 }).withMessage('Review content must be between 10 and 1000 characters'),
], reviewController.createReview)

// Protected: Update a review (user can only update their own reviews)
router.put('/:id', auth, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('content').optional().isLength({ min: 10, max: 1000 }).withMessage('Review content must be between 10 and 1000 characters'),
], reviewController.updateReview)

// Protected: Delete a review (user can only delete their own reviews)
router.delete('/:id', auth, reviewController.deleteReview)

// Protected: Mark review as helpful
router.post('/:id/helpful', auth, reviewController.markHelpful)

module.exports = router 