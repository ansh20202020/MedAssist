import { useState } from 'react'
import { medicineService } from '../services/medicineService'
import { useNotification } from '../context/NotificationContext'

export const useMedicine = () => {
  const [loading, setLoading] = useState(false)
  const [medicines, setMedicines] = useState([])
  const [searchResult, setSearchResult] = useState(null)
  const { showSuccess, showError } = useNotification()

  const searchMedicine = async (symptom) => {
    setLoading(true)
    try {
      const result = await medicineService.searchMedicine(symptom)
      setSearchResult(result)
      return result
    } catch (error) {
      showError(error.message || 'Failed to search medicine')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getAllMedicines = async () => {
    setLoading(true)
    try {
      const result = await medicineService.getAllMedicines()
      setMedicines(result.medicines || [])
      return result
    } catch (error) {
      showError(error.message || 'Failed to fetch medicines')
      return null
    } finally {
      setLoading(false)
    }
  }

  const addMedicine = async (medicineData) => {
    setLoading(true)
    try {
      const result = await medicineService.addMedicine(medicineData)
      showSuccess('Medicine added successfully')
      await getAllMedicines() // Refresh list
      return result
    } catch (error) {
      showError(error.message || 'Failed to add medicine')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateMedicine = async (id, medicineData) => {
    setLoading(true)
    try {
      const result = await medicineService.updateMedicine(id, medicineData)
      showSuccess('Medicine updated successfully')
      await getAllMedicines() // Refresh list
      return result
    } catch (error) {
      showError(error.message || 'Failed to update medicine')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteMedicine = async (id) => {
    setLoading(true)
    try {
      const result = await medicineService.deleteMedicine(id)
      showSuccess('Medicine deleted successfully')
      await getAllMedicines() // Refresh list
      return result
    } catch (error) {
      showError(error.message || 'Failed to delete medicine')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    medicines,
    searchResult,
    searchMedicine,
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine
  }
}
