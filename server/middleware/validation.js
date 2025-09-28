const { validationResult } = require('express-validator')

const validation = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages
    })
  }
  
  next()
}

module.exports = validation
