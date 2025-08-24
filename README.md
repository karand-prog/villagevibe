# VillageVibe - Authentic Rural Tourism Platform

A modern web platform connecting rural hosts with travelers seeking authentic village experiences in India. Built with Next.js, React, Node.js, Express, and MongoDB.

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication for guests and hosts
- **Listing Management**: Create and manage village homestays and experiences
- **Booking System**: Complete booking flow with payment integration
- **Email Notifications**: Automated email confirmations for bookings
- **Responsive Design**: Mobile-first design with PWA support
- **Real-time Updates**: Live booking status and notifications
- **Payment Integration**: Razorpay payment gateway integration
- **Security**: Input validation, rate limiting, and security headers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Gmail account (for email notifications)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VillageVibe
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both root and backend directories:

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

   **Backend (.env)**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/villagevibe
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from root directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "isHost": false
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isHost": false
  },
  "token": "jwt_token"
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isHost": false
  },
  "token": "jwt_token"
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Listing Endpoints

#### GET `/api/listings`
Get all listings (public).

**Response:**
```json
[
  {
    "_id": "listing_id",
    "title": "Traditional Village Homestay",
    "description": "Experience authentic village life...",
    "location": {
      "state": "Rajasthan",
      "village": "Pushkar"
    },
    "price": 1500,
    "experienceType": "homestay",
    "host": {
      "_id": "host_id",
      "name": "Host Name",
      "email": "host@example.com"
    }
  }
]
```

#### POST `/api/listings`
Create a new listing (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Traditional Village Homestay",
  "description": "Experience authentic village life...",
  "location": {
    "state": "Rajasthan",
    "village": "Pushkar"
  },
  "price": 1500,
  "amenities": ["WiFi", "Traditional Food"],
  "experienceType": "homestay"
}
```

### Booking Endpoints

#### POST `/api/bookings`
Create a new booking (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "listing": "listing_id",
  "checkIn": "2024-01-15T00:00:00.000Z",
  "checkOut": "2024-01-17T00:00:00.000Z",
  "guestsCount": 2,
  "totalPrice": 3000
}
```

### Payment Endpoints

#### POST `/api/payment/create-order`
Create a Razorpay order (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "amount": 3000,
  "currency": "INR",
  "receipt": "booking_receipt_id"
}
```

#### POST `/api/payment/capture`
Capture payment and confirm booking (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "bookingId": "booking_id",
  "paymentId": "razorpay_payment_id",
  "amount": 3000
}
```

## 🛠️ Development

### Project Structure

```
VillageVibe/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── signin/            # Authentication pages
│   ├── signup/
│   ├── explore/           # Listing pages
│   ├── experiences/       # Experience pages
│   ├── bookings/          # Booking pages
│   ├── host/              # Host dashboard
│   └── about/             # About page
├── components/            # React components
│   ├── AuthContext.tsx    # Authentication context
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   └── ErrorBoundary.tsx  # Error handling
├── backend/               # Express.js backend
│   ├── app.js            # Main server file
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── test/             # Backend tests
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── icons/            # PWA icons
└── __tests__/            # Frontend tests
```

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
```

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm test             # Run tests
```

### Testing

The project includes both frontend and backend tests:

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest

Run tests:
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test
```

## 🔒 Security Features

- **Input Validation**: Express-validator for all API endpoints
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS for production
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security

## 📱 PWA Features

- **Offline Support**: Service worker for offline functionality
- **Installable**: Add to home screen capability
- **App-like Experience**: Full-screen mode and native feel
- **Push Notifications**: Real-time booking updates

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Connect your repository to Vercel or Netlify
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy

### Backend (Railway/Heroku)

1. Connect your repository to Railway or Heroku
2. Set environment variables:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secure JWT secret
   - `EMAIL_USER`: Gmail address
   - `EMAIL_PASS`: Gmail app password
   - `RAZORPAY_KEY_ID`: Razorpay key
   - `RAZORPAY_KEY_SECRET`: Razorpay secret
   - `FRONTEND_URL`: Your frontend URL
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@villagevibe.com or create an issue in the repository. 