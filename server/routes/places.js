const express = require('express')
const axios = require('axios')
const router = express.Router()

// Nearby hospitals search
router.post('/nearby-hospitals', async (req, res) => {
  try {
    const { lat, lng, radius } = req.body
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' })
    }

    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
    
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' })
    }

    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    const params = {
      location: `${lat},${lng}`,
      radius: radius || 5000,
      type: 'hospital',
      key: GOOGLE_PLACES_API_KEY,
      rankby: 'distance'
    }

    const response = await axios.get(url, { params })
    
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`)
    }

    res.json(response.data)
  } catch (error) {
    console.error('Places API error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch nearby hospitals',
      details: error.message 
    })
  }
})

// Hospital details
router.post('/hospital-details', async (req, res) => {
  try {
    const { placeId } = req.body
    
    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' })
    }

    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
    
    const url = 'https://maps.googleapis.com/maps/api/place/details/json'
    const params = {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,website,geometry',
      key: GOOGLE_PLACES_API_KEY
    }

    const response = await axios.get(url, { params })
    
    res.json(response.data)
  } catch (error) {
    console.error('Place details API error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch hospital details',
      details: error.message 
    })
  }
})

module.exports = router
