import React, { useState } from 'react';
import { Search, Pill, AlertCircle, CheckCircle } from 'lucide-react';
import { useMedicine } from '../../hooks/useMedicine';
import LoadingSpinner from '../common/LoadingSpinner';
import { COMMON_DISEASES } from '../../utils/constants';

const SymptomChecker = () => {
  const [symptom, setSymptom] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { searchResult, searchMedicine, loading } = useMedicine();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymptom(value);
    
    if (value.length > 1) {
      const filtered = COMMON_DISEASES.filter(disease =>
        disease.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) return;
    
    await searchMedicine(symptom.trim().toLowerCase());
    setSuggestions([]);
  };

  const selectSuggestion = (suggestion) => {
    setSymptom(suggestion);
    setSuggestions([]);
    searchMedicine(suggestion.toLowerCase());
  };

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
              placeholder="e.g., headache, fever, cough..."
              className="input-field pl-12 text-lg"
              disabled={loading}
              autoComplete="off"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors capitalize first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!symptom.trim() || loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Search Medicines</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {searchResult && (
          <div className={`mt-6 p-6 rounded-lg border-2 ${
            searchResult.found 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start space-x-3">
              {searchResult.found ? (
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 capitalize ${
                  searchResult.found ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  {searchResult.found 
                    ? `Medicines for ${searchResult.symptom}` 
                    : 'Information Not Found'}
                </h3>
                
                {searchResult.found ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {searchResult.medicines.split(',').map((medicine, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-green-800 border border-green-300"
                        >
                          <Pill className="h-4 w-4 mr-1" />
                          {medicine.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold mb-1">Important Disclaimer:</p>
                          <p>Please consult a healthcare professional before taking any medication. This is for informational purposes only.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-yellow-800">
                    {searchResult.message || 'Medicine information not available for this symptom.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
