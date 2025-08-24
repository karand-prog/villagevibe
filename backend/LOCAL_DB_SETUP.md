# Local MongoDB Database Setup Guide

This guide will help you set up a local MongoDB database for VillageVibe development.

## 🚀 Quick Setup (Automated)

Run the automated setup script:

```bash
cd backend
npm run setup
```

This script will:
- Check if MongoDB is installed
- Create a `.env` file with local database configuration
- Install dependencies
- Provide next steps

## 📥 Manual MongoDB Installation

If the automated setup doesn't work, follow these steps:

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your operating system and version
   - Download the installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - **Important**: Check "Install MongoDB as a Service"
   - Complete the installation

3. **Verify Installation**
   ```bash
   mongod --version
   ```

### Option 2: MongoDB Atlas (Cloud - No Local Installation)

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Choose "Free" tier
   - Select your preferred region
   - Create cluster

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update .env File**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/villagevibe
   ```

## ⚙️ Configuration

### Create .env File

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
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
```

## 🌱 Seed Database with Sample Data

After setting up MongoDB, populate it with sample data:

```bash
cd backend
npm run seed
```

This will create:
- 3 sample users (2 hosts, 1 guest)
- 2 sample village listings
- 1 sample booking

## 🚀 Start the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔑 Test Accounts

After seeding the database, you can use these test accounts:

### Host Accounts
- **Email**: rajesh@villagevibe.com
- **Password**: password123

- **Email**: amit@villagevibe.com
- **Password**: password123

### Guest Account
- **Email**: priya@example.com
- **Password**: password123

## 🛠️ Useful Commands

```bash
# Setup local database
npm run setup

# Seed database with sample data
npm run seed

# Reset database (clear and reseed)
npm run reset

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Troubleshooting

### MongoDB Service Not Running

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or use Services app
services.msc
# Find "MongoDB" and start it
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### Port Already in Use

If port 27017 is already in use:

1. **Find the process using the port**
   ```bash
   # Windows
   netstat -ano | findstr :27017
   
   # macOS/Linux
   lsof -i :27017
   ```

2. **Kill the process**
   ```bash
   # Windows (replace PID with actual process ID)
   taskkill /PID <PID> /F
   
   # macOS/Linux
   kill -9 <PID>
   ```

### Connection Refused

If you get "ECONNREFUSED" error:

1. **Check if MongoDB is running**
2. **Verify the connection string in .env**
3. **Check firewall settings**
4. **Try restarting MongoDB service**

## 📊 Database Management

### View Database in MongoDB Compass

1. **Download MongoDB Compass**
   - Go to: https://www.mongodb.com/try/download/compass
   - Download and install

2. **Connect to Database**
   - Open MongoDB Compass
   - Use connection string: `mongodb://localhost:27017`
   - Browse the `villagevibe` database

### Reset Database

To clear all data and reseed:

```bash
npm run reset
```

## 🎯 Next Steps

1. ✅ Set up local MongoDB
2. ✅ Seed database with sample data
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Test authentication
6. ✅ Test village listings
7. ✅ Test booking functionality

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify MongoDB service is running
3. Check the `.env` file configuration
4. Ensure all dependencies are installed
5. Check the console for error messages 