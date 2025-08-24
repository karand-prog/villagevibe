const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Create Razorpay order (protected route)
router.post('/create-order', auth, paymentController.createOrder);
router.post('/capture', auth, paymentController.capturePayment);
router.post('/webhook', paymentController.webhook);

// Stripe checkout (protected)
router.post('/stripe/checkout', auth, paymentController.createStripeCheckout);

module.exports = router; 