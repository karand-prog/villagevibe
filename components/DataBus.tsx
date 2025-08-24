"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DataBusContextType {
  counters: {
    notifications: number
    messages: number
    bookings: number
  }
  notifications: Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    timestamp: Date
  }>
  addNotification: (notification: Omit<DataBusContextType['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const DataBusContext = createContext<DataBusContextType | undefined>(undefined)

export function DataBusProvider({ children }: { children: React.ReactNode }) {
  const [counters, setCounters] = useState({
    notifications: 0,
    messages: 0,
    bookings: 0
  })

  const [notifications, setNotifications] = useState<DataBusContextType['notifications']>([])

  const addNotification = (notification: Omit<DataBusContextType['notifications'][0], 'id' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setNotifications(prev => [...prev, newNotification])
    setCounters(prev => ({ ...prev, notifications: prev.notifications + 1 }))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    setCounters(prev => ({ ...prev, notifications: Math.max(0, prev.notifications - 1) }))
  }

  const clearNotifications = () => {
    setNotifications([])
    setCounters(prev => ({ ...prev, notifications: 0 }))
  }

  // Update counters when notifications change
  useEffect(() => {
    setCounters(prev => ({ ...prev, notifications: notifications.length }))
  }, [notifications])

  const value: DataBusContextType = {
    counters,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  }

  return (
    <DataBusContext.Provider value={value}>
      {children}
    </DataBusContext.Provider>
  )
}

export function useDataBus() {
  const context = useContext(DataBusContext)
  if (context === undefined) {
    // Return a default implementation instead of logging warning
    return {
      counters: { notifications: 0, messages: 0, bookings: 0 },
      notifications: [],
      addNotification: () => {},
      removeNotification: () => {},
      clearNotifications: () => {}
    }
  }
  return context
}


