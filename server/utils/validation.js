const { body, param, query } = require('express-validator')

// Common validation rules
const validationRules = {
  // User validation
  username: body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Medicine validation
  disease: body('disease')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Disease name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Disease name can only contain letters and spaces'),

  medicines: body('medicines')
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Medicines must be between 2 and 500 characters'),

  // ID validation
  mongoId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  // Query validation
  searchQuery: query('symptom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
}

module.exports = validationRules
