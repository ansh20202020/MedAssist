import api from './api'
import { ENDPOINTS, ADMIN_CREDENTIALS } from '../utils/constants'

export const authService = {
  // User/Admin login
  login: async (credentials) => {
    try {
      // Check for admin credentials first
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
      }
      
      // Regular user login via API
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
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
