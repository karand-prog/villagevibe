const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback')

// GET /api/feedback - Get all feedback (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 }).limit(200)
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, type, message, rating } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' })

    const doc = await Feedback.create({
      name,
      email: email?.toLowerCase(),
      type: type || 'general',
      rating,
      message,
      source: 'website',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      id: doc._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router; 