'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Language context
export const LanguageContext = createContext<{
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
  availableLanguages: Array<{ code: string; label: string; flag: string }>
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: []
})

// Available languages
const availableLanguages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
]

// Simple translation object for demonstration
const translations: Record<string, Record<string, string>> = {
  en: {
    // Home page
    'home.title': 'VillageVibe',
    'home.subtitle': 'Discover authentic rural India. Book unique village stays, support local communities, and experience real culture—no middlemen, just meaningful journeys.',
    'home.explore': 'Explore Villages',
    'home.host': 'Become a Host',
    'home.featured': 'Featured Villages & Experiences',
    'home.viewMore': 'View More',
    
    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.experiences': 'Experiences',
    'nav.about': 'About',
    'nav.dashboard': 'Dashboard',
    'nav.bookings': 'My Bookings',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Common buttons
    'btn.bookNow': 'Book Now',
    'btn.viewDetails': 'View Details',
    'btn.submit': 'Submit',
    'btn.cancel': 'Cancel',
    'btn.next': 'Next',
    'btn.previous': 'Previous',
    'btn.save': 'Save',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.search': 'Search',
    'btn.filter': 'Filter',
    'btn.clear': 'Clear',
    
    // Form labels
    'form.name': 'Full Name',
    'form.email': 'Email Address',
    'form.phone': 'Phone Number',
    'form.village': 'Village Name',
    'form.state': 'State',
    'form.description': 'Description',
    'form.price': 'Price per Night',
    'form.capacity': 'Maximum Guests',
    'form.checkin': 'Check-in Date',
    'form.checkout': 'Check-out Date',
    'form.guests': 'Number of Guests',
    'form.required': 'Required',
    
    // Status messages
    'status.loading': 'Loading...',
    'status.success': 'Success!',
    'status.error': 'Error occurred',
    'status.noResults': 'No results found',
    'status.bookingConfirmed': 'Booking confirmed!',
    'status.paymentSuccess': 'Payment successful!',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.bookings': 'My Bookings',
    'dashboard.favorites': 'Favorites',
    'dashboard.profile': 'Profile',
    'dashboard.totalTrips': 'Total Trips',
    'dashboard.totalSpent': 'Total Spent',
    'dashboard.upcomingTrips': 'Upcoming Trips',
    
    // AI Planner
    'ai.title': 'AI Travel Planner',
    'ai.subtitle': 'Get personalized village tourism plans powered by artificial intelligence',
    'ai.planTrip': 'Plan My Trip',
    'ai.generating': 'AI is Planning Your Trip...',
    'ai.planning': 'Planning...',
    'ai.ready': 'Your Plan is Ready!',
    'ai.bookNow': 'Book This Plan',
    'ai.sharePlan': 'Share Plan',
    'ai.savePlan': 'Save Plan',
    'ai.createNew': 'Create New Plan',
    'ai.itinerary': 'Your Itinerary',
    'ai.culturalInsights': 'Cultural Insights',
    'ai.recommendations': 'AI Recommendations',
    'ai.realTimeData': 'Real-time Data',
    'ai.availability': 'Availability',
    'ai.demand': 'Demand Level',
    'ai.seasonalPricing': 'Seasonal Pricing',
    'ai.lastUpdated': 'Last Updated',
    
    // Host dashboard
    'host.dashboard.title': 'Host Dashboard',
    'host.dashboard.subtitle': 'Manage your listings and bookings',
    'host.addListing': 'Add New Listing',
    'host.listings': 'My Listings',
    'host.analytics': 'Analytics',
    'host.totalRevenue': 'Total Revenue',
    'host.totalBookings': 'Total Bookings',
    'host.activeListings': 'Active Listings',
    
    // Explore page
    'explore.title': 'Explore Authentic Village Experiences',
    'explore.subtitle': 'Discover real India through direct connections with rural communities. No middlemen, just authentic experiences.',
    'explore.searchPlaceholder': 'Search villages or experiences...',
    'explore.allStates': 'All States',
    'explore.allExperiences': 'All Experiences',
  },
  hi: {
    'home.title': 'विलेजवाइब',
    'home.subtitle': 'प्रामाणिक ग्रामीण भारत की खोज करें।',
    'home.explore': 'गांवों की खोज करें',
    'home.host': 'होस्ट बनें',
    'nav.home': 'होम',
    'nav.explore': 'खोजें',
    'nav.experiences': 'अनुभव',
    'nav.about': 'हमारे बारे में',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.bookings': 'मेरी बुकिंग',
    'nav.signin': 'साइन इन',
    'nav.signup': 'साइन अप',
    'nav.logout': 'लॉगआउट',
    'nav.profile': 'प्रोफाइल',
    'btn.bookNow': 'अभी बुक करें',
    'btn.viewDetails': 'विवरण देखें',
    'btn.submit': 'सबमिट करें',
    'btn.cancel': 'रद्द करें',
    'btn.next': 'अगला',
    'btn.previous': 'पिछला',
    'btn.save': 'सहेजें',
    'btn.edit': 'संपादित करें',
    'btn.delete': 'हटाएं',
    'btn.search': 'खोजें',
    'btn.filter': 'फ़िल्टर',
    'btn.clear': 'साफ़ करें',
    'form.name': 'पूरा नाम',
    'form.email': 'ईमेल पता',
    'form.phone': 'फ़ोन नंबर',
    'form.village': 'गांव का नाम',
    'form.state': 'राज्य',
    'form.description': 'विवरण',
    'form.price': 'प्रति रात कीमत',
    'form.capacity': 'अधिकतम मेहमान',
    'form.checkin': 'चेक-इन तिथि',
    'form.checkout': 'चेक-आउट तिथि',
    'form.guests': 'मेहमानों की संख्या',
    'form.required': 'आवश्यक',
    'status.loading': 'लोड हो रहा है...',
    'status.success': 'सफल!',
    'status.error': 'त्रुटि हुई',
    'status.noResults': 'कोई परिणाम नहीं मिला',
    'status.bookingConfirmed': 'बुकिंग की पुष्टि हुई!',
    'status.paymentSuccess': 'भुगतान सफल!',
    'dashboard.welcome': 'वापसी पर स्वागत है',
    'dashboard.overview': 'अवलोकन',
    'dashboard.bookings': 'मेरी बुकिंग',
    'dashboard.favorites': 'पसंदीदा',
    'dashboard.profile': 'प्रोफाइल',
    'dashboard.totalTrips': 'कुल यात्राएं',
    'dashboard.totalSpent': 'कुल खर्च',
    'dashboard.upcomingTrips': 'आगामी यात्राएं',
    'host.dashboard.title': 'होस्ट डैशबोर्ड',
    'host.dashboard.subtitle': 'अपनी लिस्टिंग और बुकिंग प्रबंधित करें',
    'host.addListing': 'नई लिस्टिंग जोड़ें',
    'host.listings': 'मेरी लिस्टिंग',
    'host.analytics': 'विश्लेषण',
    'host.totalRevenue': 'कुल राजस्व',
    'host.totalBookings': 'कुल बुकिंग',
    'host.activeListings': 'सक्रिय लिस्टिंग',
    'explore.title': 'प्रामाणिक ग्रामीण अनुभवों की खोज करें',
    'explore.subtitle': 'ग्रामीण समुदायों के साथ सीधे संबंधों के माध्यम से वास्तविक भारत की खोज करें। कोई बिचौलिया नहीं, सिर्फ प्रामाणिक अनुभव।',
    'explore.searchPlaceholder': 'गांवों या अनुभवों की खोज करें...',
    'explore.allStates': 'सभी राज्य',
    'explore.allExperiences': 'सभी अनुभव',
  }
}

