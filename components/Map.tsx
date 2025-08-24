"use client"

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

const MapInner = dynamic(() => import('./MapInner'), { ssr: false })

export default function Map({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  // Validate coordinates before rendering
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return (
      <div className="w-full h-48 rounded-xl overflow-hidden border border-earth-200 bg-gradient-to-br from-earth-50 to-earth-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-6 h-6 text-earth-500" />
          </div>
          <p className="text-sm text-earth-700 font-medium">{title || 'Location'}</p>
          <p className="text-xs text-earth-500 mt-1">Invalid coordinates</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden border border-earth-200">
      <MapInner lat={lat} lng={lng} title={title} />
    </div>
  )
}


