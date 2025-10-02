const express = require('express')
const axios = require('axios')
const router = express.Router()

// Geocode city to coordinates using LocationIQ
router.post('/geocode', async (req, res) => {
  try {
    const { query } = req.body
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' })
    }

    const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY
    
    if (!LOCATIONIQ_API_KEY) {
      return res.status(500).json({ error: 'LocationIQ API key not configured' })
    }

    const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
      params: {
        key: LOCATIONIQ_API_KEY,
        q: query,
        format: 'json',
        limit: 5,
        countrycodes: 'in', // Restrict to India
        addressdetails: 1
      },
      timeout: 10000
    })

    res.json(response.data)
    
  } catch (error) {
    console.error('LocationIQ geocoding error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'Failed to geocode location',
      details: error.response?.data?.error || error.message 
    })
  }
})

// Find nearby hospitals using Overpass API
router.post('/nearby-hospitals', async (req, res) => {
  try {
    const { lat, lng, radius } = req.body
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' })
    }

    const radiusInMeters = radius || 5000

    // Overpass API query to find hospitals
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radiusInMeters},${lat},${lng});
        way["amenity"="hospital"](around:${radiusInMeters},${lat},${lng});
        relation["amenity"="hospital"](around:${radiusInMeters},${lat},${lng});
        node["healthcare"="hospital"](around:${radiusInMeters},${lat},${lng});
        way["healthcare"="hospital"](around:${radiusInMeters},${lat},${lng});
      );
      out center meta;
    `

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      {
        headers: {
          'Content-Type': 'text/plain'
        },
        timeout: 30000
      }
    )

    const hospitals = processOverpassResponse(response.data, lat, lng)
    
    res.json({
      hospitals: hospitals,
      count: hospitals.length,
      center: { lat, lng },
      radius: radiusInMeters
    })

  } catch (error) {
    console.error('Overpass API error:', error.response?.data || error.message)
    
    // Fallback to demo data if Overpass fails
    const fallbackHospitals = getFallbackHospitals(req.body.lat, req.body.lng)
    
    res.json({
      hospitals: fallbackHospitals,
      count: fallbackHospitals.length,
      center: { lat: req.body.lat, lng: req.body.lng },
      radius: req.body.radius || 5000,
      fallback: true,
      error: 'Using demo data due to API error'
    })
  }
})

// Process Overpass API response
function processOverpassResponse(data, centerLat, centerLng) {
  if (!data || !data.elements) {
    return []
  }

  const hospitals = data.elements.map(element => {
    const tags = element.tags || {}
    
    // Get coordinates
    let lat, lng
    if (element.lat && element.lon) {
      lat = element.lat
      lng = element.lon
    } else if (element.center) {
      lat = element.center.lat
      lng = element.center.lon
    } else {
      return null
    }

    // Calculate distance
    const distance = calculateDistance(centerLat, centerLng, lat, lng)

    return {
      id: `${element.type}_${element.id}`,
      osm_id: element.id,
      osm_type: element.type,
      name: tags.name || tags['name:en'] || 'Unnamed Hospital',
      lat: lat,
      lng: lng,
      distance: distance,
      phone: tags.phone || tags['phone:emergency'] || null,
      website: tags.website || null,
      address: formatAddress(tags),
      emergency_service: tags.emergency === 'yes' || tags['healthcare:speciality']?.includes('emergency'),
      type: tags.amenity || tags.healthcare || 'hospital',
      beds: tags.beds ? parseInt(tags.beds) : null,
      operator: tags.operator || null,
      opening_hours: tags.opening_hours || null,
      wheelchair: tags.wheelchair || null
    }
  }).filter(hospital => hospital !== null)

  // Sort by distance
  return hospitals.sort((a, b) => a.distance - b.distance)
}

// Format address from OSM tags
function formatAddress(tags) {
  const parts = []
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber'])
  if (tags['addr:street']) parts.push(tags['addr:street'])
  if (tags['addr:city']) parts.push(tags['addr:city'])
  if (tags['addr:state']) parts.push(tags['addr:state'])
  if (tags['addr:postcode']) parts.push(tags['addr:postcode'])
  
  if (parts.length === 0) {
    // Fallback to any available address info
    if (tags.address) return tags.address
    if (tags['addr:full']) return tags['addr:full']
    return 'Address not available'
  }
  
  return parts.join(', ')
}

// Calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
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

// Fallback demo hospitals
function getFallbackHospitals(lat, lng) {
  return [
    {
      id: 'demo_1',
      name: 'General Hospital',
      lat: lat + 0.01,
      lng: lng + 0.01,
      distance: 1.2,
      phone: '+91-11-2500-0000',
      address: 'Near your location',
      type: 'hospital',
      emergency_service: true,
      osm_id: 'demo_1',
      osm_type: 'node'
    },
    {
      id: 'demo_2',
      name: 'Medical Center',
      lat: lat - 0.01,
      lng: lng - 0.01,
      distance: 1.8,
      phone: '+91-11-2600-0000',
      address: 'Medical District',
      type: 'hospital',
      emergency_service: false,
      osm_id: 'demo_2',
      osm_type: 'way'
    }
  ]
}

module.exports = router
