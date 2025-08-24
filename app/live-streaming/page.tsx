'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'

const LiveStreaming = dynamic(() => import('@/components/LiveStreaming'), { ssr: false })

const LiveStreamingPage = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <div className="container-custom py-8">
        <LiveStreaming />
      </div>
      <Footer />
    </div>
  )
}

export default LiveStreamingPage 