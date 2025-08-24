const express = require('express')
const router = express.Router()
const Favorite = require('../models/Favorite')
const auth = require('../middleware/auth')

// GET /api/favorites - Get all favorites for current user
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 })
    
    // Group by type
    const listings = favorites.filter(f => f.type === 'listing').map(f => f.itemId)
    const experiences = favorites.filter(f => f.type === 'experience').map(f => f.itemId)
    const plans = favorites.filter(f => f.type === 'plan').map(f => f.itemData)
    
    res.json({
      listings,
      experiences,
      plans
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    res.status(500).json({ error: 'Failed to fetch favorites' })
  }
})

// POST /api/favorites/listings - Add listing to favorites
router.post('/listings', auth, async (req, res) => {
  try {
    const { listingId } = req.body
    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' })
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId: req.user.id, type: 'listing', itemId: listingId },
      { userId: req.user.id, type: 'listing', itemId: listingId },
      { upsert: true, new: true }
    )

    res.json({ success: true, favorite })
  } catch (error) {
    console.error('Error adding listing to favorites:', error)
    res.status(500).json({ error: 'Failed to add listing to favorites' })
  }
})

// DELETE /api/favorites/listings - Remove listing from favorites
router.delete('/listings', auth, async (req, res) => {
  try {
    const { listingId } = req.body
    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' })
    }

    await Favorite.findOneAndDelete({
      userId: req.user.id,
      type: 'listing',
      itemId: listingId
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error removing listing from favorites:', error)
    res.status(500).json({ error: 'Failed to remove listing from favorites' })
  }
})

// POST /api/favorites/experiences - Add experience to favorites
router.post('/experiences', auth, async (req, res) => {
  try {
    const { experienceId } = req.body
    if (!experienceId) {
      return res.status(400).json({ error: 'Experience ID is required' })
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId: req.user.id, type: 'experience', itemId: experienceId },
      { userId: req.user.id, type: 'experience', itemId: experienceId },
      { upsert: true, new: true }
    )

    res.json({ success: true, favorite })
  } catch (error) {
    console.error('Error adding experience to favorites:', error)
    res.status(500).json({ error: 'Failed to add experience to favorites' })
  }
})

// DELETE /api/favorites/experiences - Remove experience from favorites
router.delete('/experiences', auth, async (req, res) => {
  try {
    const { experienceId } = req.body
    if (!experienceId) {
      return res.status(400).json({ error: 'Experience ID is required' })
    }

    await Favorite.findOneAndDelete({
      userId: req.user.id,
      type: 'experience',
      itemId: experienceId
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error removing experience from favorites:', error)
    res.status(500).json({ error: 'Failed to remove experience from favorites' })
  }
})

// POST /api/favorites/plans - Add AI plan to favorites
router.post('/plans', auth, async (req, res) => {
  try {
    const { planId, planData } = req.body
    if (!planId || !planData) {
      return res.status(400).json({ error: 'Plan ID and data are required' })
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId: req.user.id, type: 'plan', itemId: planId },
      { 
        userId: req.user.id, 
        type: 'plan', 
        itemId: planId,
        itemData: planData
      },
      { upsert: true, new: true }
    )

    res.json({ success: true, favorite })
  } catch (error) {
    console.error('Error adding plan to favorites:', error)
    res.status(500).json({ error: 'Failed to add plan to favorites' })
  }
})

// DELETE /api/favorites/plans - Remove AI plan from favorites
router.delete('/plans', auth, async (req, res) => {
  try {
    const { planId } = req.body
    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' })
    }

    await Favorite.findOneAndDelete({
      userId: req.user.id,
      type: 'plan',
      itemId: planId
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error removing plan from favorites:', error)
    res.status(500).json({ error: 'Failed to remove plan from favorites' })
  }
})

module.exports = router 