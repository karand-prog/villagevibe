const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const auth = require('../middleware/auth')
const { body } = require('express-validator')

// Public: Get all bookings (for admin/testing)
router.get('/', bookingController.getBookings)

// Protected: Get user's own bookings
router.get('/my-bookings', auth, bookingController.getUserBookings)

// Public: Get a single booking by ID
router.get('/:id', bookingController.getBookingById)

// Protected: Create a new booking
router.post('/', auth, [
  body('listing').notEmpty().withMessage('Listing ID is required'),
  body('checkIn').custom((value) => {
    if (!value) throw new Error('Check-in date is required');
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error('Valid check-in date is required');
    return true;
  }),
  body('checkOut').custom((value) => {
    if (!value) throw new Error('Check-out date is required');
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error('Valid check-out date is required');
    return true;
  }),
  body('guestsCount').isInt({ min: 1 }).withMessage('Guests count must be at least 1'),
  body('totalPrice').custom((value) => {
    if (value === undefined || value === null) throw new Error('Total price is required');
    const num = Number(value);
    if (isNaN(num) || num < 0) throw new Error('Total price must be a valid positive number');
    return true;
  }),
], bookingController.createBooking)

// Protected: Update a booking (user can only update their own bookings)
router.put('/:id', auth, bookingController.updateBooking)

// Protected: Cancel a booking (user can only cancel their own bookings)
router.patch('/:id/cancel', auth, bookingController.cancelBooking)

// Protected: Delete a booking (user can only delete their own bookings)
router.delete('/:id', auth, bookingController.deleteBooking)

module.exports = router 