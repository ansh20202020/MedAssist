const express = require('express')
const { body } = require('express-validator')
const {
  searchMedicine,
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController')
const auth = require('../middleware/auth')
const validation = require('../middleware/validation')

const router = express.Router()

// Public routes
router.get('/search', searchMedicine)

// Protected routes (admin only)
router.use(auth)

router.get('/list', getAllMedicines)

router.post('/add', [
  body('disease').notEmpty().withMessage('Disease is required'),
  body('medicines').notEmpty().withMessage('Medicines are required')
], validation, addMedicine)

router.put('/update/:id', [
  body('disease').optional().notEmpty(),
  body('medicines').optional().notEmpty()
], validation, updateMedicine)

router.delete('/delete/:id', deleteMedicine)

module.exports = router
