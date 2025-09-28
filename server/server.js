const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const errorHandler = require('./middleware/errorHandler')

// Routes
const authRoutes = require('./routes/auth')
const medicineRoutes = require('./routes/medicine')
const userRoutes = require('./routes/user')

dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/medicine', medicineRoutes)
app.use('/api/user', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
