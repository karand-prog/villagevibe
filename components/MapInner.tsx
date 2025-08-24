"use client"

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

export default function MapInner({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!ref.current) return
    
    // Validate coordinates
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      setMapError(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setMapError(false)

    // Create map container with better fallback
    const mapContainer = document.createElement('div')
    mapContainer.className = 'w-full h-full bg-gradient-to-br from-earth-100 to-earth-200 flex items-center justify-center'
    
    // Try to load OpenStreetMap tile
    const img = new Image()
    const zoom = 13
    
    // Calculate tile coordinates
    const tileX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom))
    const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
    
    const url = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`
    
    img.onload = () => {
      setIsLoading(false)
      mapContainer.innerHTML = ''
      mapContainer.appendChild(img)
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'cover'
      img.style.borderRadius = '8px'
    }
    
    img.onerror = () => {
      setIsLoading(false)
      setMapError(true)
      // Show fallback with location info
      mapContainer.innerHTML = `
        <div class="text-center p-4">
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p class="text-sm text-earth-700 font-medium">${title || 'Location'}</p>
          <p class="text-xs text-earth-500 mt-1">Map unavailable</p>
        </div>
      `
    }
    
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setMapError(true)
        mapContainer.innerHTML = `
          <div class="text-center p-4">
            <div class="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-sm text-earth-700 font-medium">${title || 'Location'}</p>
            <p class="text-xs text-earth-500 mt-1">Loading timeout</p>
          </div>
        `
      }
    }, 5000)
    
    img.src = url
    
    // Clean up
    return () => {
      clearTimeout(timeout)
      if (ref.current) {
        ref.current.innerHTML = ''
      }
    }
  }, [lat, lng, title])

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-earth-50 to-earth-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-xs text-earth-500">Loading map...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (mapError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-earth-50 to-earth-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-6 h-6 text-earth-500" />
          </div>
          <p className="text-sm text-earth-700 font-medium">{title || 'Location'}</p>
          <p className="text-xs text-earth-500 mt-1">Map unavailable</p>
        </div>
      </div>
    )
  }

  return <div ref={ref} className="w-full h-full" />
}


