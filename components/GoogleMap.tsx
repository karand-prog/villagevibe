"use client"

import React, { useEffect, useRef, useState } from 'react'

interface GoogleMapProps {
  lat: number
  lng: number
  title?: string
  zoom?: number
}

export default function GoogleMap({ lat, lng, title, zoom = 13 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoading, setMapLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current) return

    const loadGoogleMaps = async () => {
      try {
        setMapLoading(true)
        setMapError(null)

        // Load Google Maps API
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`
        script.async = true
        script.defer = true

        script.onload = () => {
          try {
            const map = new (window as any).google.maps.Map(mapRef.current, {
              center: { lat, lng },
              zoom,
              mapTypeId: 'roadmap',
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            })

            // Add marker
            new (window as any).google.maps.Marker({
              position: { lat, lng },
              map,
              title: title || 'Location',
              animation: (window as any).google.maps.Animation.DROP
            })

            setMapLoading(false)
          } catch (error) {
            console.error('Google Maps error:', error)
            setMapError('Failed to load Google Maps')
            setMapLoading(false)
          }
        }

        script.onerror = () => {
          setMapError('Failed to load Google Maps API')
          setMapLoading(false)
        }

        document.head.appendChild(script)

        return () => {
          document.head.removeChild(script)
        }
      } catch (error) {
        console.error('Script loading error:', error)
        setMapError('Failed to load map')
        setMapLoading(false)
      }
    }

    loadGoogleMaps()
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
