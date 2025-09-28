import api from './api'
import { ENDPOINTS } from '../utils/constants'

export const medicineService = {
  // Search medicine by disease/symptom
  searchMedicine: async (symptom) => {
    try {
      const response = await api.get(`${ENDPOINTS.MEDICINE.SEARCH}?symptom=${symptom}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search medicine' }
    }
  },

  // Get all medicines (admin)
  getAllMedicines: async () => {
    try {
      const response = await api.get(ENDPOINTS.MEDICINE.LIST)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch medicines' }
    }
  },

  // Add new medicine (admin)
  addMedicine: async (medicineData) => {
    try {
      const response = await api.post(ENDPOINTS.MEDICINE.ADD, medicineData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add medicine' }
    }
  },

  // Update medicine (admin)
  updateMedicine: async (id, medicineData) => {
    try {
      const response = await api.put(`${ENDPOINTS.MEDICINE.UPDATE}/${id}`, medicineData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update medicine' }
    }
  },

  // Delete medicine (admin)
  deleteMedicine: async (id) => {
    try {
      const response = await api.delete(`${ENDPOINTS.MEDICINE.DELETE}/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete medicine' }
    }
  }
}
