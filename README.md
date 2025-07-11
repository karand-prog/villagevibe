# VillageVibe - Authentic Rural Tourism Platform

VillageVibe is a web-based platform that connects rural hosts with travelers seeking authentic experiences in India. Our mission is to empower local communities while preserving cultural heritage and providing travelers with genuine village experiences.

## 🌟 Key Features

### For Travelers
- **Direct Booking**: Connect directly with village hosts, no middlemen
- **Authentic Experiences**: Real village life, traditional food, cultural activities
- **Transparent Pricing**: See exactly where your money goes
- **Impact Tracking**: Get certificates showing your positive impact
- **Offline Support**: Works even in areas with poor internet (PWA)

### For Hosts
- **85% Revenue Share**: Highest in the industry
- **Voice-Based Uploads**: Record descriptions by speaking
- **Simple Dashboard**: Easy-to-use interface for managing listings
- **Fair Compensation**: Transparent revenue distribution
- **Cultural Preservation**: Share and preserve local stories

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **PWA**: Progressive Web App for offline functionality
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form for form management
- **Notifications**: React Hot Toast for user feedback

## 🎨 Design System

Our design system uses a carefully crafted color palette:

- **Primary**: Green tones (#22c55e) representing growth and sustainability
- **Earth**: Brown/beige tones representing rural landscapes
- **Sunset**: Orange tones representing warmth and hospitality

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Can be installed as a native app
- **Push Notifications**: Real-time updates
- **Background Sync**: Syncs data when connection returns

## 🏗️ Project Structure

```
VillageVibe/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── explore/           # Village exploration
│   └── host/              # Host registration
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Landing hero section
│   ├── Features.tsx       # Platform features
│   ├── HowItWorks.tsx     # Process explanation
│   ├── Testimonials.tsx   # User reviews
│   └── Footer.tsx         # Site footer
├── public/                # Static assets
│   └── manifest.json      # PWA manifest
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/villagevibe.git
   cd villagevibe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌍 Key Pages

### Home Page (`/`)
- Hero section with search functionality
- Platform features showcase
- How it works explanation
- User testimonials
- Impact statistics

### Explore Page (`/explore`)
- Village and experience search
- Advanced filtering options
- Grid layout of available experiences
- Detailed village cards

### Host Registration (`/host`)
- Multi-step registration form
- Voice recording capability
- Revenue sharing explanation
- Host benefits showcase

## 🎯 Core Functionality

### Search & Discovery
- Location-based search
- Experience type filtering
- Price range selection
- Rating and review filtering

### Booking System
- Direct booking with hosts
- Transparent pricing breakdown
- Secure payment processing
- Booking confirmation

### Host Management
- Simple listing creation
- Voice-based content upload
- Revenue tracking
- Guest communication

### Impact Tracking
- CO₂ savings calculation
- Local community benefits
- Artisan support metrics
- Cultural preservation impact

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
```

### PWA Configuration
The PWA is configured in `next.config.js` and `public/manifest.json`:
- Offline functionality
- App installation
- Push notifications
- Background sync

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database
- **DigitalOcean**: App Platform support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test thoroughly before submitting

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Rural communities across India
- Open source contributors
- Design inspiration from authentic village life
- Support from the travel and tourism community

## 📞 Contact

- **Email**: hello@villagevibe.in
- **Phone**: +91 98765 43210
- **Location**: Mumbai, Maharashtra, India

# Node modules
node_modules/

# Next.js build output
.next/

# OS files
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Env files
.env*
---

**VillageVibe** - Connecting rural communities with the world, one authentic experience at a time. 🌾✨ 