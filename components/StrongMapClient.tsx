"use client"

import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

export default function StrongMapClient({ 
  lat, 
  lng, 
  title, 
  onError 
}: { 
  lat: number; 
  lng: number; 
  title?: string;
  onError?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    let map: any
    let L: any
    let cleanup = () => {}
    
    const load = async () => {
      try {
        setMapLoading(true)
        setMapError(null)
        
        // Dynamic import of Leaflet
        const leaflet = await import('leaflet')
        L = leaflet.default || leaflet

        // Fix marker icons issue with multiple fallback options
        try {
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          })
        } catch (iconError) {
          // Fallback to custom marker if CDN fails
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '📍',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          })
          L.Marker.prototype.options.icon = customIcon
        }

        if (!ref.current) return

        // Create map with fallback coordinates if needed
        const mapLat = isNaN(lat) ? 20.5937 : lat
        const mapLng = isNaN(lng) ? 78.9629 : lng
        
        map = L.map(ref.current).setView([mapLat, mapLng], 13)
        
        // Try multiple tile providers for better reliability
        const tileProviders = [
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png',
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ]

        let tileLayerAdded = false
        for (const tileUrl of tileProviders) {
          try {
            L.tileLayer(tileUrl, {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map)
            tileLayerAdded = true
            break
          } catch (tileError) {
            console.log(`Tile provider failed: ${tileUrl}`, tileError)
            continue
          }
        }

        if (!tileLayerAdded) {
          throw new Error('All tile providers failed')
        }

        // Add marker
        const marker = L.marker([mapLat, mapLng]).addTo(map)
        if (title) {
          marker.bindPopup(`<div class="p-2"><strong>${title}</strong></div>`)
        }

        // Add zoom controls
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map)

        // Add scale bar
        L.control.scale({
          position: 'bottomleft',
          metric: true,
          imperial: false
        }).addTo(map)

        cleanup = () => {
          try { 
            if (map && map.remove) {
              map.remove()
            }
          } catch (e) {
            console.log('Map cleanup error:', e)
          }
        }
        
        setMapLoading(false)
        setMapLoaded(true)
      } catch (e) {
        console.error('Map loading error:', e)
        setMapError('Failed to load map')
        setMapLoading(false)
        onError?.()
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!mapLoaded) {
        setMapError('Map loading timeout')
        setMapLoading(false)
        onError?.()
      }
    }, 10000) // 10 second timeout

    load()
    
    return () => {
      clearTimeout(timeoutId)
      cleanup()
    }
  }, [lat, lng, title, onError, mapLoaded])

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-xl overflow-hidden border border-earth-200 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <p className="text-sm text-red-700 font-medium">{title || 'Location'}</p>
          <p className="text-xs text-red-500 mt-1">Map unavailable</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
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
    <div ref={ref} className="w-full h-64 rounded-xl overflow-hidden border border-earth-200" />
  )
} 