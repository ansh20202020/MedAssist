import React from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/admin/AdminLogin'
import MedicineManager from '../components/admin/MedicineManager'

const Admin = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminLogin />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MedicineManager />
    </div>
  )
}

export default Admin
