const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  medicines: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'prescription', 'otc'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Create index for faster searches
medicineSchema.index({ disease: 1 })
medicineSchema.index({ medicines: 'text' })

module.exports = mongoose.model('Medicine', medicineSchema)
