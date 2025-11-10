// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile'
  },
  MEDICINE: {
    SEARCH: '/medicines/search',
    ADD: '/medicine/add',
    UPDATE: (id) => `/medicine/update/${id}`,
    DELETE: (id) => `/medicine/delete/${id}`,
    LIST: '/medicine/list'
  },
  USER: {
    PROFILE: '/user/profile',
    HISTORY: '/user/history'
  }
};

// Admin Credentials (for demo purposes)
export const ADMIN_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123'
};

// Common Diseases/Symptoms
export const COMMON_DISEASES = [
  'headache',
  'fever',
  'cough',
  'cold',
  'stomach ache',
  'diarrhea',
  'constipation',
  'nausea',
  'vomiting',
  'sore throat',
  'body ache',
  'back pain',
  'chest pain',
  'dizziness',
  'fatigue',
  'insomnia',
  'anxiety',
  'depression',
  'allergy',
  'rash',
  'itching',
  'acidity',
  'gas',
  'bloating',
  'hypertension',
  'diabetes',
  'asthma',
  'migraine',
  'toothache',
  'ear pain',
  'muscle pain'
];

// Emergency Contact Numbers (India)
export const EMERGENCY_NUMBERS = {
  AMBULANCE: '108',
  MEDICAL_EMERGENCY: '102',
  POLICE: '100',
  FIRE: '101'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Application Constants
export const APP_NAME = 'MedAssist Pro';
export const APP_VERSION = '1.0.0';
