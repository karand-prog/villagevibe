"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDataBus } from './DataBus'

interface SavedContextType {
  savedListings: Set<string>
  savedExperiences: Set<string>
  savedPlansDetails: any[]
  totalSaved: number
  loading: boolean
  toggleListing: (id: string) => void
  toggleExperience: (id: string) => void
  togglePlan: (id: string) => void
  isListingSaved: (id: string) => boolean
  isExperienceSaved: (id: string) => boolean
  isPlanSaved: (id: string) => boolean
  clearAll: () => void
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  const [savedExperiences, setSavedExperiences] = useState<Set<string>>(new Set())
  const [savedPlansDetails, setSavedPlansDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addNotification } = useDataBus()

  // Load saved items from localStorage on mount
  useEffect(() => {
    try {
      const savedListingsData = localStorage.getItem('savedListings')
      const savedExperiencesData = localStorage.getItem('savedExperiences')
      const savedPlansData = localStorage.getItem('savedPlans')

      if (savedListingsData) {
        setSavedListings(new Set(JSON.parse(savedListingsData)))
      }
      if (savedExperiencesData) {
        setSavedExperiences(new Set(JSON.parse(savedExperiencesData)))
      }
      if (savedPlansData) {
        setSavedPlansDetails(JSON.parse(savedPlansData))
      }
    } catch (error) {
      console.error('Error loading saved items:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('savedListings', JSON.stringify(Array.from(savedListings)))
      localStorage.setItem('savedExperiences', JSON.stringify(Array.from(savedExperiences)))
      localStorage.setItem('savedPlans', JSON.stringify(savedPlansDetails))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [savedListings, savedExperiences, savedPlansDetails])

  const toggleListing = (id: string) => {
    setSavedListings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        addNotification({
          type: 'info',
          message: 'Village removed from saved items'
        })
      } else {
        newSet.add(id)
        addNotification({
          type: 'success',
          message: 'Village saved to favorites'
        })
      }
      return newSet
    })
  }

  const toggleExperience = (id: string) => {
    setSavedExperiences(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        addNotification({
          type: 'info',
          message: 'Experience removed from saved items'
        })
      } else {
        newSet.add(id)
        addNotification({
          type: 'success',
          message: 'Experience saved to favorites'
        })
      }
      return newSet
    })
  }

  const togglePlan = (id: string) => {
    setSavedPlansDetails(prev => {
      const existingIndex = prev.findIndex(plan => plan.id === id)
      if (existingIndex >= 0) {
        const newPlans = prev.filter(plan => plan.id !== id)
        addNotification({
          type: 'info',
          message: 'Plan removed from saved items'
        })
        return newPlans
      } else {
        // Add a sample plan (in real app, this would be the actual plan data)
        const newPlan = {
          id,
          title: `AI Plan ${id}`,
          description: 'Sample AI-generated travel plan',
          duration: '5 days',
          totalCost: '₹15,000'
        }
        addNotification({
          type: 'success',
          message: 'Plan saved to favorites'
        })
        return [...prev, newPlan]
      }
    })
  }

  const isListingSaved = (id: string) => savedListings.has(id)
  const isExperienceSaved = (id: string) => savedExperiences.has(id)
  const isPlanSaved = (id: string) => savedPlansDetails.some(plan => plan.id === id)

  const clearAll = () => {
    setSavedListings(new Set())
    setSavedExperiences(new Set())
    setSavedPlansDetails([])
    addNotification({
      type: 'info',
      message: 'All saved items cleared'
    })
  }

  const totalSaved = savedListings.size + savedExperiences.size + savedPlansDetails.length

  const value: SavedContextType = {
    savedListings,
    savedExperiences,
    savedPlansDetails,
    totalSaved,
    loading,
    toggleListing,
    toggleExperience,
    togglePlan,
    isListingSaved,
    isExperienceSaved,
    isPlanSaved,
    clearAll
  }

  return (
    <SavedContext.Provider value={value}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const context = useContext(SavedContext)
  if (context === undefined) {
    console.warn('SavedContext not available, continuing without saved items')
    return {
      savedListings: new Set<string>(),
      savedExperiences: new Set<string>(),
      savedPlansDetails: [],
      totalSaved: 0,
      loading: false,
      toggleListing: () => {},
      toggleExperience: () => {},
      togglePlan: () => {},
      isListingSaved: () => false,
      isExperienceSaved: () => false,
      isPlanSaved: () => false,
      clearAll: () => {}
    }
  }
  return context
}


