'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, MapPin, Star, Users, Calendar, Sparkles, Mic, MicOff, Phone, Mail, Globe, TrendingUp, Heart } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'card' | 'quick_reply'
  data?: any
}

interface QuickAction {
  id: string
  title: string
  icon: React.ComponentType<any>
  action: string
  color: string
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your VillageVibe AI assistant. I can help you discover authentic village experiences, plan trips, find cultural workshops, and connect you with local communities across India. What would you like to explore today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Find Villages',
      icon: MapPin,
      action: 'I want to find authentic village stays',
      color: 'bg-blue-500 text-white hover:bg-blue-600'
    },
    {
      id: '2',
      title: 'Cultural Workshops',
      icon: Star,
      action: 'Show me cultural workshops and activities',
      color: 'bg-green-500 text-white hover:bg-green-600'
    },
    {
      id: '3',
      title: 'Plan My Trip',
      icon: Calendar,
      action: 'Help me plan a complete village tourism trip',
      color: 'bg-purple-500 text-white hover:bg-purple-600'
    },
    {
      id: '4',
      title: 'Become a Host',
      icon: Users,
      action: 'I want to become a host and earn money',
      color: 'bg-orange-500 text-white hover:bg-orange-600'
    },
    {
      id: '5',
      title: 'Local Stories',
      icon: Heart,
      action: 'Tell me stories about local communities',
      color: 'bg-pink-500 text-white hover:bg-pink-600'
    },
    {
      id: '6',
      title: 'Contact Support',
      icon: Phone,
      action: 'I need help or have a question',
      color: 'bg-red-500 text-white hover:bg-red-600'
    }
  ]

  const villageData = [
    {
      id: '1',
      name: 'Kumartoli Pottery Village',
      location: 'West Bengal',
      price: '₹2,500/night',
      rating: '4.8★',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      description: 'Experience traditional pottery making with master artisans',
      activities: ['Pottery workshops', 'Village walks', 'Local cuisine'],
      impact: 'Supports 15 artisan families'
    },
    {
      id: '2',
      name: 'Khimsar Weaving Village',
      location: 'Rajasthan',
      price: '₹3,200/night',
      rating: '4.9★',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop',
      description: 'Learn traditional handloom weaving techniques',
      activities: ['Weaving classes', 'Desert safari', 'Folk music'],
      impact: 'Empowers 22 weaver families'
    },
    {
      id: '3',
      name: 'Kumily Spice Village',
      location: 'Kerala',
      price: '₹2,800/night',
      rating: '4.7★',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      description: 'Explore spice plantations and traditional farming',
      activities: ['Spice tours', 'Ayurveda sessions', 'Backwater cruises'],
      impact: 'Benefits 18 farming families'
    }
  ]

  const experienceData = [
    {
      id: '1',
      name: 'Traditional Pottery Making',
      duration: '3 hours',
      price: '₹1,200',
      location: 'Kumartoli, West Bengal',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      description: 'Learn the ancient art of clay pottery from master craftsmen',
      difficulty: 'Beginner friendly',
      maxParticipants: 8
    },
    {
      id: '2',
      name: 'Handloom Weaving Workshop',
      duration: '4 hours',
      price: '₹1,500',
      location: 'Khimsar, Rajasthan',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop',
      description: 'Create your own handwoven textile using traditional techniques',
      difficulty: 'Intermediate',
      maxParticipants: 6
    },
    {
      id: '3',
      name: 'Spice Farm Experience',
      duration: '2 hours',
      price: '₹800',
      location: 'Kumily, Kerala',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      description: 'Discover the world of spices with guided plantation tours',
      difficulty: 'All ages',
      maxParticipants: 12
    }
  ]

  const getIntelligentResponse = (userInput: string): { response: string, type: string, data?: any } => {
    const input = userInput.toLowerCase()
    
    // Extract specific details from user input
    const extractBudget = (text: string) => {
      const budgetMatch = text.match(/(\d+)[k\s]*rupees?|₹\s*(\d+)/i)
      return budgetMatch ? budgetMatch[1] || budgetMatch[2] : null
    }
    
    const extractDuration = (text: string) => {
      if (text.includes('weekend') || text.includes('2 days') || text.includes('3 days')) return 'short'
      if (text.includes('week') || text.includes('7 days')) return 'long'
      if (text.includes('month')) return 'extended'
      return null
    }
    
    const extractRegion = (text: string) => {
      const regions = {
        'north': ['rajasthan', 'himachal', 'uttarakhand', 'punjab', 'haryana'],
        'south': ['kerala', 'tamil nadu', 'karnataka', 'andhra', 'telangana'],
        'east': ['west bengal', 'odisha', 'assam', 'bihar', 'jharkhand'],
        'west': ['gujarat', 'maharashtra', 'goa'],
        'central': ['madhya pradesh', 'chhattisgarh', 'up', 'uttar pradesh']
      }
      
      for (const [region, states] of Object.entries(regions)) {
        if (states.some(state => text.includes(state))) return region
      }
      return null
    }
    
    const budget = extractBudget(input)
    const duration = extractDuration(input)
    const region = extractRegion(input)
    
    // Handle specific questions with intelligent responses
    if (input.includes('weather') || input.includes('season') || input.includes('best time')) {
      return {
        response: `The best time to visit Indian villages depends on the region:\n\n🌞 **Winter (Nov-Feb)**: Perfect for Rajasthan, Gujarat, South India\n🌧️ **Monsoon (Jun-Sep)**: Beautiful for Kerala, Western Ghats\n🌸 **Spring (Mar-May)**: Great for North India, hill stations\n🍂 **Autumn (Oct-Nov)**: Ideal for festivals and cultural experiences\n\nWhich region are you planning to visit?`,
        type: 'text'
      }
    }
    
    if (input.includes('safety') || input.includes('secure') || input.includes('safe')) {
      return {
        response: `Your safety is our top priority:\n\n✅ **Verified Hosts**: All hosts undergo background checks\n🏠 **Inspected Properties**: Regular safety audits\n📱 **24/7 Support**: Emergency contact available\n👥 **Community Network**: Local support in every village\n🔒 **Secure Payments**: Encrypted payment processing\n\nAll experiences are vetted and monitored for your safety.`,
        type: 'text'
      }
    }
    
    if (input.includes('food') || input.includes('cuisine') || input.includes('meal')) {
      return {
        response: `VillageVibe offers authentic local cuisine experiences:\n\n🍽️ **Traditional Meals**: Home-cooked local dishes\n🌾 **Farm-to-Table**: Fresh ingredients from village farms\n👩‍🍳 **Cooking Classes**: Learn traditional recipes\n🍯 **Local Specialties**: Regional delicacies and sweets\n\nMost village stays include 2-3 meals per day. Dietary preferences can be accommodated with advance notice.`,
        type: 'text'
      }
    }
    
    if (input.includes('transport') || input.includes('how to reach') || input.includes('travel')) {
      return {
        response: `Getting to village experiences:\n\n🚗 **By Road**: Most villages are 2-6 hours from major cities\n🚂 **By Train**: Nearest stations with pickup services\n✈️ **By Air**: Airport transfers available for remote locations\n🚌 **Local Transport**: Village-to-village connectivity\n\nWe provide detailed travel instructions and can arrange local transport.`,
        type: 'text'
      }
    }
    
    // Village-related queries
    if (input.includes('village') || input.includes('stay') || input.includes('homestay') || input.includes('accommodation')) {
      let response = `I found some amazing village stays for you!`
      if (budget) {
        response += ` Based on your budget of ₹${budget},000, here are the best options:`
      } else if (region) {
        response += ` Here are the top villages in ${region} India:`
      } else {
        response += ` Here are my top recommendations based on authentic experiences and community impact:`
      }
      
      return {
        response: response,
        type: 'card',
        data: {
          title: 'Recommended Village Stays',
          items: villageData,
          actionText: 'View Details',
          actionUrl: '/explore'
        }
      }
    }
    
    // Experience/workshop queries
    if (input.includes('workshop') || input.includes('experience') || input.includes('activity') || input.includes('cultural') || input.includes('learn')) {
      let response = `Here are some incredible cultural experiences you can book:`
      if (budget) {
        response += ` All within your budget of ₹${budget},000:`
      } else if (duration) {
        response += ` Perfect for your ${duration} trip:`
      }
      
      return {
        response: response,
        type: 'card',
        data: {
          title: 'Cultural Workshops & Experiences',
          items: experienceData,
          actionText: 'Book Now',
          actionUrl: '/experiences'
        }
      }
    }
    
    // Trip planning queries
    if (input.includes('plan') || input.includes('itinerary') || input.includes('trip') || input.includes('schedule')) {
      let response = `I'd love to help you plan the perfect village tourism trip!`
      if (budget && duration && region) {
        response += `\n\nBased on your preferences:\n💰 Budget: ₹${budget},000\n⏱️ Duration: ${duration}\n🗺️ Region: ${region} India\n\nHere's a personalized itinerary for you:`
        return {
          response: response,
          type: 'text',
          data: {
            quickReplies: [
              'Show me the itinerary',
              'Adjust my preferences',
              'Book this trip'
            ]
          }
        }
      } else {
        response += ` To create a personalized itinerary, I need to know:`
        return {
          response: response,
          type: 'suggestion',
          data: {
            suggestions: [
              'What\'s your budget range? (₹5,000-10,000, ₹10,000-20,000, ₹20,000+)',
              'How many days do you have? (Weekend, 3-5 days, 1 week+)',
              'What interests you most? (Culture, Nature, Food, Adventure)',
              'Which region appeals to you? (North, South, East, West, Central)'
            ],
            followUp: 'Once you provide these details, I can create a custom itinerary just for you!'
          }
        }
      }
    }
    
    // Hosting queries
    if (input.includes('host') || input.includes('earn') || input.includes('money') || input.includes('income')) {
      let response = `Great! Becoming a host is a wonderful way to share your village culture and earn income.`
      if (input.includes('earn') || input.includes('money') || input.includes('income')) {
        response += `\n\n💰 **Earnings Potential**:\n• New hosts: ₹8,000-15,000/month\n• Experienced hosts: ₹25,000-50,000/month\n• Top performers: ₹50,000-1,00,000/month\n\nYour earnings depend on location, experience quality, and marketing.`
      } else if (input.includes('process') || input.includes('start') || input.includes('how')) {
        response += `\n\n📋 **Getting Started**:\n1. Register on VillageVibe (5 minutes)\n2. Complete profile verification (1-2 days)\n3. List your experience (guided setup)\n4. Start receiving bookings!\n\nWe provide full training and support.`
      } else {
        response += `\n\nHere's what you need to know:`
      }
      
      return {
        response: response,
        type: 'text',
        data: {
          quickReplies: [
            'How much can I earn?',
            'What do I need to get started?',
            'Show me the hosting process'
          ]
        }
      }
    }
    
    // Pricing queries
    if (input.includes('price') || input.includes('cost') || input.includes('budget') || input.includes('expensive') || input.includes('cheap')) {
      let response = `VillageVibe offers experiences at various price points to suit different budgets:`
      if (budget) {
        if (parseInt(budget) < 5) {
          response += `\n\nFor your budget of ₹${budget},000, I recommend:\n• Day experiences: ₹300-800\n• Short workshops: ₹500-1,200\n• Budget homestays: ₹1,500-2,500/night`
        } else if (parseInt(budget) < 15) {
          response += `\n\nFor your budget of ₹${budget},000, you can enjoy:\n• Premium workshops: ₹1,000-2,000\n• Comfortable stays: ₹2,500-4,000/night\n• Multi-day packages: ₹8,000-12,000`
        } else {
          response += `\n\nWith your budget of ₹${budget},000, you can experience:\n• Luxury village stays: ₹4,000-6,000/night\n• Exclusive workshops: ₹2,000-3,000\n• Custom itineraries: ₹15,000-25,000`
        }
      } else {
        response += `\n\n💰 **Village Stays**: ₹2,000 - ₹5,000 per night\n🎨 **Cultural Workshops**: ₹500 - ₹2,000 per session\n🌾 **Farm Experiences**: ₹300 - ₹1,500 per activity`
      }
      
      return {
        response: response,
        type: 'text'
      }
    }
    
    // Location queries
    if (input.includes('where') || input.includes('location') || input.includes('place') || input.includes('region')) {
      let response = `VillageVibe connects you with authentic villages across India:`
      if (region) {
        const regionInfo = {
          'north': 'Rajasthan (desert culture), Himachal Pradesh (mountain villages), Uttarakhand (spiritual retreats)',
          'south': 'Kerala (backwaters), Tamil Nadu (temple towns), Karnataka (coffee estates)',
          'east': 'West Bengal (artisan villages), Odisha (tribal culture), Assam (tea gardens)',
          'west': 'Gujarat (craft villages), Maharashtra (wine regions), Goa (beach villages)',
          'central': 'Madhya Pradesh (tribal art), Chhattisgarh (eco-tourism), Uttar Pradesh (heritage villages)'
        }
        response += `\n\n🗺️ **${region.charAt(0).toUpperCase() + region.slice(1)} India**: ${regionInfo[region as keyof typeof regionInfo]}`
      } else {
        response += `\n\n🗺️ **North**: Rajasthan, Himachal Pradesh, Uttarakhand\n🗺️ **South**: Kerala, Tamil Nadu, Karnataka\n🗺️ **East**: West Bengal, Odisha, Assam\n🗺️ **West**: Gujarat, Maharashtra\n🗺️ **Central**: Madhya Pradesh, Chhattisgarh`
      }
      
      return {
        response: response,
        type: 'text'
      }
    }
    
    // Booking queries
    if (input.includes('book') || input.includes('reserve') || input.includes('availability') || input.includes('when')) {
      let response = `Booking with VillageVibe is simple and secure:`
      if (input.includes('when') || input.includes('availability')) {
        response += `\n\n📅 **Current Availability**:\n• Monsoon season (June-Sept): 60% availability\n• Festival season (Oct-Dec): 40% availability\n• Peak season (Jan-Mar): 30% availability\n• Shoulder season (Apr-May): 80% availability`
      } else if (input.includes('cancel') || input.includes('refund')) {
        response += `\n\n🔄 **Cancellation Policy**:\n• Free cancellation: Up to 48 hours before\n• 50% refund: 24-48 hours before\n• No refund: Less than 24 hours\n• Force majeure: Full refund`
      } else {
        response += `\n\n📅 **Availability**: Most experiences available year-round\n💳 **Payment**: Secure online payment with instant confirmation\n🔄 **Cancellation**: Free cancellation up to 48 hours before\n📱 **Support**: 24/7 customer support for any issues`
      }
      
      return {
        response: response,
        type: 'text'
      }
    }
    
    // Support queries
    if (input.includes('help') || input.includes('support') || input.includes('contact') || input.includes('problem')) {
      let response = `I'm here to help!`
      if (input.includes('booking') || input.includes('reservation')) {
        response += `\n\nFor booking issues:\n📞 Call: +91-1800-VILLAGE (ext. 1)\n📧 Email: bookings@villagevibe.com\n⏰ Response time: 2-4 hours`
      } else if (input.includes('payment') || input.includes('refund')) {
        response += `\n\nFor payment issues:\n📞 Call: +91-1800-VILLAGE (ext. 2)\n📧 Email: payments@villagevibe.com\n⏰ Response time: 1-2 hours`
      } else if (input.includes('technical') || input.includes('app') || input.includes('website')) {
        response += `\n\nFor technical support:\n📞 Call: +91-1800-VILLAGE (ext. 3)\n📧 Email: tech@villagevibe.com\n⏰ Response time: 30 minutes`
      } else {
        response += `\n\nHere are your support options:\n📞 **Live Chat**: Available 24/7 (click the chat icon)\n📧 **Email**: support@villagevibe.com\n📱 **Phone**: +91-1800-VILLAGE\n📖 **FAQ**: Check our help section`
      }
      
      return {
        response: response,
        type: 'text'
      }
    }
    
    // General information
    if (input.includes('what') || input.includes('how') || input.includes('tell me') || input.includes('explain')) {
      let response = `VillageVibe is India's premier platform for authentic rural tourism experiences.`
      if (input.includes('mission') || input.includes('purpose')) {
        response += `\n\n🌟 **Our Mission**: Empower rural communities through responsible tourism while preserving cultural heritage and creating sustainable income opportunities.`
      } else if (input.includes('impact') || input.includes('community')) {
        response += `\n\n🌱 **Community Impact**:\n• ₹12+ lakhs generated for local families\n• 150+ villages connected\n• 1,200+ families benefited\n• 4.8★ rating from 850+ travelers`
      } else if (input.includes('how') && input.includes('work')) {
        response += `\n\n🔄 **How It Works**:\n1. Travelers browse authentic village experiences\n2. Book directly with local hosts\n3. Enjoy immersive cultural experiences\n4. Hosts earn sustainable income\n5. Communities preserve traditions`
      } else {
        response += `\n\nWe connect travelers with local communities, preserving cultural heritage while creating sustainable income for rural families.\n\n🌟 **Our Mission**: Empower rural communities through responsible tourism\n🌱 **Impact**: ₹12+ lakhs generated for local families\n🏆 **Trust**: 4.8★ rating from 850+ travelers`
      }
      
      return {
        response: response,
        type: 'text'
      }
    }
    
    // Handle greetings and general questions
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon') || input.includes('good evening')) {
      return {
        response: `Hello! 👋 I'm your VillageVibe AI assistant. I can help you discover authentic village experiences across India. What would you like to explore today?`,
        type: 'text',
        data: {
          quickReplies: [
            'Find village stays',
            'Book cultural workshops',
            'Plan my trip',
            'Learn about hosting'
          ]
        }
      }
    }
    
    // Handle "what can you do" type questions
    if (input.includes('what can you do') || input.includes('help me') || input.includes('what do you do') || input.includes('capabilities')) {
      return {
        response: `I'm your VillageVibe AI assistant! Here's what I can help you with:\n\n🏠 **Find Village Stays**: Authentic homestays across India\n🎨 **Book Cultural Workshops**: Traditional crafts and activities\n🗺️ **Plan Trips**: Personalized itineraries\n💰 **Hosting Info**: How to become a host and earn\n📅 **Booking Support**: Availability and reservations\n🌍 **Travel Tips**: Weather, safety, transport info\n\nWhat interests you most?`,
        type: 'text',
        data: {
          quickReplies: [
            'Find village stays',
            'Book cultural workshops',
            'Plan my trip',
            'Learn about hosting'
          ]
        }
      }
    }
    
    // Default response for unknown queries
    return {
      response: `I understand you're asking about "${userInput}". Let me help you discover the perfect village experience! I can suggest homestays, cultural activities, and local experiences. What interests you most - finding a village stay, booking cultural workshops, or planning a complete trip?`,
      type: 'text',
      data: {
        quickReplies: [
          'Find village stays',
          'Book experiences',
          'Plan my trip',
          'Learn about hosting'
        ]
      }
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action.action,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages(prev => [...prev, userMessage])
    processResponse(action.action)
  }

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages(prev => [...prev, userMessage])
    processResponse(reply)
  }

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      setError('Voice input is not supported in your browser')
    }
  }

  const processResponse = async (userInput: string) => {
    setIsLoading(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const response = getIntelligentResponse(userInput)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type as any,
        data: response.data
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds for more natural feel
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    processResponse(inputText)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderMessage = (message: Message) => {
    if (message.type === 'card' && message.data) {
      return (
        <div className="bg-white rounded-lg border border-earth-200 p-4">
          <h4 className="font-semibold text-earth-800 mb-3">{message.data.title}</h4>
          <div className="space-y-3">
            {message.data.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-earth-50 rounded-lg">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-earth-800">{item.name}</div>
                  <div className="text-sm text-earth-600">{item.location}</div>
                  <div className="text-sm text-primary-600 font-medium">
                    {item.price || item.duration} {item.rating && `• ${item.rating}`}
                  </div>
                  {item.description && (
                    <div className="text-xs text-earth-500 mt-1">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {message.data.actionText && (
            <div className="mt-4 text-center">
              <button className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                {message.data.actionText}
              </button>
            </div>
          )}
        </div>
      )
    }

    if (message.type === 'suggestion' && message.data) {
      return (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Let me help you plan better:</h4>
          <div className="space-y-2">
            {message.data.suggestions.map((suggestion: string, index: number) => (
              <div key={index} className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                {suggestion}
              </div>
            ))}
          </div>
          {message.data.followUp && (
            <p className="text-sm text-blue-600 mt-3">{message.data.followUp}</p>
          )}
        </div>
      )
    }

    if (message.type === 'quick_reply' && message.data) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-earth-800">{message.text}</p>
          <div className="flex flex-wrap gap-2">
            {message.data.quickReplies.map((reply: string, index: number) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.sender === 'user'
            ? 'bg-primary-600 text-white'
            : 'bg-earth-100 text-earth-800'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {message.data?.quickReplies && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.data.quickReplies.map((reply: string, index: number) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-white/80 text-primary-700 px-3 py-1 rounded-lg hover:bg-white transition-colors font-medium border border-white/20"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary-300 group"
        aria-label="Open Advanced AI Chatbot"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center animate-fadeIn backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Advanced AI Chatbot Dialog"
          tabIndex={-1}
          onKeyDown={e => { if (e.key === 'Escape') setIsOpen(false) }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-earth-200 bg-gradient-to-r from-primary-50 to-earth-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-earth-800">VillageVibe AI Assistant</h3>
                  <p className="text-sm text-earth-600">Your travel companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-earth-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-white"
                aria-label="Close AI Chatbot"
                tabIndex={0}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="p-4 border-b border-earth-200">
                <p className="text-sm text-earth-600 mb-3">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action)}
                        className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 ${action.color}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{action.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
              {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center text-sm">{error}</div>}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {renderMessage(message)}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-earth-100 text-earth-800 max-w-xs lg:max-w-md px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-earth-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-earth-200 bg-earth-50">
              <div className="flex space-x-2">
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-white text-earth-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about village experiences..."
                  className="flex-1 px-4 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {isListening && (
                <p className="text-xs text-red-600 mt-2 text-center">Listening... Speak now!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}