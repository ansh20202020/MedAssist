// Format date to readable string
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Format medicine names for display
export const formatMedicines = (medicines) => {
  if (!medicines) return []
  return medicines.split(',').map(med => med.trim()).filter(med => med.length > 0)
}

// Check if user is admin
export const isAdmin = (user) => {
  return user && user.role === 'admin'
}

// Sanitize search input
export const sanitizeInput = (input) => {
  return input.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, '')
}

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format search history
export const formatSearchHistory = (searches) => {
  return searches.map(search => ({
    ...search,
    timeAgo: getTimeAgo(search.createdAt)
  }))
}

// Get relative time (e.g., "2 hours ago")
export const getTimeAgo = (date) => {
  const now = new Date()
  const searchDate = new Date(date)
  const diffMs = now - searchDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  }
}

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting from localStorage:', error)
      return null
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting to localStorage:', error)
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}
