import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Save, X, Pill } from 'lucide-react'
import { useMedicine } from '../../hooks/useMedicine'
import LoadingSpinner from '../common/LoadingSpinner'

const MedicineManager = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, disease: 'cough', medicines: 'Cough Syrup, Honey, Dextromethorphan' },
    { id: 2, disease: 'cold', medicines: 'Antihistamines, Decongestants, Vitamin C' },
    { id: 3, disease: 'fever', medicines: 'Paracetamol, Ibuprofen, Aspirin' },
    { id: 4, disease: 'headache', medicines: 'Aspirin, Acetaminophen, Ibuprofen' },
    { id: 5, disease: 'hypertension', medicines: 'Amlodipine, Lisinopril, Losartan' },
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ disease: '', medicines: '' })
  const [addForm, setAddForm] = useState({ disease: '', medicines: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredMedicines = medicines.filter(medicine =>
    medicine.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.medicines.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startEdit = (medicine) => {
    setEditingId(medicine.id)
    setEditForm({ disease: medicine.disease, medicines: medicine.medicines })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ disease: '', medicines: '' })
  }

  const saveEdit = () => {
    if (!editForm.disease.trim() || !editForm.medicines.trim()) return
    
    setMedicines(medicines.map(medicine =>
      medicine.id === editingId
        ? { ...medicine, disease: editForm.disease.toLowerCase(), medicines: editForm.medicines }
        : medicine
    ))
    
    cancelEdit()
  }

  const deleteMedicine = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine entry?')) {
      setMedicines(medicines.filter(medicine => medicine.id !== id))
    }
  }

  const addMedicine = () => {
    if (!addForm.disease.trim() || !addForm.medicines.trim()) return
    
    const newMedicine = {
      id: Math.max(...medicines.map(m => m.id), 0) + 1,
      disease: addForm.disease.toLowerCase(),
      medicines: addForm.medicines
    }
    
    setMedicines([...medicines, newMedicine])
    setAddForm({ disease: '', medicines: '' })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicine Management</h2>
          <p className="text-gray-600">Manage disease-medicine mappings</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search diseases or medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="card border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Medicine Entry</h3>
            <button
              onClick={() => {
                setShowAddForm(false)
                setAddForm({ disease: '', medicines: '' })
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease/Symptom
              </label>
              <input
                type="text"
                placeholder="e.g., stomach ache"
                value={addForm.disease}
                onChange={(e) => setAddForm({ ...addForm, disease: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicines (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Antacid, Omeprazole"
                value={addForm.medicines}
                onChange={(e) => setAddForm({ ...addForm, medicines: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false)
                setAddForm({ disease: '', medicines: '' })
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={addMedicine}
              disabled={!addForm.disease.trim() || !addForm.medicines.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Medicine
            </button>
          </div>
        </div>
      )}

      {/* Medicine List */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Pill className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Medicine Database ({filteredMedicines.length} entries)
          </h3>
        </div>
        
        {filteredMedicines.length > 0 ? (
          <div className="space-y-3">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingId === medicine.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Disease/Symptom
                        </label>
                        <input
                          type="text"
                          value={editForm.disease}
                          onChange={(e) => setEditForm({ ...editForm, disease: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medicines
                        </label>
                        <input
                          type="text"
                          value={editForm.medicines}
                          onChange={(e) => setEditForm({ ...editForm, medicines: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button onClick={cancelEdit} className="btn-secondary">
                        <X className="h-4 w-4" />
                      </button>
                      <button onClick={saveEdit} className="btn-primary">
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                          {medicine.disease}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        <span className="font-medium">Medicines:</span> {medicine.medicines}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => startEdit(medicine)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMedicine(medicine.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No medicines found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicineManager
