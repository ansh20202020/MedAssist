import React, { useState } from 'react'
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import LoadingSpinner from '../common/LoadingSpinner'

const AdminLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const { showError, showSuccess } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!credentials.username || !credentials.password) {
      showError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(credentials)
      showSuccess('Login successful!')
      onLoginSuccess?.()
    } catch (error) {
      showError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Access the administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                className="input-field pl-10"
                disabled={loading}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                className="input-field pl-10 pr-10"
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
