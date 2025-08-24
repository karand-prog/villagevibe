const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

console.log('🔗 CORS Configuration:');
console.log('   - NODE_ENV:', process.env.NODE_ENV);
console.log('   - Allowed origins:', allowedOrigins);
console.log('   - Development mode:', process.env.NODE_ENV === 'development');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: No origin - allowing');
      return callback(null, true);
    }
    
    console.log(`CORS: Request from origin: ${origin}`);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS: Origin in allowed list - allowing');
      callback(null, true);
    } else {
      // In development, allow any localhost origin with any port
      if (process.env.NODE_ENV === 'development' && 
          (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        console.log(`CORS: Development mode - allowing localhost origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`CORS: Blocking origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please wait a moment before making more requests.',
      retryAfter: Math.ceil(15 * 60 / 60) // Retry after 15 minutes
    });
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/villagevibe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VillageVibe API is running' });
});

// Core API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listing'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/dashboard', require('./routes/dashboard'));
// AI routes
app.use('/api/ai', require('./routes/ai'));

// Feature routes
app.use('/api/reviews', require('./routes/review'));
app.use('/api/achievements', require('./routes/achievement'));
app.use('/api/volunteer', require('./routes/volunteer'));
app.use('/api/blockchain', require('./routes/blockchain'));
app.use('/api/audio-stories', require('./routes/audioStory'));

// Form handling routes
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));

// User profile routes
app.use('/api/user', require('./routes/user'));

// Favorites routes
app.use('/api/favorites', require('./routes/favorites'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 VillageVibe Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;