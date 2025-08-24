const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['listing', 'experience', 'plan'],
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  itemData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Compound index to ensure unique user-item combinations
favoriteSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true })

module.exports = mongoose.model('Favorite', favoriteSchema) 