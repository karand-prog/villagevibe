const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Feedback = require('./models/Feedback');
const Contact = require('./models/Contact');
const Newsletter = require('./models/Newsletter');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/villagevibe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Feedback.deleteMany({});
    await Contact.deleteMany({});
    await Newsletter.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@villagevibe.com',
      password: adminPassword,
      role: 'admin',
      isHost: true,
      profile: {
        bio: 'System administrator for VillageVibe platform',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        languages: ['English', 'Hindi', 'Marathi'],
        interests: ['technology', 'tourism', 'community development']
      },
      verification: {
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true
      }
    });

    // Create sample users
    const users = await User.create([
      {
        name: 'Rajesh Meena',
        email: 'rajesh@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 98765 43210',
        isHost: true,
        role: 'host',
        profile: {
          bio: 'Traditional Rajasthani village host with 10+ years of experience',
          location: {
            city: 'Pushkar',
            state: 'Rajasthan',
            country: 'India'
          },
          languages: ['Hindi', 'English', 'Rajasthani'],
          interests: ['traditional crafts', 'folk music', 'cooking'],
          preferences: {
            budget: { min: 1000, max: 5000 },
            travelStyle: ['cultural', 'family'],
            accommodationType: ['homestay', 'heritage']
          }
        },
        verification: {
          emailVerified: true,
          phoneVerified: true,
          identityVerified: true
        },
        stats: {
          totalBookings: 156,
          totalReviews: 127,
          averageRating: 4.8,
          memberSince: new Date('2020-03-15')
        }
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 98765 43211',
        isHost: false,
        role: 'user',
        profile: {
          bio: 'Travel enthusiast from Delhi, loves exploring rural India',
          location: {
            city: 'Delhi',
            state: 'Delhi',
            country: 'India'
          },
          languages: ['Hindi', 'English'],
          interests: ['photography', 'local cuisine', 'cultural experiences'],
          preferences: {
            budget: { min: 2000, max: 8000 },
            travelStyle: ['adventure', 'cultural'],
            accommodationType: ['homestay', 'farmstay']
          }
        },
        verification: {
          emailVerified: true,
          phoneVerified: true,
          identityVerified: false
        },
        stats: {
          totalBookings: 12,
          totalReviews: 8,
          averageRating: 4.5,
          memberSince: new Date('2023-06-20')
        }
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+91 98765 43212',
        isHost: true,
        role: 'host',
        profile: {
          bio: 'Organic farmer and homestay host in Gujarat',
          location: {
            city: 'Ahmedabad',
            state: 'Gujarat',
            country: 'India'
          },
          languages: ['Gujarati', 'Hindi', 'English'],
          interests: ['organic farming', 'traditional crafts', 'yoga'],
          preferences: {
            budget: { min: 1500, max: 4000 },
            travelStyle: ['relaxation', 'family'],
            accommodationType: ['farmstay', 'homestay']
          }
        },
        verification: {
          emailVerified: true,
          phoneVerified: true,
          identityVerified: true
        },
        stats: {
          totalBookings: 89,
          totalReviews: 67,
          averageRating: 4.7,
          memberSince: new Date('2021-09-10')
        }
      }
    ]);

    // Create sample listings
    const listings = await Listing.create([
      {
        title: 'Traditional Rajasthani Village Homestay',
        description: 'Experience authentic rural life in this traditional mud house with home-cooked meals and cultural activities.',
        host: users[0]._id,
        location: {
          village: 'Pushkar',
          state: 'Rajasthan',
          coordinates: [74.5511, 26.4897] // [lng, lat] format
        },
        price: 2500,
        experienceType: 'Homestay',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Traditional Meals',
          'WiFi',
          'Cultural Activities',
          'Organic Garden'
        ]
      },
      {
        title: 'Rajasthani Folk Music & Dance Workshop',
        description: 'Learn traditional Rajasthani folk music and dance forms from local artists. Experience the vibrant culture through music, instruments, and dance steps passed down through generations.',
        host: users[0]._id,
        location: {
          village: 'Jaisalmer',
          state: 'Rajasthan',
          coordinates: [70.9028, 26.9157]
        },
        price: 1200,
        experienceType: 'Folk Music',
        images: [
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Live Music',
          'Traditional Instruments',
          'Dance Performance',
          'Cultural Stories'
        ]
      },
      {
        title: 'Kerala Traditional Cooking Class',
        description: 'Master the art of Kerala cuisine with local grandmothers. Learn to cook authentic dishes using traditional methods and local spices in a village kitchen setting.',
        host: users[1]._id,
        location: {
          village: 'Alleppey',
          state: 'Kerala',
          coordinates: [76.2673, 9.4981]
        },
        price: 800,
        experienceType: 'Traditional Food',
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Cooking Class',
          'Local Spices',
          'Recipe Book',
          'Traditional Kitchen'
        ]
      },
      {
        title: 'Madhubani Painting Workshop',
        description: 'Create beautiful Madhubani paintings with local artisans. Learn the ancient art form using natural colors and traditional techniques in a peaceful village setting.',
        host: users[2]._id,
        location: {
          village: 'Madhubani',
          state: 'Bihar',
          coordinates: [86.0716, 26.3537]
        },
        price: 600,
        experienceType: 'Craft Workshop',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Art Supplies',
          'Expert Guidance',
          'Take Home Artwork',
          'Cultural History'
        ]
      },
      {
        title: 'Holi Festival Celebration',
        description: 'Experience the vibrant Holi festival in a traditional village setting. Participate in local customs, traditional songs, and the colorful celebration with village families.',
        host: users[0]._id,
        location: {
          village: 'Vrindavan',
          state: 'Uttar Pradesh',
          coordinates: [77.6961, 27.5816]
        },
        price: 1500,
        experienceType: 'Local Festival',
        images: [
          'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Traditional Colors',
          'Local Food',
          'Cultural Songs',
          'Festival Attire'
        ]
      },
      {
        title: 'Pottery Making with Master Artisans',
        description: 'Learn pottery making from master artisans using traditional techniques. Create your own clay pots and understand the cultural significance of pottery in rural India.',
        host: users[2]._id,
        location: {
          village: 'Khurja',
          state: 'Uttar Pradesh',
          coordinates: [78.2078, 28.2534]
        },
        price: 900,
        experienceType: 'Artisan Visit',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Clay & Tools',
          'Expert Guidance',
          'Take Home Pottery',
          'Cultural Stories'
        ]
      },
      {
        title: 'Bharatanatyam Dance Workshop',
        description: 'Learn the classical Indian dance form Bharatanatyam from trained dancers. Experience the grace, expressions, and storytelling through dance in a traditional setting.',
        host: users[1]._id,
        location: {
          village: 'Tanjore',
          state: 'Tamil Nadu',
          coordinates: [79.1376, 10.7905]
        },
        price: 1100,
        experienceType: 'Dance Workshop',
        images: [
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Dance Attire',
          'Live Music',
          'Expert Instruction',
          'Performance'
        ]
      },
      {
        title: 'Gujarati Farm Stay Experience',
        description: 'Stay on an organic farm and learn traditional farming methods while enjoying fresh farm-to-table meals.',
        host: users[2]._id,
        location: {
          village: 'Anand',
          state: 'Gujarat',
          coordinates: [72.9629, 22.5567] // [lng, lat] format
        },
        price: 1800,
        experienceType: 'Farmstay',
        images: [
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'
        ],
        amenities: [
          'Organic Meals',
          'Farming Workshop',
          'Yoga Classes',
          'Fresh Produce'
        ]
      }
    ]);

    // Create sample bookings
    const bookings = await Booking.create([
      {
        guest: users[1]._id,
        listing: listings[0]._id,
        host: users[0]._id,
        checkIn: new Date('2024-03-15'),
        checkOut: new Date('2024-03-18'),
        guestsCount: 2,
        totalPrice: 7500,
        status: 'confirmed'
      },
      {
        guest: users[1]._id,
        listing: listings[1]._id,
        host: users[2]._id,
        checkIn: new Date('2024-04-10'),
        checkOut: new Date('2024-04-12'),
        guestsCount: 1,
        totalPrice: 3600,
        status: 'pending'
      }
    ]);

    // Create sample reviews
    const reviews = await Review.create([
      {
        user: users[1]._id,
        listing: listings[0]._id,
        rating: 5,
        content: 'This was exactly what we were looking for - an authentic village experience. Rajesh and his family were incredibly welcoming.',
        categories: ['cleanliness', 'communication', 'check-in', 'accuracy', 'location', 'value']
      },
      {
        user: users[1]._id,
        listing: listings[1]._id,
        rating: 4,
        content: 'Loved the organic farming experience and the fresh meals. The accommodation was comfortable and clean.',
        categories: ['cleanliness', 'communication', 'check-in', 'accuracy', 'location', 'value']
      }
    ]);

    // Create sample feedback
    const feedback = await Feedback.create([
      {
        user: users[1]._id,
        type: 'feature',
        category: 'website',
        rating: 5,
        subject: 'Great platform for rural tourism',
        message: 'I love how VillageVibe connects travelers with authentic rural experiences. The platform is easy to use and the experiences are genuine.',
        status: 'pending',
        priority: 'medium'
      },
      {
        user: users[2]._id,
        type: 'bug',
        category: 'app',
        rating: 3,
        subject: 'Mobile app needs improvement',
        message: 'The mobile app crashes sometimes when trying to book experiences. Please fix this issue.',
        status: 'in-progress',
        priority: 'high'
      }
    ]);

    // Create sample contact inquiries
    const contacts = await Contact.create([
      {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 555 123 4567',
        subject: 'Partnership Inquiry',
        message: 'I represent a travel agency and would like to discuss partnership opportunities with VillageVibe.',
        type: 'partnership',
        source: 'website',
        status: 'new',
        priority: 'high'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        subject: 'General Inquiry',
        message: 'I would like to know more about becoming a host on your platform. What are the requirements?',
        type: 'general',
        source: 'website',
        status: 'new',
        priority: 'medium'
      }
    ]);

    // Create sample newsletter subscriptions
    const newsletters = await Newsletter.create([
      {
        email: 'traveler@example.com',
        name: 'Travel Enthusiast',
        preferences: {
          weeklyUpdates: true,
          newExperiences: true,
          hostOpportunities: false,
          culturalNews: true,
          promotions: true
        },
        source: 'website',
        status: 'subscribed'
      },
      {
        email: 'host@example.com',
        name: 'Potential Host',
        preferences: {
          weeklyUpdates: true,
          newExperiences: false,
          hostOpportunities: true,
          culturalNews: false,
          promotions: false
        },
        source: 'website',
        status: 'subscribed'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`👥 Created ${users.length + 1} users (including admin)`);
    console.log(`🏠 Created ${listings.length} listings`);
    console.log(`📅 Created ${bookings.length} bookings`);
    console.log(`⭐ Created ${reviews.length} reviews`);
    console.log(`💬 Created ${feedback.length} feedback entries`);
    console.log(`📞 Created ${contacts.length} contact inquiries`);
    console.log(`📧 Created ${newsletters.length} newsletter subscriptions`);

    console.log('\n🔑 Admin credentials:');
    console.log('Email: admin@villagevibe.com');
    console.log('Password: admin123');

    console.log('\n👤 Sample user credentials:');
    console.log('Email: rajesh@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 
