'use client'
import { useEffect, useState } from 'react'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('cookieConsent')) {
      setVisible(true)
    }
  }, [])
  if (!visible) return null
  return (
    <div className="fixed bottom-0 left-0 w-full bg-earth-900 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between">
      <span className="mb-2 md:mb-0">
        We use cookies to enhance your experience and for analytics. By using VillageVibe, you accept our{' '}
        <a href="/cookies" className="underline">Cookie Policy</a>.
      </span>
      <button
        className="ml-4 px-4 py-2 bg-primary-600 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
        onClick={() => { localStorage.setItem('cookieConsent', 'true'); setVisible(false) }}
        aria-label="Accept cookies"
      >
        Accept
      </button>
    </div>
  )
} 