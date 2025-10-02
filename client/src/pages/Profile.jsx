import React from 'react'
import HealthProfile from '../components/user/HealthProfile'
import PrescriptionHistory from '../components/user/PrescriptionHistory'

const Profile = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your health information and view your activity</p>
      </div>

      <div className="space-y-8">
        <HealthProfile />
        <PrescriptionHistory />
      </div>
    </div>
  )
}

export default Profile
