# VillageVibe Authentication Setup Guide

## Issues Fixed

1. **Enhanced Error Handling** - Better error messages and validation
2. **Improved API Communication** - Added proper headers and logging
3. **User Role Management** - Fixed role handling in AuthContext
4. **Form Validation** - Added client-side validation
5. **Loading States** - Disabled forms during submission

## Setup Instructions

### 1. Backend Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/villagevibe

# JWT Configuration
JWT_SECRET=villagevibe_jwt_secret_key_2024_change_in_production

# Environment
NODE_ENV=development
```

### 2. Frontend Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start the Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
- "MongoDB connected"
- "Server running on port 5000"

### 4. Start the Frontend

```bash
npm run dev
```

### 5. Test Authentication

Run the test script to verify everything works:

```bash
node test-auth.js
```

## Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:** 
- Install MongoDB locally or use MongoDB Atlas
- Update MONGO_URI in backend/.env

### Issue: "CORS error"
**Solution:**
- Backend CORS is configured for localhost:3000
- Ensure frontend runs on port 3000

### Issue: "JWT_SECRET not defined"
**Solution:**
- Add JWT_SECRET to backend/.env file
- Restart the backend server

### Issue: "User already exists"
**Solution:**
- Use a different email address
- Or clear the database: `mongo villagevibe --eval "db.users.drop()"`

## Testing the Authentication

1. **Registration Test:**
   - Go to `/signup`
   - Fill in name, email, password
   - Check "Register as a Host" if needed
   - Submit and verify success

2. **Login Test:**
   - Go to `/signin`
   - Use the email and password from registration
   - Submit and verify redirect to home page

3. **User Menu Test:**
   - After login, check the user menu in header
   - Verify host dashboard appears for host users
   - Test logout functionality

## Debug Information

The authentication system now includes:
- Console logging for debugging
- Better error messages
- Form validation
- Loading states
- Proper user role handling

Check browser console and backend terminal for detailed logs. 