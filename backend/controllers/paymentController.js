const Booking = require('../models/Booking')
const { sendEmail } = require('../config/email')

// Stripe Checkout Session (test-mode)
exports.createStripeCheckout = async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata } = req.body
    const key = process.env.STRIPE_SECRET_KEY
    
    if (!key) {
      // Enhanced fallback mock payment system
      const mockPaymentId = 'mock_pay_' + Math.random().toString(36).slice(2)
      const mockSessionId = 'sess_mock_' + Math.random().toString(36).slice(2)
      
      // Create a mock payment session that simulates Stripe
      const mockSession = {
        id: mockSessionId,
        url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/mock-payment?session_id=${mockSessionId}&amount=${amount}&metadata=${encodeURIComponent(JSON.stringify(metadata))}`,
        payment_intent: mockPaymentId,
        amount_total: amount,
        currency: currency.toUpperCase(),
        status: 'open'
      }
      
      console.log('Mock payment session created:', mockSession)
      return res.json({ 
        id: mockSession.id, 
        url: mockSession.url,
        isMock: true,
        message: 'Using mock payment system - Stripe not configured'
      })
    }
    
    const stripe = require('stripe')(key)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'VillageVibe Booking' },
            unit_amount: Number(amount),
          },
          quantity: 1,
        },
      ],
      metadata: metadata || {},
      success_url: (process.env.FRONTEND_URL || 'http://localhost:3000') + '/bookings?status=success',
      cancel_url: (process.env.FRONTEND_URL || 'http://localhost:3000') + '/bookings?status=cancel',
    })

    res.json({ id: session.id, url: session.url, isMock: false })
  } catch (err) {
    console.error('Payment session creation error:', err)
    res.status(500).json({ message: err.message })
  }
}

// Demo/mock payment order creation
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const order = {
      id: 'order_demo_' + Math.random().toString(36).substring(2, 10),
      amount,
      currency,
      receipt,
      status: 'created',
      created_at: Date.now(),
    };
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mock payment capture and booking confirmation
exports.capturePayment = async (req, res) => {
  try {
    const { bookingId, paymentId, amount } = req.body;
    // Find and update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', paymentId, paymentAmount: amount },
      { new: true }
    ).populate('host guest listing');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    // Revenue split
    const hostShare = Math.round(amount * 0.85);
    const platformShare = amount - hostShare;
    // Send email notifications (non-blocking)
    try {
      if (booking.guest?.email) {
        sendEmail({
          to: booking.guest.email,
          subject: 'Payment Received - VillageVibe',
          text: `Your payment for ${booking.listing?.title} is successful!`,
          html: `<p>Your payment for <b>${booking.listing?.title}</b> is successful!</p><p>Amount: ₹${amount}<br/>Payment ID: ${paymentId}</p>`
        })
      }
      if (booking.host?.email) {
        sendEmail({
          to: booking.host.email,
          subject: 'Booking Payment Received - VillageVibe',
          text: `You have received a payment for ${booking.listing?.title}.`,
          html: `<p>You have received a payment for <b>${booking.listing?.title}</b> from ${booking.guest?.name}.</p><p>Amount: ₹${hostShare} (your share)<br/>Payment ID: ${paymentId}</p>`
        })
      }
    } catch (e) { /* ignore email errors */ }
    res.json({
      message: 'Payment captured and booking confirmed',
      booking,
      payment: {
        paymentId,
        amount,
        hostShare,
        platformShare,
        status: 'captured',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Razorpay webhook (mock verify) — accepts event and updates booking if needed
exports.webhook = async (req, res) => {
  try {
    const { event, payload } = req.body || {}
    if (event === 'payment.captured') {
      const { bookingId, payment } = payload || {}
      if (bookingId && payment?.id && payment?.amount) {
        await Booking.findByIdAndUpdate(
          bookingId,
          { status: 'confirmed', paymentId: payment.id, paymentAmount: payment.amount },
          { new: true }
        )
      }
    }
    res.json({ received: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}