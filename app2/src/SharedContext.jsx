import { createContext, useState, useContext } from 'react'

// Create the context
export const SharedContext = createContext()

// Custom hook for easy access
export const useSharedContext = () => {
  const context = useContext(SharedContext)
  if (!context) {
    throw new Error('useSharedContext must be used within SharedProvider')
  }
  return context
}

// Provider component
export function SharedProvider({ children }) {
  const [sharedData, setSharedData] = useState({
    userName: 'Guest',
    theme: 'light',
    notifications: [],
    counter: 0
  })

  const updateUserName = (name) => {
    setSharedData(prev => ({ ...prev, userName: name }))
  }

  const toggleTheme = () => {
    setSharedData(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }))
  }

  const addNotification = (message) => {
    setSharedData(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id: Date.now(), message }]
    }))
  }

  const incrementCounter = () => {
    setSharedData(prev => ({ ...prev, counter: prev.counter + 1 }))
  }

  const clearNotifications = () => {
    setSharedData(prev => ({ ...prev, notifications: [] }))
  }

  const value = {
    sharedData,
    setSharedData,
    updateUserName,
    toggleTheme,
    addNotification,
    incrementCounter,
    clearNotifications
  }

  return (
    <SharedContext.Provider value={value}>
      {children}
    </SharedContext.Provider>
  )
}

// Made with Bob
