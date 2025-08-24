// Offline Queue Management
// Handles actions that need to be performed when the user comes back online

export interface OfflineAction {
  id: string
  type: 'booking' | 'payment' | 'review' | 'contact'
  data: any
  timestamp: number
  retries: number
}

const MAX_RETRIES = 3
const QUEUE_KEY = 'villagevibe_offline_queue'

// Add an action to the offline queue
export const addToQueue = async (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>) => {
  if (typeof window === 'undefined') return

  const queue = getPendingActions()
  const newAction: OfflineAction = {
    ...action,
    id: generateId(),
    timestamp: Date.now(),
    retries: 0
  }
  
  queue.push(newAction)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  
  console.log('Action added to offline queue:', newAction)
}

// Get all pending actions from the queue
export const getPendingActions = (): OfflineAction[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading offline queue:', error)
    return []
  }
}

// Remove an action from the queue
export const removeFromQueue = (actionId: string) => {
  if (typeof window === 'undefined') return
  
  const queue = getPendingActions()
  const filteredQueue = queue.filter(action => action.id !== actionId)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(filteredQueue))
}

// Process the offline queue when back online
export const processOfflineQueue = async () => {
  if (typeof window === 'undefined') return
  
  const queue = getPendingActions()
  if (queue.length === 0) return
  
  console.log(`Processing ${queue.length} offline actions...`)
  
  for (const action of queue) {
    try {
      await processAction(action)
      removeFromQueue(action.id)
      console.log(`Successfully processed action: ${action.id}`)
    } catch (error) {
      console.error(`Failed to process action ${action.id}:`, error)
      
      // Increment retry count
      action.retries += 1
      if (action.retries >= MAX_RETRIES) {
        console.log(`Removing action ${action.id} after ${MAX_RETRIES} failed attempts`)
        removeFromQueue(action.id)
      } else {
        // Update the action with new retry count
        const queue = getPendingActions()
        const updatedQueue = queue.map(a => a.id === action.id ? action : a)
        localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue))
      }
    }
  }
}

// Process a single action
const processAction = async (action: OfflineAction) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  switch (action.type) {
    case 'booking':
      const bookingResponse = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data)
      })
      if (!bookingResponse.ok) throw new Error('Booking failed')
      break
      
    case 'payment':
      const paymentResponse = await fetch(`${baseUrl}/payments/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data)
      })
      if (!paymentResponse.ok) throw new Error('Payment failed')
      break
      
    case 'review':
      const reviewResponse = await fetch(`${baseUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data)
      })
      if (!reviewResponse.ok) throw new Error('Review failed')
      break
      
    case 'contact':
      const contactResponse = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data)
      })
      if (!contactResponse.ok) throw new Error('Contact form failed')
      break
      
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

// Generate a unique ID for actions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Clear the entire queue
export const clearOfflineQueue = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(QUEUE_KEY)
}

// Get queue statistics
export const getQueueStats = () => {
  const queue = getPendingActions()
  return {
    total: queue.length,
    byType: queue.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    oldestAction: queue.length > 0 ? Math.min(...queue.map(a => a.timestamp)) : null
  }
}

