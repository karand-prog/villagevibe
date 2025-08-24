"use client"

import React, { useState } from 'react'

interface AlternativeMapProps {
  lat: number
  lng: number
  title?: string
  zoom?: number
}

export default function AlternativeMap({ lat, lng, title, zoom = 13 }: AlternativeMapProps) {
  const [mapError, setMapError] = useState<string | null>(null)

  // Use a simple static map approach that will always work
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x400&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`

  const handleMapError = () => {
    setMapError('Map unavailable')
  }

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-xl overflow-hidden border border-earth-200 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-500 text-2xl">🗺️</span>
          </div>
          <p className="text-sm text-red-700 font-medium">{title || 'Location'}</p>
          <p className="text-xs text-red-500 mt-1">Map unavailable</p>
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors inline-block"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-earth-200 relative">
      <img
        src={staticMapUrl}
        alt={`Map of ${title || 'location'}`}
        className="w-full h-full object-cover"
        onError={handleMapError}
      />
      <div className="absolute bottom-2 right-2">
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white px-3 py-1 rounded-lg shadow-md text-sm text-earth-700 hover:bg-earth-50 transition-colors"
        >
          Open in Maps
        </a>
      </div>
    </div>
  )
}
