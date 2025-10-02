const Medicine = require('../models/Medicine')
const Prescription = require('../models/Prescription')

// Default medicines data
const defaultMedicines = [
  { disease: 'cough', medicines: 'Cough Syrup, Honey, Dextromethorphan', category: 'otc' },
  { disease: 'cold', medicines: 'Antihistamines, Decongestants, Vitamin C', category: 'otc' },
  { disease: 'fever', medicines: 'Paracetamol, Ibuprofen, Aspirin', category: 'otc' },
  { disease: 'headache', medicines: 'Aspirin, Acetaminophen, Ibuprofen', category: 'otc' },
  { disease: 'hypertension', medicines: 'Amlodipine, Lisinopril, Losartan', category: 'prescription' },
  { disease: 'stomach ache', medicines: 'Antacid, Omeprazole, Simethicone', category: 'otc' },
  { disease: 'sore throat', medicines: 'Throat Lozenges, Ibuprofen, Gargling Salt Water', category: 'otc' },
  { disease: 'nausea', medicines: 'Ondansetron, Ginger, Dramamine', category: 'otc' },
  { disease: 'dizziness', medicines: 'Meclizine, Betahistine, Rest and Hydration', category: 'otc' },
  { disease: 'muscle pain', medicines: 'Ibuprofen, Topical Analgesics, Heat Therapy', category: 'otc' }
]

// Initialize database with default medicines
const initializeMedicines = async () => {
  try {
    const count = await Medicine.countDocuments()
    if (count === 0) {
      await Medicine.insertMany(defaultMedicines)
      console.log('Default medicines initialized in MongoDB')
    }
  } catch (error) {
    console.error('Error initializing medicines:', error)
  }
}

// Initialize on module load
initializeMedicines()

// Search medicine by symptom
exports.searchMedicine = async (req, res) => {
  try {
    const { symptom } = req.query
    
    if (!symptom) {
      return res.status(400).json({ message: 'Symptom parameter is required' })
    }

    // Search in MongoDB
    const medicine = await Medicine.findOne({
      disease: { $regex: new RegExp(symptom.toLowerCase().trim(), 'i') },
      isActive: true
    })

    if (medicine) {
      // Save prescription history
      await Prescription.create({
        userId: req.user?.id || null,
        symptom: symptom.toLowerCase().trim(),
        medicines: medicine.medicines,
        ipAddress: req.ip
      })

      res.json({
        found: true,
        symptom: medicine.disease,
        medicines: medicine.medicines,
        description: medicine.description,
        category: medicine.category
      })
    } else {
      res.json({
        found: false,
        symptom: symptom.toLowerCase().trim(),
        message: 'No medicine recommendations found for this symptom'
      })
    }
  } catch (error) {
    console.error('Search medicine error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all medicines (admin only)
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isActive: true })
      .select('-__v')
      .sort({ disease: 1 })

    res.json({
      success: true,
      count: medicines.length,
      medicines
    })
  } catch (error) {
    console.error('Get medicines error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Add new medicine (admin only) - FIXED TO SAVE IN MONGODB
exports.addMedicine = async (req, res) => {
  try {
    const { disease, medicines, description, category } = req.body

    // Check if medicine already exists
    const existingMedicine = await Medicine.findOne({
      disease: { $regex: new RegExp(disease.toLowerCase().trim(), 'i') }
    })

    if (existingMedicine) {
      return res.status(409).json({
        message: 'Medicine for this disease already exists'
      })
    }

    // Create and save in MongoDB
    const newMedicine = new Medicine({
      disease: disease.toLowerCase().trim(),
      medicines: medicines.trim(),
      description: description?.trim() || '',
      category: category || 'general'
    })

    const savedMedicine = await newMedicine.save()
    console.log('Medicine saved to MongoDB:', savedMedicine)

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully to database',
      medicine: savedMedicine
    })
  } catch (error) {
    console.error('Add medicine error:', error)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Update medicine (admin only) - FIXED TO UPDATE IN MONGODB
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params
    const { disease, medicines, description, category } = req.body

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      {
        disease: disease?.toLowerCase().trim(),
        medicines: medicines?.trim(),
        description: description?.trim(),
        category: category || 'general',
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    )

    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' })
    }

    console.log('Medicine updated in MongoDB:', updatedMedicine)

    res.json({
      success: true,
      message: 'Medicine updated successfully in database',
      medicine: updatedMedicine
    })
  } catch (error) {
    console.error('Update medicine error:', error)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

// Delete medicine (admin only) - FIXED TO DELETE IN MONGODB
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params

    const deletedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    )

    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' })
    }

    console.log('Medicine deactivated in MongoDB:', deletedMedicine)

    res.json({
      success: true,
      message: 'Medicine deleted successfully from database'
    })
  } catch (error) {
    console.error('Delete medicine error:', error)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}
