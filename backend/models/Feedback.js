const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, maxlength: 100 },
  email: { type: String, lowercase: true, trim: true },
  type: { type: String, enum: ['bug', 'idea', 'general', 'support', 'other'], default: 'general' },
  rating: { type: Number, min: 1, max: 5 },
  message: { type: String, required: true, maxlength: 2000 },
  source: { type: String, enum: ['website', 'app'], default: 'website' },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ type: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema); 