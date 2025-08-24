const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    maxlength: 50
  },
  lastName: {
    type: String,
    maxlength: 50
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'pending'],
    default: 'subscribed'
  },
  preferences: {
    weeklyUpdates: {
      type: Boolean,
      default: true
    },
    newExperiences: {
      type: Boolean,
      default: true
    },
    specialOffers: {
      type: Boolean,
      default: true
    },
    culturalNews: {
      type: Boolean,
      default: false
    }
  },
  source: {
    type: String,
    enum: ['website', 'app', 'email', 'social', 'referral'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  lastEmailSent: Date,
  unsubscribeToken: String,
  tags: [String]
}, {
  timestamps: true
});

// Indexes
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema); 