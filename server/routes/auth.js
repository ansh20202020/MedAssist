const express = require('express')
const { body } = require('express-validator')
const {
  login,
  register,
  getProfile
} = require('../controllers/authController')
const auth = require('../middleware/auth')
const validation = require('../middleware/validation')

const router = express.Router()

router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validation, login)

router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validation, register)

router.get('/profile', auth, getProfile)

module.exports = router
