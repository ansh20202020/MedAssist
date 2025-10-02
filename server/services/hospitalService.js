const axios = require('axios')

class HospitalService {
  constructor() {
    this.locationiqKey = process.env.LOCATIONIQ_API_KEY
  }

  // Alternative method using LocationIQ Nearby POI API (if available)
  async searchNearbyHospitalsLIQ(lat, lng, radius = 5000) {
    if (!this.locationiqKey) {
      throw new Error('LocationIQ API key not configured')
    }

    try {
      const response = await axios.get('https://api.locationiq.com/v1/nearby', {
        params: {
          key: this.locationiqKey,
          lat: lat,
          lon: lng,
          radius: radius,
          tag: 'amenity:hospital',
          format: 'json',
          limit: 50
        },
        timeout: 15000
      })

      return response.data.map(place => ({
        id: place.osm_id,
        name: place.display_name.split(',')[0],
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        address: place.display_name,
        distance: this.calculateDistance(lat, lng, parseFloat(place.lat), parseFloat(place.lon)),
        type: place.type,
        osm_id: place.osm_id,
        osm_type: place.osm_type
      }))
    } catch (error) {
      console.error('LocationIQ Nearby API error:', error)
      throw error
    }
  }

  // Search using Nominatim (OpenStreetMap's official search)
  async searchHospitalsNominatim(lat, lng, radius = 5000) {
    try {
      const query = `hospital near ${lat},${lng}`
      
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 30,
          addressdetails: 1,
          extratags: 1,
          namedetails: 1,
          bounded: 1,
          viewbox: `${lng-0.1},${lat-0.1},${lng+0.1},${lat+0.1}`
        },
        headers: {
          'User-Agent': 'MedAssist-Pro/1.0 (contact@medassist.com)'
        },
        timeout: 15000
      })

      return response.data
        .filter(place => {
          const distance = this.calculateDistance(lat, lng, parseFloat(place.lat), parseFloat(place.lon))
          return distance <= (radius / 1000) // Convert to km
        })
        .map(place => ({
          id: place.osm_id,
          name: place.name || place.display_name.split(',')[0],
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          address: place.display_name,
          distance: this.calculateDistance(lat, lng, parseFloat(place.lat), parseFloat(place.lon)),
          type: place.type,
          osm_id: place.osm_id,
          osm_type: place.osm_type,
          phone: place.extratags?.phone,
          website: place.extratags?.website
        }))
        .sort((a, b) => a.distance - b.distance)
    } catch (error) {
      console.error('Nominatim API error:', error)
      throw error
    }
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
}

module.exports = new HospitalService()
