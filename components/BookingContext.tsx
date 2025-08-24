"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDataBus } from './DataBus'

interface Booking {
  _id: string
  listing: {
    _id: string
    title: string
    images?: string[]
    location?: { village?: string; state?: string }
  }
  checkIn: string
  checkOut: string
  guestsCount: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

interface BookingContextType {
  bookings: Booking[]
  loading: boolean
  upcomingBookings: Booking[]
  completedBookings: Booking[]
  cancelBooking: (bookingId: string) => Promise<void>
  deleteBooking: (bookingId: string) => Promise<void>
  addBooking: (booking: Omit<Booking, '_id' | 'createdAt'>) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { addNotification } = useDataBus()

  // Load bookings from localStorage on mount
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem('userBookings')
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings))
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save to localStorage whenever bookings change
  useEffect(() => {
    try {
      localStorage.setItem('userBookings', JSON.stringify(bookings))
    } catch (error) {
      console.error('Error saving bookings:', error)
    }
  }, [bookings])

  // Calculate upcoming and completed bookings
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.checkIn) > new Date()
  )

  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed' || new Date(booking.checkOut) < new Date()
  )

  const cancelBooking = async (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    )
    addNotification({
      type: 'success',
      message: 'Booking cancelled successfully'
    })
  }

  const deleteBooking = async (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking._id !== bookingId))
    addNotification({
      type: 'success',
      message: 'Booking deleted successfully'
    })
  }

  const addBooking = (bookingData: Omit<Booking, '_id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setBookings(prev => [newBooking, ...prev])
    addNotification({
      type: 'success',
      message: 'Booking added successfully'
    })
  }

  const value: BookingContextType = {
    bookings,
    loading,
    upcomingBookings,
    completedBookings,
    cancelBooking,
    deleteBooking,
    addBooking
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    console.warn('BookingContext not available, continuing without bookings')
    return {
      bookings: [],
      loading: false,
      upcomingBookings: [],
      completedBookings: [],
      cancelBooking: async () => {},
      deleteBooking: async () => {},
      addBooking: () => {}
    }
  }
  return context
} 