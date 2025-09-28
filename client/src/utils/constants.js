export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  MEDICINE: {
    SEARCH: '/medicine/search',
    ADD: '/medicine/add',
    UPDATE: '/medicine/update',
    DELETE: '/medicine/delete',
    LIST: '/medicine/list'
  },
  USER: {
    PROFILE: '/user/profile',
    HISTORY: '/user/history'
  }
}

export const COMMON_DISEASES = [
  'cough', 'cold', 'fever', 'headache', 'stomach ache', 
  'sore throat', 'nausea', 'dizziness', 'fatigue', 'muscle pain'
]

export const ADMIN_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123'
}
