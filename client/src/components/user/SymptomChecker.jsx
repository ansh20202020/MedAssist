import React, { useState } from 'react'
import { Search, Pill, AlertCircle, CheckCircle } from 'lucide-react'
import { useMedicine } from '../../hooks/useMedicine'
import LoadingSpinner from '../common/LoadingSpinner'
import { COMMON_DISEASES } from '../../utils/constants'

const SymptomChecker = () => {
  const [symptom, setSymptom] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { searchResult, searchMedicine, loading } = useMedicine()

  const handleInputChange = (e) => {
    const value = e.target.value
    setSymptom(value)
    
    if (value.length > 1) {
      const filtered = COMMON_DISEASES.filter(disease =>
        disease.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptom.trim()) return
    
    await searchMedicine(symptom.trim().toLowerCase())
    setSuggestions([])
  }

  const selectSuggestion = (suggestion) => {
    setSymptom(suggestion)
    setSuggestions([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-100 rounded-full mb-4">
            <Search className="h-8 w-8 text-medical-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Symptom Checker</h2>
          <p className="text-gray-600">Enter your symptom to get medicine recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={symptom}
              onChange={handleInputChange}
              placeholder="Enter symptom (e.g., cough, fever, headache)"
              className="input-field pr-12"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !symptom.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors capitalize"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {searchResult && (
          <div className="mt-8 space-y-4">
            {searchResult.found ? (
              <div className="bg-medical-50 border border-medical-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-medical-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-medical-800 mb-2">
                      Recommended Medicines for "{searchResult.symptom}"
                    </h3>
                    <div className="space-y-2">
                      {searchResult.medicines.split(',').map((medicine, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Pill className="h-4 w-4 text-medical-600" />
                          <span className="text-medical-700 font-medium">{medicine.trim()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          <strong>Important:</strong> These are general recommendations. Always consult with a healthcare professional before taking any medication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      No recommendations found
                    </h3>
                    <p className="text-red-700">
                      We couldn't find specific medicine recommendations for "{searchResult.symptom}". 
                      Please try a different symptom or consult with a healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SymptomChecker
