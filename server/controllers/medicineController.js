const Medicine = require('../models/Medicine')
const Prescription = require('../models/Prescription')

// Default medicines data
const defaultMedicines = [
  { disease: 'cough', medicines: 'Cough Syrup, Honey, Dextromethorphan' },
  { disease: 'cold', medicines: 'Antihistamines, Decongestants, Vitamin C' },
  { disease: 'fever', medicines: 'Paracetamol, Ibuprofen, Aspirin' },
  { disease: 'headache', medicines: 'Aspirin, Acetaminophen, Ibuprofen' },
  { disease: 'hypertension', medicines: 'Amlodipine, Lisinopril, Losartan' },
  { disease: 'stomach ache', medicines: 'Antacid, Omeprazole, Simethicone' },
  { disease: 'sore throat', medicines: 'Throat Lozenges, Ibuprofen, Gargling Salt Water' },
  { disease: 'nausea', medicines: 'Ondansetron, Ginger, Dramamine' },
  { disease: 'dizziness', medicines: 'Meclizine, Betahistine, Rest and Hydration' },
  { disease: 'muscle pain', medicines: 'Ibuprofen, Topical Analgesics, Heat Therapy' }
]

// Initialize database with default medicines
const initializeMedicines = async () => {
  try {
    const count = await Medicine.countDocuments()
    if (count === 0) {
      await Medicine.insertMany(defaultMedicines)
      console.log('Default medicines initialized')
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

    const medicine = await Medicine.findOne({
      disease: symptom.toLowerCase().trim(),
      isActive: true
    })

    if (medicine) {
      // Save prescription history
      await Prescription.create({
        symptom: symptom.toLowerCase().trim(),
        medicines: medicine.medicines,
        ipAddress: req.ip
      })

      res.json({
        found: true,
        symptom: medicine.disease,
        medicines: medicine.medicines,
        description: medicine.description
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

// Add new medicine (admin only)
exports.addMedicine = async (req, res) => {
  try {
    const { disease, medicines, description, category } = req.body

    // Check if medicine already exists
    const existingMedicine = await Medicine.findOne({
      disease: disease.toLowerCase().trim()
    })

    if (existingMedicine) {
      return res.status(409).json({
        message: 'Medicine for this disease already exists'
      })
    }

    const newMedicine = await Medicine.create({
      disease: disease.toLowerCase().trim(),
      medicines,
      description,
      category
    })

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      medicine: newMedicine
    })
  } catch (error) {
    console.error('Add medicine error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update medicine (admin only)
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { ...updates, disease: updates.disease?.toLowerCase().trim() },
      { new: true, runValidators: true }
    )

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' })
    }

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      medicine
    })
  } catch (error) {
    console.error('Update medicine error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete medicine (admin only)
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' })
    }

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    })
  } catch (error) {
    console.error('Delete medicine error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
