const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')
const auth = require('../middleware/auth')
const { body } = require('express-validator')

// Public: Get all listings
router.get('/', listingController.getListings)
// Public: Get featured listings (must come before /:id to avoid conflicts)
router.get('/featured', listingController.getFeaturedListings)
// Public: Get a single listing by ID
router.get('/:id', listingController.getListingById)
// Protected: Create a new listing
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.village').notEmpty().withMessage('Village is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('experienceType').notEmpty().withMessage('Experience type is required'),
], listingController.createListing)
// Protected: Update a listing
router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
], listingController.updateListing)
// Protected: Delete a listing
router.delete('/:id', auth, listingController.deleteListing)

module.exports = router 