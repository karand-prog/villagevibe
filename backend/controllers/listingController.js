const Listing = require('../models/Listing')
const { validationResult } = require('express-validator')

// Create a new listing
exports.createListing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const listing = new Listing({ ...req.body, host: req.user.id })
    await listing.save()
    res.status(201).json(listing)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('host', 'name email')
    res.json(listings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get featured listings
exports.getFeaturedListings = async (req, res) => {
  try {
    // Get featured listings (you can add a 'featured' field to your Listing model)
    // For now, we'll return the first 6 listings as featured
    const featuredListings = await Listing.find()
      .populate('host', 'name email')
      .limit(6)
      .sort({ createdAt: -1 })
    
    res.json(featuredListings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get a single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name email')
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    res.json(listing)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update a listing
exports.updateListing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    res.json(listing)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id)
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    res.json({ message: 'Listing deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
} 