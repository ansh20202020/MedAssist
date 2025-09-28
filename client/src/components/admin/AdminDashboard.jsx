import React, { useState, useEffect } from 'react'
import { BarChart3, Users, Pill, Search, TrendingUp, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMedicines: 25,
    totalSearches: 1247,
    activeUsers: 156,
    todaySearches: 43
  })

  const [recentSearches, setRecentSearches] = useState([
    { id: 1, symptom: 'headache', timestamp: '2 minutes ago', ip: '192.168.1.1' },
    { id: 2, symptom: 'cough', timestamp: '5 minutes ago', ip: '192.168.1.2' },
    { id: 3, symptom: 'fever', timestamp: '8 minutes ago', ip: '192.168.1.3' },
    { id: 4, symptom: 'cold', timestamp: '12 minutes ago', ip: '192.168.1.4' },
    { id: 5, symptom: 'stomach ache', timestamp: '15 minutes ago', ip: '192.168.1.5' }
  ])

  const [topSymptoms, setTopSymptoms] = useState([
    { symptom: 'headache', count: 156, percentage: 25 },
    { symptom: 'cough', count: 134, percentage: 22 },
    { symptom: 'fever', count: 98, percentage: 16 },
    { symptom: 'cold', count: 87, percentage: 14 },
    { symptom: 'stomach ache', count: 72, percentage: 12 }
  ])

  const statCards = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines,
      icon: Pill,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Searches',
      value: stats.totalSearches.toLocaleString(),
      icon: Search,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: "Today's Searches",
      value: stats.todaySearches,
      icon: Activity,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="font-semibold text-gray-900">{new Date().toLocaleString()}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {recentSearches.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Search className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{search.symptom}</div>
                    <div className="text-sm text-gray-500">{search.ip}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{search.timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Symptoms */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Symptoms</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topSymptoms.map((symptom, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 capitalize">{symptom.symptom}</span>
                  <div className="text-sm text-gray-600">
                    {symptom.count} searches ({symptom.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${symptom.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
            <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Add New Medicine</div>
            <div className="text-sm text-gray-500">Add medicine to database</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
            <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="font-medium text-gray-900">View Analytics</div>
            <div className="text-sm text-gray-500">Detailed usage statistics</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Manage Users</div>
            <div className="text-sm text-gray-500">User management panel</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
