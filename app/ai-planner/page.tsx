'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AITravelPlanner from '@/components/AITravelPlanner'

const AIPlannerPage = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <div className="container-custom py-8">
        <AITravelPlanner />
      </div>
      <Footer />
    </div>
  )
}

export default AIPlannerPage 