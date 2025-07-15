import React, { useState } from 'react'
import { profile_icon, order_icon, trust_icon } from '../assets/assets'

const UserProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    address: user?.address || '123 Main St, City, State 12345',
    birthdate: user?.birthdate || '1990-01-01'
  })

  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'Delivered',
      total: '$45.99',
      items: ['Fresh Apples', 'Organic Milk', 'Whole Wheat Bread']
    },
    {
      id: 'ORD-002',
      date: '2025-01-12',
      status: 'Shipped',
      total: '$23.50',
      items: ['Bananas', 'Greek Yogurt']
    },
    {
      id: 'ORD-003',
      date: '2025-01-10',
      status: 'Processing',
      total: '$67.25',
      items: ['Chicken Breast', 'Vegetables', 'Rice']
    }
  ])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+1 (555) 123-4567',
      address: user?.address || '123 Main St, City, State 12345',
      birthdate: user?.birthdate || '1990-01-01'
    })
    setIsEditing(false)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <img src={profile_icon} alt="Profile" className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
          <p className="text-gray-600">{formData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Date
          </label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 resize-none"
          />
        </div>
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Order History</h3>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src={order_icon} alt="Order" className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold text-gray-800">Order {order.id}</h4>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
                <p className="text-lg font-semibold text-gray-800 mt-1">{order.total}</p>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">Items:</p>
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h4 className="font-medium text-gray-800 mb-2">Notifications</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
              <span className="text-gray-700">Email notifications for orders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
              <span className="text-gray-700">SMS notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
              <span className="text-gray-700">Marketing emails</span>
            </label>
          </div>
        </div>

        <div className="border-b pb-4">
          <h4 className="font-medium text-gray-800 mb-2">Privacy</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
              <span className="text-gray-700">Allow data analytics</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
              <span className="text-gray-700">Share data with partners</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Danger Zone</h4>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            activeTab === 'profile' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            activeTab === 'orders' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            activeTab === 'settings' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'orders' && renderOrdersTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  )
}

export default UserProfile
