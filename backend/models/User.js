const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
  },
  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user',
  },
  profile: {
    bio: String,
    location: {
      city: String,
      state: String,
      country: { type: String, default: 'India' },
    },
    languages: [String],
    interests: [String],
    preferences: {
      budget: {
        min: Number,
        max: Number,
      },
      travelStyle: [String], // ['adventure', 'cultural', 'relaxation', 'family']
      accommodationType: [String], // ['homestay', 'farmstay', 'heritage']
    },
  },
  verification: {
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    identityVerified: { type: Boolean, default: false },
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true },
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
  },
  stats: {
    totalBookings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    memberSince: { type: Date, default: Date.now },
  },
  social: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for better query performance
userSchema.index({ 'profile.location.state': 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
