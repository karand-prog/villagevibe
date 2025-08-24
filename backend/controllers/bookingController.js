const Booking = require('../models/Booking')
const { sendEmail } = require('../config/email')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

// Create a new booking
exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Handle string IDs by creating a new ObjectId if needed
    let listingId = req.body.listing
    if (typeof listingId === 'string' && !mongoose.Types.ObjectId.isValid(listingId)) {
      // For sample data with string IDs, create a new ObjectId
      listingId = new mongoose.Types.ObjectId()
    }
    
    const booking = new Booking({ 
      ...req.body, 
      listing: listingId,
      guest: req.user.id,
      host: req.user.id, // For now, use the same user as host for sample data
      totalPrice: Number(req.body.totalPrice), // Ensure it's a number
      guestsCount: Number(req.body.guestsCount) // Ensure it's a number
    })
    await booking.save()
    await booking.populate('guest', 'name email')
    await booking.populate('host', 'name email')
    await booking.populate('listing')
    // Send email notifications (non-blocking)
    try {
      if (booking.guest?.email) {
        sendEmail({
          to: booking.guest.email,
          subject: 'Booking Confirmation - VillageVibe',
          text: `Your booking for ${booking.listing?.title || 'your experience'} is confirmed!`,
          html: `<p>Your booking for <b>${booking.listing?.title || 'your experience'}</b> is confirmed!</p><p>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}<br/>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</p>`
        })
      }
      if (booking.host?.email) {
        sendEmail({
          to: booking.host.email,
          subject: 'New Booking Received - VillageVibe',
          text: `You have a new booking for ${booking.listing?.title || 'an experience'}.`,
          html: `<p>You have a new booking for <b>${booking.listing?.title || 'an experience'}</b> from ${booking.guest?.name}.</p><p>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}<br/>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</p>`
        })
      }
    } catch (e) { /* ignore email errors */ }
    res.status(201).json(booking)
  } catch (err) {
    console.log('Booking creation error:', err);
    res.status(400).json({ error: err.message })
  }
}

// Get all bookings (admin or for testing)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('guest', 'name email').populate('host', 'name email').populate('listing')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get user's own bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate('listing', 'title images location price rating')
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('guest', 'name email').populate('host', 'name email').populate('listing')
    if (!booking) return res.status(404).json({ error: 'Booking not found' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update a booking (status, dates, etc.)
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, guest: req.user.id })
    if (!booking) return res.status(404).json({ error: 'Booking not found or unauthorized' })
    
    Object.assign(booking, req.body)
    await booking.save()
    
    const updatedBooking = await Booking.findById(req.params.id)
      .populate('listing', 'title images location price rating')
      .populate('host', 'name email')
    
    res.json(updatedBooking)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, guest: req.user.id })
    if (!booking) return res.status(404).json({ error: 'Booking not found or unauthorized' })
    
    booking.status = 'cancelled'
    await booking.save()
    
    // Send cancellation email (non-blocking)
    try {
      if (booking.guest?.email) {
        sendEmail({
          to: booking.guest.email,
          subject: 'Booking Cancelled - VillageVibe',
          text: `Your booking for ${booking.listing?.title} has been cancelled.`,
          html: `<p>Your booking for <b>${booking.listing?.title}</b> has been cancelled.</p>`
        })
      }
    } catch (e) { /* ignore email errors */ }
    
    res.json({ message: 'Booking cancelled successfully', booking })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, guest: req.user.id })
    if (!booking) return res.status(404).json({ error: 'Booking not found or unauthorized' })
    
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Booking deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
} 