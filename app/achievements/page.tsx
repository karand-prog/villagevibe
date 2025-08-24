'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'

const Gamification = dynamic(() => import('@/components/Gamification'), { ssr: false })

const AchievementsPage = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <Gamification />
      <Footer />
    </div>
  )
}

export default AchievementsPage 