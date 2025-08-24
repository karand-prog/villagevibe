const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')

// Calculate impact metrics for a booking
function calculateImpact(booking) {
  const baseAmount = booking.totalAmount || booking.totalPrice || 2500
  const checkIn = new Date(booking.checkIn)
  const checkOut = new Date(booking.checkOut)
  const days = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)))
  return {
    localIncome: Math.round(baseAmount * 0.85),
    co2Saved: Math.round(days * 12.5),
    artisanWork: Math.round(baseAmount * 0.15),
    familiesSupported: Math.round(baseAmount / 500),
    waterSaved: Math.round(days * 200),
    plasticReduced: Math.round(days * 0.5),
    culturalPreservation: Math.round(baseAmount * 0.10),
    localEmployment: Math.round(baseAmount / 1000),
    communityDevelopment: Math.round(baseAmount * 0.05),
    sustainablePractices: Math.round(days * 8)
  }
}

// GET /api/impact?bookingId=...
router.get('/', async (req, res) => {
  try {
    const { bookingId } = req.query
    if (!bookingId) return res.status(400).json({ error: 'bookingId is required' })
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ error: 'Booking not found' })
    const impact = calculateImpact(booking)
    res.json(impact)
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate impact' })
  }
})

module.exports = router 