import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Shield, Users, Pill, BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: Home, public: true },
    { name: 'Dashboard', href: '/dashboard', icon: Search, public: true },
    { name: 'Admin', href: '/admin', icon: Shield, adminOnly: true }
  ]

  const adminNavigation = [
    { name: 'Overview', href: '/admin', icon: BarChart3 },
    { name: 'Medicine Management', href: '/admin/medicines', icon: Pill },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ]

  const handleLogout = () => {
    logout()
    onClose()
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-medical-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MedAssist</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                if (item.adminOnly && !isAuthenticated) return null
                if (item.adminOnly && user?.role !== 'admin') return null

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Admin Navigation */}
            {isAuthenticated && user?.role === 'admin' && (
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Panel
                </h3>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive(item.href)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          {isAuthenticated && (
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
