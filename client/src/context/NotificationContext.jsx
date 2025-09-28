import React, { createContext, useContext } from 'react'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message, {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#10B981',
        color: '#fff',
      }
    })
  }

  const showError = (message) => {
    toast.error(message, {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#EF4444',
        color: '#fff',
      }
    })
  }

  const showInfo = (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        borderRadius: '10px',
        background: '#3B82F6',
        color: '#fff',
      }
    })
  }

  const value = {
    showSuccess,
    showError,
    showInfo
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
