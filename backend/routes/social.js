const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Mock leaderboard data - replace with actual database query
    const leaderboard = [
      {
        id: '1',
        name: 'Village Master',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        rank: 1,
        level: 25,
        xp: 15000,
        totalTrips: 45,
        badges: 28
      },
      {
        id: '2',
        name: 'Cultural Explorer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        rank: 2,
        level: 20,
        xp: 12000,
        totalTrips: 38,
        badges: 25
      }
    ]
    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user badges
router.get('/user/badges', auth, async (req, res) => {
  try {
    // Mock badges data - replace with actual database query
    const badges = [
      {
        id: '1',
        name: 'First Village Explorer',
        description: 'Visit your first village experience',
        icon: '🏘️',
        category: 'exploration',
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        unlockedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Cultural Ambassador',
        description: 'Participate in 5 cultural activities',
        icon: '🎭',
        category: 'cultural',
        unlocked: true,
        progress: 5,
        maxProgress: 5,
        unlockedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        rarity: 'rare'
      }
    ]
    res.json(badges)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user achievements
router.get('/user/achievements', auth, async (req, res) => {
  try {
    // Mock achievements data - replace with actual database query
    const achievements = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first village booking',
        icon: '👣',
        unlocked: true,
        unlockedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        points: 100,
        category: 'exploration'
      },
      {
        id: '2',
        name: 'Cultural Immersion',
        description: 'Spend 7 days in village experiences',
        icon: '🏺',
        unlocked: true,
        unlockedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        points: 250,
        category: 'cultural'
      }
    ]
    res.json(achievements)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user challenges
router.get('/user/challenges', auth, async (req, res) => {
  try {
    // Mock challenges data - replace with actual database query
    const challenges = [
      {
        id: '1',
        title: 'Weekly Explorer',
        description: 'Visit 3 different villages this week',
        type: 'weekly',
        progress: 1,
        target: 3,
        reward: { xp: 200, points: 50 },
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        isCompleted: false
      },
      {
        id: '2',
        title: 'Cultural Learner',
        description: 'Participate in 5 cultural activities',
        type: 'daily',
        progress: 3,
        target: 5,
        reward: { xp: 100, points: 25 },
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isCompleted: false
      }
    ]
    res.json(challenges)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get friends
router.get('/friends', auth, async (req, res) => {
  try {
    // Mock friends data - replace with actual database query
    const friends = [
      {
        id: '1',
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        level: 12,
        rank: 8,
        isOnline: true,
        lastSeen: new Date(),
        mutualTrips: 3
      },
      {
        id: '2',
        name: 'Rajesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        level: 9,
        rank: 15,
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        mutualTrips: 1
      }
    ]
    res.json(friends)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add friend
router.post('/friends', auth, async (req, res) => {
  try {
    const { userId } = req.body
    // Mock friend addition - replace with actual database operation
    res.json({ message: 'Friend added successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router 