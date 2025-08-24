const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  categories: [{
    type: String,
    enum: ['cleanliness', 'communication', 'check-in', 'accuracy', 'location', 'value']
  }],
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  images: [{
    url: String,
    caption: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.length;
});

// Indexes for better query performance
reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });

// Ensure one review per user per listing
reviewSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 