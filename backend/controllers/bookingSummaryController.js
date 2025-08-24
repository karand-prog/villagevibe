const Booking = require('../models/Booking')

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user?.id
    const [totalBookings, upcoming, completed, totalSpentAgg] = await Promise.all([
      Booking.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId, checkIn: { $gte: new Date() } }),
      Booking.countDocuments({ user: userId, status: 'completed' }),
      Booking.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ])
    const totalSpent = totalSpentAgg?.[0]?.total || 0
    res.json({ totalBookings, upcoming, completed, totalSpent })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

