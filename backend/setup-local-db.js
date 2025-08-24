const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 VillageVibe Local Database Setup');
console.log('=====================================\n');

// Check if MongoDB is installed
function checkMongoDB() {
  return new Promise((resolve) => {
    exec('mongod --version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ MongoDB is not installed or not in PATH');
        resolve(false);
      } else {
        console.log('✅ MongoDB is installed:');
        console.log(stdout);
        resolve(true);
      }
    });
  });
}

// Check if MongoDB service is running
function checkMongoService() {
  return new Promise((resolve) => {
    exec('net start | findstr MongoDB', (error, stdout, stderr) => {
      if (error || !stdout) {
        console.log('❌ MongoDB service is not running');
        resolve(false);
      } else {
        console.log('✅ MongoDB service is running');
        resolve(true);
      }
    });
  });
}

// Create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    return;
  }

  const envContent = `# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/villagevibe

# JWT Configuration
JWT_SECRET=villagevibe_jwt_secret_key_2024_change_in_production

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Environment
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with local database configuration');
}

// Main setup function
async function setup() {
  console.log('1. Checking MongoDB installation...');
  const mongoInstalled = await checkMongoDB();
  
  if (!mongoInstalled) {
    console.log('\n📥 To install MongoDB:');
    console.log('1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community');
    console.log('2. Run the installer and follow the setup wizard');
    console.log('3. Make sure to install MongoDB as a service');
    console.log('4. Add MongoDB to your system PATH');
    console.log('\n🔄 After installation, run this script again.');
    return;
  }

  console.log('\n2. Checking MongoDB service...');
  const serviceRunning = await checkMongoService();
  
  if (!serviceRunning) {
    console.log('\n🔄 Starting MongoDB service...');
    exec('net start MongoDB', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Failed to start MongoDB service. Please start it manually:');
        console.log('   - Open Services (services.msc)');
        console.log('   - Find "MongoDB" service');
        console.log('   - Right-click and select "Start"');
      } else {
        console.log('✅ MongoDB service started successfully');
      }
    });
  }

  console.log('\n3. Creating environment configuration...');
  createEnvFile();

  console.log('\n4. Installing dependencies...');
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Failed to install dependencies:', error.message);
    } else {
      console.log('✅ Dependencies installed successfully');
    }
  });

  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the backend server: npm start');
  console.log('2. Start the frontend: cd .. && npm run dev');
  console.log('3. Test the application at: http://localhost:3000');
  console.log('\n💡 If you encounter any issues:');
  console.log('- Make sure MongoDB service is running');
  console.log('- Check that port 27017 is not blocked');
  console.log('- Verify your .env file configuration');
}

setup().catch(console.error); 