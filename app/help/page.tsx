'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HelpCircle, Mail, MessageCircle, BookOpen } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="hero-modern">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-earth-600 mb-8 max-w-3xl mx-auto">
            Get help with your VillageVibe experience and find answers to common questions.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">FAQ</h3>
              <p className="text-earth-600 mb-4">Find answers to frequently asked questions about booking, hosting, and using VillageVibe.</p>
              <button className="btn-primary">View FAQ</button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Live Chat</h3>
              <p className="text-earth-600 mb-4">Chat with our support team for immediate assistance with your questions.</p>
              <button className="btn-primary">Start Chat</button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-800 mb-3">Email Support</h3>
              <p className="text-earth-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
              <button className="btn-primary">Send Email</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