// Language provider component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('en')

  const setLanguage = (lang: string) => {
    // Restrict to English for now; other languages are coming soon
    if (lang !== 'en') {
      return
    }
    setLanguageState('en')
    localStorage.setItem('language', 'en')
    document.documentElement.lang = 'en'
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    const normalized = savedLanguage === 'en' ? 'en' : 'en'
    setLanguageState(normalized)
    document.documentElement.lang = normalized
  }, [])

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }

  function t(key: string): string {
    return context.t(key)
  }

  return { t, language: context.language, setLanguage: context.setLanguage }
}

// Language detector component
const LanguageDetector = () => {
  const { language, setLanguage } = useTranslation()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const handleLanguageChange = (langCode: string) => {
    if (langCode !== 'en') {
      alert('Feature coming soon')
      setShowLanguageMenu(false)
      return
    }
    setLanguage('en')
    setShowLanguageMenu(false)
  }

  const getCurrentLanguageInfo = () => {
    return availableLanguages.find(lang => lang.code === language) || availableLanguages[0]
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
      >
        <span className="text-sm font-medium text-earth-700">
          {getCurrentLanguageInfo().label}
        </span>
        <span className="text-lg">{getCurrentLanguageInfo().flag}</span>
      </button>

      {showLanguageMenu && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-earth-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-earth-50 transition-colors ${
                language === lang.code ? 'bg-primary-50 text-primary-700' : 'text-earth-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageDetector 