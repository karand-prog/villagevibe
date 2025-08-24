"use client"

import React, { useEffect, useRef, useState } from 'react'

interface WorkingMapProps {
  lat: number
  lng: number
  title?: string
  zoom?: number
}

export default function WorkingMap({ lat, lng, title, zoom = 13 }: WorkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoading, setMapLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current) return

    const loadMap = async () => {
      try {
        setMapLoading(true)
        setMapError(null)

        // Create iframe with OpenStreetMap - this will always work
        const iframe = document.createElement('iframe')
        iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.frameBorder = '0'
        iframe.scrolling = 'no'
        iframe.marginHeight = '0'
        iframe.marginWidth = '0'
        iframe.style.border = 'none'
        iframe.style.borderRadius = '12px'

        // Clear the container and add iframe
        if (mapRef.current) {
          mapRef.current.innerHTML = ''
          mapRef.current.appendChild(iframe)
        }

        setMapLoading(false)
      } catch (error) {
        console.error('Map loading error:', error)
        setMapError('Failed to load map')
        setMapLoading(false)
      }
    }

    loadMap()
  }, [lat, lng, title, zoom])

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
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=${zoom}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors inline-block"
          >
            Open in Maps
          </a>
        </div>
      </div>
    )
  }

  if (mapLoading) {
    return (
      <div className="w-full h-64 rounded-xl overflow-hidden border border-earth-200 bg-earth-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-earth-200 rounded-full mx-auto mb-2"></div>
          <p className="text-earth-500 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={mapRef} className="w-full h-64 rounded-xl overflow-hidden border border-earth-200" />
  )
}
