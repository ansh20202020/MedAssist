import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Pill } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../common/LoadingSpinner';

const MedicineManager = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ disease: '', medicines: '' });
  const [addForm, setAddForm] = useState({ disease: '', medicines: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Fetch medicines from backend on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicines/list');
      const data = await response.json();
      
      if (data.success) {
        setMedicines(data.medicines);
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      showError('Failed to load medicines from database');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.medicines.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (medicine) => {
    setEditingId(medicine._id);
    setEditForm({
      disease: medicine.disease,
      medicines: medicine.medicines
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ disease: '', medicines: '' });
  };

  const saveEdit = async () => {
    if (!editForm.disease.trim() || !editForm.medicines.trim()) {
      showError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/medicines/update/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Medicine updated successfully in database!');
        await fetchMedicines(); // Refresh the list
        cancelEdit();
      } else {
        showError(data.error || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Update error:', error);
      showError('Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine entry?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/medicines/delete/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Medicine deleted successfully from database!');
        await fetchMedicines(); // Refresh the list
      } else {
        showError(data.error || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showError('Failed to delete medicine');
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = async () => {
    if (!addForm.disease.trim() || !addForm.medicines.trim()) {
      showError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicines/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addForm)
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Medicine added successfully to database!');
        await fetchMedicines(); // Refresh the list
        setAddForm({ disease: '', medicines: '' });
        setShowAddForm(false);
      } else {
        showError(data.error || 'Failed to add medicine');
      }
    } catch (error) {
      console.error('Add error:', error);
      showError('Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  if (loading && medicines.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicine Management</h2>
          <p className="text-gray-600">Manage disease-medicine mappings in MongoDB</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
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
                setShowAddForm(false);
                setAddForm({ disease: '', medicines: '' });
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
                setShowAddForm(false);
                setAddForm({ disease: '', medicines: '' });
              }}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={addMedicine}
              disabled={!addForm.disease.trim() || !addForm.medicines.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Plus className="h-4 w-4" />}
              <span>Add Medicine</span>
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
                key={medicine._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingId === medicine._id ? (
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
                      <button onClick={cancelEdit} className="btn-secondary" disabled={loading}>
                        <X className="h-4 w-4" />
                      </button>
                      <button onClick={saveEdit} className="btn-primary" disabled={loading}>
                        {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
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
                        <span className="font-medium">Medicines: </span>
                        {medicine.medicines}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => startEdit(medicine)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMedicine(medicine._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={loading}
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
  );
};

export default MedicineManager;
