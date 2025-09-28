const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  })
}

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // For demo purposes, allow hardcoded admin login
    if (username === 'admin' && password === 'admin123') {
      const token = generateToken('admin_demo')
      return res.json({
        success: true,
        token,
        user: {
          id: 'admin_demo',
          username: 'admin',
          role: 'admin'
        }
      })
    }

    // Check if user exists in database
    const user = await User.findOne({ username }).select('+password')
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid credentials'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this username or email'
      })
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get user profile
exports.getProfile = async (req, res) => {
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
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
