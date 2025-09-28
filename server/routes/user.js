const express = require('express')
const {
  getUserProfile,
  getPrescriptionHistory
} = require('../controllers/userController')
const auth = require('../middleware/auth')

const router = express.Router()

router.use(auth) // All routes require authentication

router.get('/profile', getUserProfile)
router.get('/history', getPrescriptionHistory)

module.exports = router
