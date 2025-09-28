import React from 'react'
import { Search, Activity, Clock, TrendingUp } from 'lucide-react'
import SymptomChecker from '../components/user/SymptomChecker'

const Dashboard = () => {
  const recentSearches = [
    { symptom: 'headache', time: '2 hours ago' },
    { symptom: 'cough', time: '1 day ago' },
    { symptom: 'fever', time: '3 days ago' }
  ]

  const healthTips = [
    {
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily to maintain optimal health.',
      icon: '💧'
    },
    {
      title: 'Regular Exercise',
      description: 'Aim for 30 minutes of moderate exercise most days of the week.',
      icon: '🏃‍♂️'
    },
    {
      title: 'Balanced Diet',
      description: 'Include fruits, vegetables, and whole grains in your daily meals.',
      icon: '🥗'
    },
    {
      title: 'Adequate Sleep',
      description: 'Get 7-9 hours of quality sleep each night for better health.',
      icon: '😴'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Dashboard</h1>
        <p className="text-gray-600">Monitor your health and get personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Symptom Checker */}
        <div className="lg:col-span-2">
          <SymptomChecker />
          
          {/* Health Tips */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Health Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthTips.map((tip, index) => (
                <div key={index} className="card">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 text-primary-600 mr-2" />
              Health Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Searches Today</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Searches</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Health Score</span>
                <span className="font-semibold text-green-600">Good</span>
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-primary-600 mr-2" />
              Recent Searches
            </h3>
            <div className="space-y-3">
              {recentSearches.map((search, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {search.symptom}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{search.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Trends */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              Trending Symptoms
            </h3>
            <div className="space-y-2">
              {['Cold symptoms', 'Headache', 'Stomach issues', 'Fever'].map((trend, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {index + 1}. {trend}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
