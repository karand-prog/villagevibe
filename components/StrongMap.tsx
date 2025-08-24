"use client"

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Alternative Map component
const AlternativeMap = dynamic(() => import('./AlternativeMap'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-earth-200 bg-earth-50 flex items-center justify-center">
      <div className="animate-pulse text-earth-500 text-sm">Loading map...</div>
    </div>
  ) 
})

export default function StrongMap({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)

  if (!isValid) {
    return (
      <div className="w-full h-64 rounded-xl overflow-hidden border border-earth-200 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <p className="text-sm text-red-700 font-medium">Invalid Coordinates</p>
          <p className="text-xs text-red-500 mt-1">Please check location data</p>
        </div>
      </div>
    )
  }

  return (
    <AlternativeMap 
      lat={lat} 
      lng={lng} 
      title={title}
    />
  )
} 