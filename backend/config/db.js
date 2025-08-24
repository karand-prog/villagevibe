const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use Railway DATABASE_URL, then MONGO_URI, then local MongoDB
    const mongoURI = process.env.DATABASE_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/villagevibe';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    
    // If local MongoDB fails, try to use in-memory database
    if (err.message.includes('ECONNREFUSED') || err.message.includes('MongoNetworkError')) {
      console.log('Local MongoDB not available. Please install MongoDB or use MongoDB Atlas.');
      console.log('To install MongoDB locally:');
      console.log('1. Download from: https://www.mongodb.com/try/download/community');
      console.log('2. Install and start MongoDB service');
      console.log('3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 