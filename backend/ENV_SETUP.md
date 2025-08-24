# Environment Variables Setup Guide

Create a `.env` file in the backend directory with the following variables:

## Required Environment Variables

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/villagevibe

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Environment
NODE_ENV=development
```

## Setup Instructions

### 1. Database Setup
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGO_URI` with your database connection string

### 2. Email Setup (Gmail)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Update `EMAIL_USER` and `EMAIL_PASS` in your `.env` file

### 3. JWT Secret
- Generate a strong random string for `JWT_SECRET`
- You can use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 4. Razorpay Setup (Optional for payments)
1. Sign up at https://razorpay.com
2. Get your API keys from the dashboard
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

## Testing the Setup

After creating your `.env` file, run:
```bash
npm run dev
```

The server should start without errors and you should see:
- "MongoDB connected"
- "Server running on port 5000" 