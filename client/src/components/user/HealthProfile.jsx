import React, { useState } from 'react'
import { User, Edit, Save, X, Heart, Activity, Calendar, Phone, Mail, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

const HealthProfile = () => {
  const { user } = useAuth()
  const { showSuccess, showError } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Health Street, Medical City',
    dateOfBirth: '1990-01-15',
    bloodType: 'O+',
    allergies: 'Penicillin, Peanuts',
    chronicConditions: 'Hypertension',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
    height: '175 cm',
    weight: '70 kg',
    lastCheckup: '2024-08-15'
  })

  const [editForm, setEditForm] = useState(profile)

  const healthStats = [
    { label: 'Total Searches', value: '12', icon: Activity, color: 'text-blue-600' },
    { label: 'Last Search', value: '2 hours ago', icon: Calendar, color: 'text-green-600' },
    { label: 'Health Score', value: 'Good', icon: Heart, color: 'text-red-600' },
    { label: 'Active Days', value: '7', icon: Activity, color: 'text-purple-600' }
  ]

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm(profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(profile)
  }

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    showSuccess('Profile updated successfully!')
  }

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!isEditing ? (
              <button onClick={handleEdit} className="btn-primary flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Health Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {healthStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profile.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editForm.address}
                  onChange={handleChange}
                  rows="2"
                  className="input-field"
                />
              ) : (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <span className="text-gray-900">{profile.address}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editForm.dateOfBirth}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profile.dateOfBirth}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="height"
                    value={editForm.height}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 175 cm"
                  />
                ) : (
                  <span className="text-gray-900">{profile.height}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="weight"
                    value={editForm.weight}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 70 kg"
                  />
                ) : (
                  <span className="text-gray-900">{profile.weight}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={editForm.bloodType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <span className="text-gray-900">{profile.bloodType}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              {isEditing ? (
                <textarea
                  name="allergies"
                  value={editForm.allergies}
                  onChange={handleChange}
                  rows="2"
                  className="input-field"
                  placeholder="List any known allergies"
                />
              ) : (
                <span className="text-gray-900">{profile.allergies || 'None reported'}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
              {isEditing ? (
                <textarea
                  name="chronicConditions"
                  value={editForm.chronicConditions}
                  onChange={handleChange}
                  rows="2"
                  className="input-field"
                  placeholder="List any chronic medical conditions"
                />
              ) : (
                <span className="text-gray-900">{profile.chronicConditions || 'None reported'}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContact"
                  value={editForm.emergencyContact}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Name and phone number"
                />
              ) : (
                <span className="text-gray-900">{profile.emergencyContact}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Checkup</label>
              {isEditing ? (
                <input
                  type="date"
                  name="lastCheckup"
                  value={editForm.lastCheckup}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <span className="text-gray-900">{profile.lastCheckup}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthProfile
