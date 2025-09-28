import React, { useState, useEffect } from 'react'
import { Clock, Pill, Search, Calendar } from 'lucide-react'
import { formatDate, getTimeAgo } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const PrescriptionHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for demonstration
  const mockHistory = [
    {
      id: 1,
      symptom: 'headache',
      medicines: 'Aspirin, Acetaminophen, Ibuprofen',
      searchDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      symptom: 'cough',
      medicines: 'Cough Syrup, Honey, Dextromethorphan',
      searchDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      symptom: 'fever',
      medicines: 'Paracetamol, Ibuprofen, Aspirin',
      searchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      symptom: 'stomach ache',
      medicines: 'Antacid, Omeprazole, Simethicone',
      searchDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    try {
      // Simulate API call
      setTimeout(() => {
        setHistory(mockHistory)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading history:', error)
      setLoading(false)
    }
  }

  const filteredHistory = history.filter(item =>
    item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.medicines.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="card">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prescription History</h2>
          <p className="text-gray-600">Track your previous symptom searches</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Pill className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-gray-900 capitalize">
                      {item.symptom}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {getTimeAgo(item.createdAt)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-700">
                      <span className="font-medium">Recommended medicines:</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.medicines.split(',').map((medicine, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medical-100 text-medical-800"
                        >
                          {medicine.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(item.searchDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching history found' : 'No prescription history yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Start by searching for symptoms to build your history'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default PrescriptionHistory
