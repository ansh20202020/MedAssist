const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  symptom: {
    type: String,
    required: true,
    trim: true
  },
  medicines: {
    type: String,
    required: true
  },
  searchDate: {
    type: Date,
    default: Date.now
  },
  ipAddress: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Prescription', prescriptionSchema)
