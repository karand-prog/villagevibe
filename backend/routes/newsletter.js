const express = require('express');
const router = express.Router();

const Newsletter = require('../models/Newsletter')

// POST /api/newsletter - Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const [firstName, ...rest] = (name || '').trim().split(' ')
    const lastName = rest.join(' ')
    const doc = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        email: email.toLowerCase(),
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        status: 'subscribed',
        source: 'website',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.status(201).json({ message: 'Successfully subscribed to newsletter', subscription: doc })
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});

// DELETE /api/newsletter - Unsubscribe from newsletter
router.delete('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' })
    await Newsletter.findOneAndUpdate({ email: email.toLowerCase() }, { status: 'unsubscribed' })
    res.json({ message: 'Successfully unsubscribed from newsletter', email })
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe from newsletter' });
  }
});

module.exports = router; 