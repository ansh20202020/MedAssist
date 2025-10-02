import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Search, Navigation, Heart, Loader, AlertCircle, Star, MapIcon, Globe } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useNotification } from '../context/NotificationContext'

const Hospitals = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [searchRadius, setSearchRadius] = useState(5000) // 5km default
  const [searchMethod, setSearchMethod] = useState('location') // 'location' or 'city'
  const [cityQuery, setCityQuery] = useState('')
  const { showError, showSuccess, showInfo } = useNotification()

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true)
    
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser')
      setLocationLoading(false)
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        setUserLocation(location)
        setLocationLoading(false)
        showSuccess(`Location found with ${Math.round(location.accuracy)}m accuracy`)
        // Automatically search for hospitals after getting location
        searchNearbyHospitals(location)
      },
      (error) => {
        setLocationLoading(false)
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access or try searching by city.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred while getting location'
        }
        
        showError(errorMessage)
      },
      options
    )
  }

  // Search by city name using LocationIQ Geocoding
  const searchByCity = async () => {
    if (!cityQuery.trim()) {
      showError('Please enter a city name')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/location/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cityQuery })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
        setUserLocation(location)
        showSuccess(`Found coordinates for ${data[0].display_name}`)
        await searchNearbyHospitals(location)
      } else {
        showError('City not found. Please try a different search term.')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      showError('Failed to find city location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Search nearby hospitals using Overpass API
  const searchNearbyHospitals = async (location = userLocation) => {
    if (!location) {
      showError('Location not available. Please enable location services or search by city.')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/location/nearby-hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          radius: searchRadius
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.hospitals && data.hospitals.length > 0) {
        setHospitals(data.hospitals)
        showSuccess(`Found ${data.hospitals.length} hospitals within ${searchRadius/1000}km`)
      } else {
        setHospitals([])
        showInfo('No hospitals found in your area. Try increasing the search radius.')
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      showError('Failed to find nearby hospitals. Please try again.')
      setHospitals([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate distance between two coordinates
  const calculateDistance = (pos1, pos2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance in km
  }

  const handleCall = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self')
    } else {
      showError('Phone number not available for this hospital')
    }
  }

  const getDirections = (hospital) => {
    if (hospital.lat && hospital.lng) {
      const url = `https://www.openstreetmap.org/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${hospital.lat},${hospital.lng}&engine=fossgis_osrm_car`
      window.open(url, '_blank')
    } else if (hospital.address) {
      const encodedAddress = encodeURIComponent(hospital.address)
      window.open(`https://www.openstreetmap.org/search?query=${encodedAddress}`, '_blank')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-100 rounded-full mb-4">
          <Heart className="h-8 w-8 text-medical-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Nearby Hospitals</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover hospitals near your location or search by city using free OpenStreetMap data
        </p>
      </div>

      {/* Search Controls */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Hospital Locator</h2>
            <div className="flex items-center space-x-2 ml-auto">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Powered by OpenStreetMap</span>
            </div>
          </div>

          {/* Search Method Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              onClick={() => setSearchMethod('location')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                searchMethod === 'location'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Use My Location</span>
              </div>
            </button>
            <button
              onClick={() => setSearchMethod('city')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                searchMethod === 'city'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search by City</span>
              </div>
            </button>
          </div>

          {/* Location-based Search */}
          {searchMethod === 'location' && (
            <div className="space-y-4">
              {/* Current Location Display */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {userLocation 
                        ? `Location: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`
                        : 'Location not detected'
                      }
                    </span>
                  </div>
                  
                  <button
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
                  >
                    {locationLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    <span>{locationLoading ? 'Getting Location...' : 'Get My Location'}</span>
                  </button>
                </div>
              </div>

              {!userLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-800 font-medium">Location Permission Required</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        To find hospitals near you, please click "Get My Location" and allow location access when prompted, or try searching by city name.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* City-based Search */}
          {searchMethod === 'city' && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchByCity()}
                    className="input-field"
                  />
                </div>
                <button
                  onClick={searchByCity}
                  disabled={loading || !cityQuery.trim()}
                  className="btn-primary px-6 flex items-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span>Search</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Popular cities:</span>
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setCityQuery(city)}
                    className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Radius & Action */}
          {userLocation && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={1000}>1 km</option>
                  <option value={2000}>2 km</option>
                  <option value={5000}>5 km</option>
                  <option value={10000}>10 km</option>
                  <option value={15000}>15 km</option>
                  <option value={25000}>25 km</option>
                  <option value={50000}>50 km</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => searchNearbyHospitals()}
                  disabled={loading || !userLocation}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span>{loading ? 'Searching...' : 'Find Hospitals'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {hospitals.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Nearby Hospitals ({hospitals.length} found)
            </h2>
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span>Data from OpenStreetMap contributors</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hospitals.map((hospital, index) => (
              <div key={hospital.id || index} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-medical-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {hospital.name || 'Hospital'}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {hospital.distance ? `${hospital.distance.toFixed(1)} km away` : 'Distance unknown'}
                        </span>
                      </div>
                      
                      {hospital.type && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                          {hospital.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {hospital.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{hospital.address}</span>
                    </div>
                  )}
                  
                  {hospital.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{hospital.phone}</span>
                    </div>
                  )}

                  {hospital.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <a 
                        href={hospital.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {hospital.emergency_service && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Emergency Services Available</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCall(hospital.phone)}
                    disabled={!hospital.phone}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      hospital.phone 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    <span>{hospital.phone ? 'Call Hospital' : 'No Phone'}</span>
                  </button>
                  
                  <button
                    onClick={() => getDirections(hospital)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions</span>
                  </button>
                </div>

                {/* OSM Attribution */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Data ID: {hospital.osm_id}</span>
                    <span>Source: OpenStreetMap</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {hospitals.length === 0 && userLocation && !loading && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any hospitals in your search area. Try increasing the search radius or searching in a different location.
          </p>
          <button
            onClick={() => setSearchRadius(25000)}
            className="btn-secondary"
          >
            Search within 25km
          </button>
        </div>
      )}

      {/* Emergency Numbers */}
      <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Emergency Contact Numbers (India)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleCall('108')}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="font-semibold">Ambulance</div>
            <div className="text-2xl font-bold">108</div>
          </button>
          <button
            onClick={() => handleCall('102')}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="font-semibold">Medical Emergency</div>
            <div className="text-2xl font-bold">102</div>
          </button>
          <button
            onClick={() => handleCall('100')}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="font-semibold">Police</div>
            <div className="text-2xl font-bold">100</div>
          </button>
          <button
            onClick={() => handleCall('101')}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="font-semibold">Fire Brigade</div>
            <div className="text-2xl font-bold">101</div>
          </button>
        </div>
      </div>

      {/* Attribution Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Hospital data provided by{' '}
          <a 
            href="https://www.openstreetmap.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700"
          >
            OpenStreetMap
          </a>
          {' '}contributors under{' '}
          <a 
            href="https://www.openstreetmap.org/copyright" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700"
          >
            ODbL License
          </a>
        </p>
      </div>
    </div>
  )
}

export default Hospitals
