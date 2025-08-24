import React, { useState } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, Accessibility, MessageSquare } from 'lucide-react'
import { trackClick, trackSubmit } from '@/utils/analytics'

export default function Footer() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [email, setEmail] = useState('')
  const [subMsg, setSubMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setSubMsg('')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setSubMsg('Subscribed!')
      setEmail('')
      trackSubmit('footer_subscribe', { email })
    } catch (err: any) {
      setSubMsg(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <footer className="text-white bg-gradient-to-b from-earth-900 via-earth-900/95 to-black">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">VillageVibe</h3>
              <p className="text-earth-300 mb-4">
                Connecting travelers with authentic village experiences across India.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-earth-400 hover:text-white transition-colors" onClick={() => trackClick('footer_social_click', { network: 'facebook' })}>
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-earth-400 hover:text-white transition-colors" onClick={() => trackClick('footer_social_click', { network: 'twitter' })}>
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-earth-400 hover:text-white transition-colors" onClick={() => trackClick('footer_social_click', { network: 'instagram' })}>
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-earth-400 hover:text-white transition-colors" onClick={() => trackClick('footer_social_click', { network: 'youtube' })}>
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
              <form onSubmit={subscribe} className="mt-4 flex gap-2">
                <input className="input flex-1" placeholder="Subscribe email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="btn-primary" disabled={loading} onClick={() => trackClick('footer_subscribe_click')}>{loading ? '...' : 'Join'}</button>
              </form>
              {subMsg && <div className="text-sm mt-2 text-earth-300">{subMsg}</div>}
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/explore" className="text-earth-300 hover:text-white transition-colors">
                    Explore Villages
                  </Link>
                </li>
                <li>
                  <Link href="/experiences" className="text-earth-300 hover:text-white transition-colors">
                    Cultural Experiences
                  </Link>
                </li>
                <li>
                  <Link href="/host" className="text-earth-300 hover:text-white transition-colors">
                    Become a Host
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-earth-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-earth-300 hover:text-white transition-colors">
                    Blog & Stories
                  </Link>
                </li>
                <li>
                  <Link href="/blockchain" className="text-earth-300 hover:text-white transition-colors">
                    Transparency
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-earth-300 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-earth-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-earth-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-earth-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => { setShowFeedbackForm(true); trackClick('footer_feedback_click') }}
                    className="text-earth-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Give Feedback
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-earth-400" />
                  <span className="text-earth-300">hello@villagevibe.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-earth-400" />
                  <span className="text-earth-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-earth-400" />
                  <span className="text-earth-300">Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-earth-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <span className="text-earth-400">© 2024 VillageVibe. All rights reserved.</span>
                <div className="flex items-center gap-2 text-earth-400">
                  <Heart className="w-4 h-4" />
                  <span>Made with love in India</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="text-earth-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/accessibility.html" 
                  className="flex items-center gap-2 text-earth-400 hover:text-white transition-colors"
                >
                  <Accessibility className="w-4 h-4" />
                  Accessibility
                </Link>
                <Link 
                  href="/sitemap.xml" 
                  className="text-earth-400 hover:text-white transition-colors"
                >
                  Sitemap
                </Link>
                <Link 
                  href="/feedback.html" 
                  className="text-earth-400 hover:text-white text-sm transition-colors"
                >
                  Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-earth-800">Give Feedback</h3>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="text-earth-500 hover:text-earth-700"
              >
                ×
              </button>
            </div>
            <p className="text-earth-600 mb-4">
              Thank you for your feedback! This feature is coming soon.
            </p>
            <button
              onClick={() => setShowFeedbackForm(false)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
} 