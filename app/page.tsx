'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Star, Users, Heart } from 'lucide-react'
import { useTranslation } from '@/components/LanguageDetector'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import AIChatbot from '@/components/AIChatbot'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import OfflineStatus from '@/components/OfflineStatus'
import OfflineSyncManager from '@/components/OfflineSyncManager'
import VoiceCommandManager from '@/components/VoiceCommandManager'

export default function HomePage() {
  const { t } = useTranslation()
  const [typed, setTyped] = useState('')
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  const fullTitle = 'Building the future of rural tourism'

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setTyped(fullTitle.slice(0, i))
      i++
      if (i > fullTitle.length) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [])

  const communityStories = [
    {
      village: 'Kumartoli, West Bengal',
      impact: '₹2.5 Lakh generated for pottery artisans',
      story: 'Our pottery workshops have helped 15 local artisan families increase their monthly income by 40%.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      families: 15,
      growth: '40%'
    },
    {
      village: 'Khimsar, Rajasthan',
      impact: '₹4.2 Lakh tourism revenue generated',
      story: 'Traditional weaving classes have revived interest in local handicrafts among younger generations.',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
      families: 22,
      growth: '55%'
    },
    {
      village: 'Kumily, Kerala',
      impact: '₹3.8 Lakh spice trade boost',
      story: 'Culinary experiences showcase traditional spice farming, connecting travelers with local producers.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      families: 18,
      growth: '35%'
    }
  ]

  const futureVision = [
    {
      title: 'Empowering Villages',
      description: 'Connect authentic rural experiences across India',
      target: '1000+',
      current: '150',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Supporting Families',
      description: 'Generate sustainable income for rural communities',
      target: '10,000',
      current: '1,200',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cultural Preservation',
      description: 'Document and preserve traditional arts & crafts',
      target: '500',
      current: '85',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Sustainable Tourism',
      description: 'Promote responsible travel that benefits communities',
      target: '50,000',
      current: '8,500',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Tech Professional, Mumbai',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      quote: 'The authentic village experience I had in Rajasthan was life-changing. The local families were so welcoming and I learned so much about traditional crafts.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Travel Blogger, Delhi',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      quote: 'VillageVibe helped me discover hidden gems that I never knew existed. The cultural immersion was incredible and the local food was amazing!',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'International Tourist, UK',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      quote: 'As a foreign traveler, I was worried about language barriers, but the hosts were incredibly helpful and the experience was truly authentic.',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Local Host, Gujarat',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      quote: 'VillageVibe has transformed our village. We now have a steady income and our children are learning to value our traditional crafts.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Offline Status */}
      <OfflineStatus />

      {/* Offline Sync Manager */}
      <OfflineSyncManager />
      
      {/* Hero */}
      <section className="hero-modern">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="kicker mb-4">VillageVibe - Future Projects</div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              {typed}
            </h1>
            <p className="text-lg md:text-xl text-earth-600 mb-8 max-w-3xl mx-auto">
              We're building innovative tools to connect travelers with authentic rural experiences and create meaningful impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore" className="btn-primary ripple text-lg px-8 py-3">Explore Villages</Link>
              <Link href="/experiences" className="btn-ghost ripple text-lg px-8 py-3">Book Experiences</Link>
              <Link href="/host" className="btn-secondary ripple text-lg px-8 py-3">Become a Host</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Community Impact Stories */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Real <span className="text-gradient">Impact Stories</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              See how VillageVibe is transforming rural communities and creating meaningful connections
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {communityStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image src={story.image} alt={story.village} width={400} height={200} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-earth-800 mb-2">{story.village}</h3>
                  <div className="text-primary-600 font-semibold mb-3">{story.impact}</div>
                  <p className="text-earth-600 mb-4">{story.story}</p>
                  <div className="flex justify-between text-sm text-earth-500">
                    <span>{story.families} families benefited</span>
                    <span className="text-green-600 font-semibold">+{story.growth} income growth</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {/* Our Vision for the Future */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-earth-800 mb-4">Our Vision for 2025</h3>
            <p className="text-earth-600 max-w-2xl mx-auto">Together, we're building a platform that creates lasting positive impact</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {futureVision.map((vision, index) => (
              <div key={index} className={`text-center p-6 ${vision.bgColor} rounded-xl`}>
                <div className={`text-3xl font-bold ${vision.color} mb-2`}>{vision.target}</div>
                <div className="text-sm text-earth-600 mb-2">{vision.title}</div>
                <div className="text-xs text-earth-500 mb-3">{vision.description}</div>
                <div className="text-xs text-earth-400">Currently: {vision.current}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              What People <span className="text-gradient">Are Saying</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Hear from travelers and hosts who are part of the VillageVibe community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-earth-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    width={50} 
                    height={50} 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold text-earth-800">{testimonial.name}</h4>
                    <p className="text-sm text-earth-600">{testimonial.role}</p>
                </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-earth-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Community Feed */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-earth-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Join Our <span className="text-gradient">Growing Community</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Connect with travelers and hosts who share your passion for authentic experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-sm text-earth-600">Active Travelers</div>
              <div className="text-xs text-earth-500 mt-1">This month</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-sm text-earth-600">Village Hosts</div>
              <div className="text-xs text-earth-500 mt-1">Across 12 states</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
              <div className="text-sm text-earth-600">Average Rating</div>
              <div className="text-xs text-earth-500 mt-1">From 850+ reviews</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">₹12L+</div>
              <div className="text-sm text-earth-600">Community Earnings</div>
              <div className="text-xs text-earth-500 mt-1">Generated this year</div>
            </div>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Explore Villages</h3>
              <p className="text-earth-600 mb-4">Discover 150+ authentic villages with verified hosts and real-time availability.</p>
              <Link href="/explore" className="btn-primary">Start Exploring</Link>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-green-600" />
                </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Book Experiences</h3>
              <p className="text-earth-600 mb-4">Join 200+ cultural workshops led by master artisans and local experts.</p>
              <Link href="/experiences" className="btn-primary">View Experiences</Link>
                </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Become a Host</h3>
              <p className="text-earth-600 mb-4">Earn ₹15,000+ monthly by sharing your village culture with travelers.</p>
              <Link href="/host" className="btn-primary">Start Hosting</Link>
                </div>
                </div>
              </div>
      </section>

      {/* Live Streaming Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-gradient">Live Streaming</span> from Villages
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Experience real-time village life, cultural events, and artisan workshops through our live streaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-earth-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Live Cultural Events</h3>
              <p className="text-earth-600 mb-4">Watch traditional festivals, dance performances, and cultural celebrations as they happen.</p>
              <Link href="/live-streaming" className="btn-primary">Watch Live</Link>
            </div>

            <div className="bg-earth-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Artisan Workshops</h3>
              <p className="text-earth-600 mb-4">Learn traditional crafts like pottery, weaving, and metalwork through live interactive sessions.</p>
              <Link href="/live-streaming" className="btn-primary">Join Workshop</Link>
            </div>

            <div className="bg-earth-50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Cooking Classes</h3>
              <p className="text-earth-600 mb-4">Master authentic regional recipes with local chefs in real-time cooking demonstrations.</p>
              <Link href="/live-streaming" className="btn-primary">Learn Cooking</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="section-padding bg-gradient-to-br from-earth-50 to-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Join Our <span className="text-gradient">Social Community</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Connect with fellow travelers, share experiences, and discover hidden gems through our vibrant social platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-sm text-earth-600">Community Members</div>
              <div className="text-xs text-earth-500 mt-1">Active travelers</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">2,500+</div>
              <div className="text-sm text-earth-600">Experience Reviews</div>
              <div className="text-xs text-earth-500 mt-1">Shared stories</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">300+</div>
              <div className="text-sm text-earth-600">Hidden Gems</div>
              <div className="text-xs text-earth-500 mt-1">Discovered by community</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2">1,200+</div>
              <div className="text-sm text-earth-600">Travel Buddies</div>
              <div className="text-xs text-earth-500 mt-1">Found through platform</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Share Experiences</h3>
              <p className="text-earth-600 mb-4">Post photos, videos, and stories from your village adventures to inspire others.</p>
              <Link href="/social" className="btn-primary">Start Sharing</Link>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Discover Hidden Gems</h3>
              <p className="text-earth-600 mb-4">Find off-the-beaten-path villages and experiences recommended by our community.</p>
              <Link href="/social" className="btn-primary">Explore Now</Link>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Connect & Collaborate</h3>
              <p className="text-earth-600 mb-4">Find travel buddies, join group trips, and collaborate on community projects.</p>
              <Link href="/social" className="btn-primary">Connect Today</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
            Ready to Experience <span className="text-yellow-300">Authentic India</span>?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of travelers discovering the real India through authentic village experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Your Journey
            </Link>
            <Link href="/signup" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* AI Chatbot */}
      <AIChatbot />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}