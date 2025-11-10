const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medassist';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected Successfully');
    
    // Initialize default medicines
    await initializeMedicines();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Server will continue without database. Medicines will not persist.');
  }
};

// Medicine Model
const medicineSchema = new mongoose.Schema({
  disease: { type: String, required: true, lowercase: true, trim: true },
  medicines: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, enum: ['general', 'prescription', 'otc'], default: 'general' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

medicineSchema.index({ disease: 1 });
const Medicine = mongoose.model('Medicine', medicineSchema);

// Initialize default medicines
const defaultMedicines = [
  { disease: 'cough', medicines: 'Cough Syrup, Honey, Dextromethorphan, Guaifenesin', category: 'otc' },
  { disease: 'cold', medicines: 'Antihistamines, Decongestants, Vitamin C, Phenylephrine', category: 'otc' },
  { disease: 'fever', medicines: 'Paracetamol, Ibuprofen, Aspirin, Acetaminophen', category: 'otc' },
  { disease: 'headache', medicines: 'Aspirin, Acetaminophen, Ibuprofen, Naproxen', category: 'otc' },
  { disease: 'stomach ache', medicines: 'Antacid, Omeprazole, Simethicone, Ranitidine', category: 'otc' },
  { disease: 'diarrhea', medicines: 'Loperamide, Oral Rehydration Salts, Probiotics', category: 'otc' },
  { disease: 'constipation', medicines: 'Laxatives, Fiber Supplements, Docusate', category: 'otc' },
  { disease: 'allergy', medicines: 'Cetirizine, Loratadine, Diphenhydramine, Fexofenadine', category: 'otc' },
  { disease: 'hypertension', medicines: 'Amlodipine, Lisinopril, Losartan, Metoprolol', category: 'prescription' },
  { disease: 'diabetes', medicines: 'Metformin, Insulin, Glimepiride, Sitagliptin', category: 'prescription' }
];

const initializeMedicines = async () => {
  try {
    const count = await Medicine.countDocuments();
    if (count === 0) {
      await Medicine.insertMany(defaultMedicines);
      console.log('✅ Default medicines initialized in MongoDB');
    }
  } catch (error) {
    console.error('Error initializing medicines:', error.message);
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ==================== MEDICINE ROUTES ====================

// Get all medicines (Admin)
app.get('/api/medicines/list', async (req, res) => {
  try {
    const medicines = await Medicine.find({ isActive: true })
      .select('-__v')
      .sort({ disease: 1 });
    
    res.json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// Search medicine by symptom
app.get('/api/medicines/search', async (req, res) => {
  try {
    const { symptom } = req.query;

    if (!symptom) {
      return res.status(400).json({ error: 'Symptom is required' });
    }

    const normalizedSymptom = symptom.toLowerCase().trim();
    
    // Search in MongoDB
    const medicine = await Medicine.findOne({
      disease: { $regex: new RegExp(normalizedSymptom, 'i') },
      isActive: true
    });

    if (medicine) {
      res.json({
        found: true,
        symptom: medicine.disease,
        medicines: medicine.medicines,
        description: medicine.description,
        category: medicine.category,
        disclaimer: 'Please consult a healthcare professional before taking any medication.'
      });
    } else {
      res.json({
        found: false,
        symptom: normalizedSymptom,
        message: 'Medicine information not found for this symptom. Please consult a healthcare professional.'
      });
    }
  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({ error: 'Failed to search medicines' });
  }
});

// Add new medicine (Admin)
app.post('/api/medicines/add', async (req, res) => {
  try {
    const { disease, medicines, description, category } = req.body;

    if (!disease || !medicines) {
      return res.status(400).json({ error: 'Disease and medicines are required' });
    }

    // Check if medicine already exists
    const existingMedicine = await Medicine.findOne({
      disease: { $regex: new RegExp(`^${disease.toLowerCase().trim()}$`, 'i') }
    });

    if (existingMedicine) {
      return res.status(409).json({ 
        error: 'Medicine for this disease already exists',
        existing: existingMedicine 
      });
    }

    // Create and save in MongoDB
    const newMedicine = new Medicine({
      disease: disease.toLowerCase().trim(),
      medicines: medicines.trim(),
      description: description?.trim(),
      category: category || 'general'
    });

    const savedMedicine = await newMedicine.save();
    
    console.log('✅ Medicine saved to MongoDB:', savedMedicine.disease);
    
    res.status(201).json({
      success: true,
      message: 'Medicine added successfully to database',
      medicine: savedMedicine
    });
  } catch (error) {
    console.error('Add medicine error:', error);
    res.status(500).json({ error: 'Failed to add medicine' });
  }
});

// Update medicine (Admin)
app.put('/api/medicines/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { disease, medicines, description, category } = req.body;

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      {
        disease: disease?.toLowerCase().trim(),
        medicines: medicines?.trim(),
        description: description?.trim(),
        category: category || 'general',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    console.log('✅ Medicine updated in MongoDB:', updatedMedicine.disease);

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      medicine: updatedMedicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({ error: 'Failed to update medicine' });
  }
});

// Delete medicine (Admin) - Soft delete
app.delete('/api/medicines/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!deletedMedicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    console.log('✅ Medicine deleted from MongoDB:', deletedMedicine.disease);

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});

// ==================== LOCATION ROUTES ====================

app.post('/api/location/geocode', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5
      },
      headers: {
        'User-Agent': 'MedAssistPro/1.0'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ error: 'Failed to geocode location' });
  }
});

app.post('/api/location/nearby-hospitals', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const overpassQuery = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const hospitals = response.data.elements
      .filter(element => element.tags && element.tags.name)
      .map(element => {
        const hospitalLat = element.lat || element.center?.lat;
        const hospitalLng = element.lon || element.center?.lon;
        const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);

        return {
          osm_id: element.id,
          name: element.tags.name,
          lat: hospitalLat,
          lng: hospitalLng,
          address: formatAddress(element.tags),
          phone: element.tags.phone || element.tags['contact:phone'],
          website: element.tags.website || element.tags['contact:website'],
          emergency_service: element.tags.emergency === 'yes',
          type: element.tags.amenity,
          distance: distance
        };
      })
      .sort((a, b) => a.distance - b.distance);

    res.json({ hospitals, count: hospitals.length });
  } catch (error) {
    console.error('Nearby hospitals error:', error.message);
    res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
  }
});

// ==================== AI CHATBOT ROUTE ====================

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return res.json({
        response: getFallbackResponse(message)
      });
    }

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...context,
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      response: openaiResponse.data.choices[0].message.content
    });
  } catch (error) {
    console.error('AI chat error:', error.message);
    res.json({
      response: getFallbackResponse(req.body.message)
    });
  }
});

// Helper functions
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatAddress(tags) {
  const parts = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:state']) parts.push(tags['addr:state']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return `🚨 **EMERGENCY DETECTED** 🚨\n\nIf this is a life-threatening emergency, please call:\n• Ambulance: 108\n• Medical Emergency: 102`;
  }
  
  if (lowerMessage.includes('hospital') || lowerMessage.includes('clinic')) {
    return `To find nearby hospitals, go to the Hospitals page and enable location access.`;
  }
  
  return `Hello! I'm MedBot. I can help you with:\n✅ Finding medicines for symptoms\n✅ Locating nearby hospitals\n✅ Emergency information\n\nHow can I assist you?`;
}

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
});
