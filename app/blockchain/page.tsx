'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'

const BlockchainDemo = dynamic(() => import('@/components/BlockchainDemo'), { ssr: false })

const BlockchainPage = () => {
  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <div className="container-custom py-8">
        <BlockchainDemo />
      </div>
      <Footer />
    </div>
  )
}

export default BlockchainPage 