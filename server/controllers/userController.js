const User = require('../models/User')
const Prescription = require('../models/Prescription')

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get prescription history
exports.getPrescriptionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    
    const prescriptions = await Prescription.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-ipAddress')

    const total = await Prescription.countDocuments({ userId: req.user.id })

    res.json({
      success: true,
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error('Get prescription history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
