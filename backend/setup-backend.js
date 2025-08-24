const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/villagevibe');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const setupSampleData = async () => {
  try {
    console.log('Setting up sample data...');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedPassword,
        phone: '+91 98765 43210',
        role: 'host'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        phone: '+91 98765 43211',
        role: 'host'
      },
      {
        name: 'Adventure Seeker',
        email: 'adventure@example.com',
        password: hashedPassword,
        phone: '+91 98765 43212',
        role: 'user'
      }
    ]);

    console.log('Sample users created');

    // Create sample listings
    const listings = await Listing.create([
      {
        title: 'Traditional Rajasthani Village Homestay',
        description: 'Experience authentic rural life in Rajasthan with traditional hospitality, folk music, and local cuisine. Stay in a traditional mud house and learn about local customs.',
        location: {
          state: 'Rajasthan',
          village: 'Pushkar',
          coordinates: [74.5559, 26.4898]
        },
        price: 2500,
        experienceType: 'Homestay',
        maxGuests: 6,
        amenities: ['Traditional Food', 'Cultural Shows', 'WiFi', 'Local Guide', 'Transportation'],
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'
        ],
        highlights: ['Desert Safari', 'Folk Music', 'Traditional Cooking', 'Temple Visit', 'Local Markets'],
        host: users[0]._id,
        rating: 4.8,
        reviews: 25,
        availability: true
      },
      {
        title: 'Kerala Backwaters Village Experience',
        description: 'Stay in traditional houseboats and experience the serene beauty of Kerala backwaters. Learn about local fishing techniques and enjoy authentic Kerala cuisine.',
        location: {
          state: 'Kerala',
          village: 'Alleppey',
          coordinates: [76.3273, 9.4981]
        },
        price: 3500,
        experienceType: 'Cultural Experience',
        maxGuests: 4,
        amenities: ['Houseboat', 'Ayurvedic Massage', 'Local Food', 'Fishing Equipment', 'Guide'],
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
        ],
        highlights: ['Backwater Cruise', 'Ayurvedic Treatment', 'Coconut Farming', 'Local Fishing', 'Sunset Views'],
        host: users[1]._id,
        rating: 4.9,
        reviews: 18,
        availability: true
      },
      {
        title: 'Himachal Mountain Village Retreat',
        description: 'Experience mountain village life in the beautiful Himalayas. Trek through scenic trails, learn about local farming, and enjoy panoramic mountain views.',
        location: {
          state: 'Himachal Pradesh',
          village: 'Manali',
          coordinates: [77.1025, 32.2432]
        },
        price: 2800,
        experienceType: 'Adventure',
        maxGuests: 8,
        amenities: ['Mountain Views', 'Trekking', 'Local Cuisine', 'Bonfire', 'Adventure Equipment'],
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
        ],
        highlights: ['Mountain Trekking', 'Local Festivals', 'Apple Picking', 'River Rafting', 'Stargazing'],
        host: users[0]._id,
        rating: 4.7,
        reviews: 32,
        availability: true
      }
    ]);

    console.log('Sample listings created');

    // Create sample bookings
    const bookings = await Booking.create([
      {
        listing: listings[0]._id,
        guest: users[2]._id,
        host: users[0]._id,
        checkIn: new Date('2024-01-15'),
        checkOut: new Date('2024-01-18'),
        guestsCount: 2,
        totalPrice: 7500,
        status: 'confirmed'
      },
      {
        listing: listings[1]._id,
        guest: users[2]._id,
        host: users[1]._id,
        checkIn: new Date('2024-02-10'),
        checkOut: new Date('2024-02-13'),
        guestsCount: 3,
        totalPrice: 10500,
        status: 'confirmed'
      }
    ]);

    console.log('Sample bookings created');
    console.log('✅ Sample data setup completed successfully!');

    // Display sample data summary
    console.log('\n📊 Sample Data Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏘️ Listings: ${listings.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);

    console.log('\n🔑 Test Credentials:');
    console.log('Email: adventure@example.com');
    console.log('Password: password123');

  } catch (err) {
    console.error('Error setting up sample data:', err);
  }
};

const runSetup = async () => {
  await connectDB();
  await setupSampleData();
  process.exit(0);
};

runSetup(); 