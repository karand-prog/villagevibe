const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact')

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone, type } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const doc = await Contact.create({
      name,
      email: email.toLowerCase(),
      phone,
      subject,
      message,
      type: type || 'general',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    console.log('Contact inquiry saved:', { id: doc._id })

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      inquiry: { id: doc._id }
    });
  } catch (error) {
    console.error('Contact save error:', error)
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router; 