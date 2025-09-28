import React, { useState } from 'react'
import { Users, Search, Filter, MoreVertical, Shield, Ban, CheckCircle } from 'lucide-react'

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      lastActive: '2 hours ago',
      searchCount: 15,
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      lastActive: '1 day ago',
      searchCount: 8,
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@medassist.com',
      role: 'admin',
      status: 'active',
      lastActive: 'Online',
      searchCount: 45,
      joinDate: '2024-01-01'
    },
    {
      id: 4,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      lastActive: '1 week ago',
      searchCount: 3,
      joinDate: '2024-03-10'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getRoleIcon = (role) => {
    return role === 'admin' ? Shield : Users
  }

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            Add New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-field"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h3>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Active</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Searches</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role)
                  return (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <RoleIcon className="h-4 w-4 text-gray-500" />
                          <span className="capitalize text-gray-900">{user.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Ban className="w-3 h-3 mr-1" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{user.lastActive}</td>
                      <td className="py-4 px-4 text-gray-900">{user.searchCount}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
