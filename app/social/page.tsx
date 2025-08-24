'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Gamification from '@/components/Gamification'

const SocialPage = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <div className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Social <span className="text-gradient">Gamification</span>
          </h1>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Earn badges, compete on leaderboards, and connect with fellow travelers. 
            Make your village experiences more meaningful through social engagement.
          </p>
        </div>
        <Gamification />
      </div>
      <Footer />
    </div>
  )
}

export default SocialPage 