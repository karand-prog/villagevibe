'use client'

import React, { useEffect } from 'react'
import { processOfflineQueue } from '@/utils/offlineQueue'

const OfflineSyncManager = () => {
  useEffect(() => {
    const handleOnline = () => {
      processOfflineQueue()
    }

    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return null
}

export default OfflineSyncManager

