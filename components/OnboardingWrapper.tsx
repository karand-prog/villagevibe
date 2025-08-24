'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import OfflineStatus from '@/components/OfflineStatus'
import { Toaster } from 'react-hot-toast'
import CookieConsentBanner from '@/components/CookieConsentBanner'

// Dynamically import heavy components
const OfflineSyncManager = dynamic(() => import('@/components/OfflineSyncManager'), { 
  ssr: false,
  loading: () => null 
})
const VoiceCommandManager = dynamic(() => import('@/components/VoiceCommandManager'), { 
  ssr: false,
  loading: () => null 
})


export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const [showHeavyComponents, setShowHeavyComponents] = useState(false)

  useEffect(() => {
    // Delay loading heavy components until after initial page load
    const timer = setTimeout(() => {
      setShowHeavyComponents(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <OfflineStatus />
      {showHeavyComponents && <OfflineSyncManager />}
      {showHeavyComponents && <VoiceCommandManager />}
      <Toaster position="top-center" />

      <CookieConsentBanner />
      {children}
    </>
  )
} 