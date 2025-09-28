import api from './api'
import { ENDPOINTS, ADMIN_CREDENTIALS } from '../utils/constants'

export const authService = {
  // Admin login
  adminLogin: async (credentials) => {
    try {
      // For demo purposes, using hardcoded admin credentials
      if (credentials.username === ADMIN_CREDENTIALS.USERNAME && 
          credentials.password === ADMIN_CREDENTIALS.PASSWORD) {
        
        const mockToken = btoa(JSON.stringify({
          username: credentials.username,
          role: 'admin',
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }))
        
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify({
          username: credentials.username,
          role: 'admin'
        }))
        
        return { 
          token: mockToken, 
          user: { username: credentials.username, role: 'admin' }
        }
      } else {
        throw { message: 'Invalid credentials' }
      }
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    try {
      const decoded = JSON.parse(atob(token))
      return decoded.exp > Date.now()
    } catch {
      return false
    }
  }
}
