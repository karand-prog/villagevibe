const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// Get all live streams
router.get('/', async (req, res) => {
  try {
    // Mock live streams data - replace with actual database query
    const liveStreams = [
      {
        id: '1',
        title: 'Live Village Cooking: Traditional Rajasthani Thali',
        host: {
          id: '1',
          name: 'Priya Sharma',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
        },
        village: 'Pushkar, Rajasthan',
        viewers: 1247,
        duration: '2:34:12',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        isLive: true,
        category: 'Cooking',
        description: 'Watch me prepare a complete traditional Rajasthani thali...',
        tags: ['Cooking', 'Traditional', 'Rajasthan', 'Food'],
        donations: 8500,
        streamUrl: 'https://example.com/stream1',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Sunset Village Walk in Kerala Backwaters',
        host: {
          id: '2',
          name: 'Rajesh Kumar',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        village: 'Alleppey, Kerala',
        viewers: 892,
        duration: '1:45:30',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        isLive: true,
        category: 'Nature',
        description: 'Join me for a peaceful evening walk...',
        tags: ['Nature', 'Kerala', 'Backwaters', 'Sunset'],
        donations: 6200,
        streamUrl: 'https://example.com/stream2',
        createdAt: new Date()
      }
    ]
    res.json(liveStreams)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get stream by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    // Mock stream data - replace with actual database query
    const stream = {
      id,
      title: 'Live Village Cooking: Traditional Rajasthani Thali',
      host: {
        id: '1',
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      },
      village: 'Pushkar, Rajasthan',
      viewers: 1247,
      duration: '2:34:12',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      isLive: true,
      category: 'Cooking',
      description: 'Watch me prepare a complete traditional Rajasthani thali...',
      tags: ['Cooking', 'Traditional', 'Rajasthan', 'Food'],
      donations: 8500,
      streamUrl: 'https://example.com/stream1',
      createdAt: new Date()
    }
    res.json(stream)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get stream chat
router.get('/:id/chat', async (req, res) => {
  try {
    const { id } = req.params
    // Mock chat messages - replace with actual database query
    const chatMessages = [
      {
        id: '1',
        user: 'Viewer123',
        message: 'Amazing cooking skills! 👏',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'message'
      },
      {
        id: '2',
        user: 'FoodLover',
        message: 'Can you show us the recipe?',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        type: 'message'
      },
      {
        id: '3',
        user: 'Supporter1',
        message: 'Thank you for sharing your culture!',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        type: 'donation',
        amount: 500
      }
    ]
    res.json(chatMessages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send chat message
router.post('/:id/chat', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { message } = req.body
    const { name } = req.user

    // Mock message creation - replace with actual database operation
    const newMessage = {
      id: Date.now().toString(),
      user: name,
      message,
      timestamp: new Date(),
      type: 'message'
    }

    res.json(newMessage)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get stream donations
router.get('/:id/donations', async (req, res) => {
  try {
    const { id } = req.params
    // Mock donations data - replace with actual database query
    const donations = [
      {
        id: '1',
        user: 'Supporter1',
        amount: 500,
        message: 'Thank you for sharing your culture!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '2',
        user: 'CulturalExplorer',
        amount: 1000,
        message: 'Amazing work!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      }
    ]
    res.json(donations)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send donation
router.post('/:id/donations', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { amount, message } = req.body
    const { name } = req.user

    // Mock donation creation - replace with actual database operation
    const newDonation = {
      id: Date.now().toString(),
      user: name,
      amount,
      message: message || 'Thank you for the amazing content!',
      timestamp: new Date()
    }

    res.json(newDonation)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router 