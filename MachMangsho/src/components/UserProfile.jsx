import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { profile_icon, order_icon, trust_icon } from '../assets/assets'

const UserProfile = ({ user, onSave, onError }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Initialize form data with proper defaults
  const initialFormData = useMemo(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthdate: user?.birthdate || ''
  }), [user])

  const [formData, setFormData] = useState(initialFormData)

  // Update form data when user prop changes
  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  // Sample orders data - should come from props in real app
  const [orders] = useState([
    {
      id: 'ORD-2025-001',
      date: '2025-01-18',
      status: 'Delivered',
      total: 45.99,
      currency: '$',
      items: ['Fresh Apples (2 lbs)', 'Organic Milk (1 gallon)', 'Whole Wheat Bread'],
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2025-002',
      date: '2025-01-16',
      status: 'Shipped',
      total: 23.50,
      currency: '$',
      items: ['Bananas (1 bunch)', 'Greek Yogurt (4 cups)'],
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-2025-003',
      date: '2025-01-14',
      status: 'Processing',
      total: 67.25,
      currency: '$',
      items: ['Chicken Breast (2 lbs)', 'Mixed Vegetables (1 bag)', 'Basmati Rice (2 lbs)'],
      trackingNumber: null
    },
    {
      id: 'ORD-2025-004',
      date: '2025-01-12',
      status: 'Cancelled',
      total: 34.75,
      currency: '$',
      items: ['Salmon Fillet (1 lb)', 'Asparagus (1 bunch)'],
      trackingNumber: null
    }
  ])

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    smsNotifications: false,
    marketingEmails: true,
    pushNotifications: true
  })

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    dataAnalytics: true,
    shareWithPartners: false,
    trackingCookies: true
  })

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (birthDate > today) {
        newErrors.birthdate = 'Birth date cannot be in the future'
      } else if (age < 13) {
        newErrors.birthdate = 'Must be at least 13 years old'
      } else if (age > 120) {
        newErrors.birthdate = 'Please enter a valid birth date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Optimized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }, [errors])

  // Optimized save handler
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return
    }
    
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSave) {
        await onSave(formData)
      }
      
      setIsEditing(false)
      setErrors({})
      
      // Show success message (you can integrate with a toast library)
      console.log('Profile updated successfully!')
      
    } catch (error) {
      console.error('Error saving profile:', error)
      if (onError) {
        onError(error)
      }
      setErrors({ general: 'Failed to save profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }, [formData, validateForm, onSave, onError])

  // Optimized cancel handler
  const handleCancel = useCallback(() => {
    setFormData(initialFormData)
    setIsEditing(false)
    setErrors({})
  }, [initialFormData])

  // Optimized tab change handler
  const handleTabChange = useCallback((tab) => {
    if (isEditing) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to leave this tab?')
      if (!confirmDiscard) return
      
      setIsEditing(false)
      setFormData(initialFormData)
      setErrors({})
    }
    setActiveTab(tab)
  }, [isEditing, initialFormData])

  // Memoized status color function
  const getStatusColor = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'shipped':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'cancelled':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }, [])

  // Format currency
  const formatCurrency = useCallback((amount, currency = '$') => {
    return `${currency}${amount.toFixed(2)}`
  }, [])

  // Format date
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  // Handle notification changes
  const handleNotificationChange = useCallback((key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Handle privacy changes
  const handlePrivacyChange = useCallback((key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Handle account deletion
  const handleDeleteAccount = useCallback(() => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (confirmDelete) {
      const doubleConfirm = window.confirm(
        'This will permanently delete all your data, orders, and account information. Are you absolutely sure?'
      )
      if (doubleConfirm) {
        // Handle account deletion logic here
        console.log('Account deletion requested')
      }
    }
  }, [])

  const renderProfileTab = useCallback(() => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <img src={profile_icon} alt="Profile" className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{formData.name || 'User'}</h2>
          <p className="text-gray-600">{formData.email || 'No email provided'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 ${
              errors.birthdate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birthdate && <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>}
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
            placeholder="Enter your address"
          />
        </div>
      </div>
    </div>
  ), [formData, isEditing, isSaving, errors, handleInputChange, handleSave, handleCancel])

  const renderOrdersTab = useCallback(() => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Order History</h3>
        <p className="text-sm text-gray-500">{orders.length} orders total</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <img src={order_icon} alt="No orders" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-500 mb-2">No orders yet</h4>
          <p className="text-gray-400">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={order_icon} alt="Order" className="w-6 h-6" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Order {order.id}</h4>
                    <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {formatCurrency(order.total, order.currency)}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Items ({order.items.length}):</p>
                  {order.trackingNumber && (
                    <p className="text-sm text-blue-600">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 mt-3">
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                    View Details
                  </button>
                  {order.status === 'Delivered' && (
                    <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                      Reorder
                    </button>
                  )}
                  {order.status === 'Processing' && (
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ), [orders, formatDate, formatCurrency, getStatusColor])

  const renderSettingsTab = useCallback(() => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>
      
      <div className="space-y-8">
        {/* Notifications Section */}
        <div className="border-b pb-6">
          <h4 className="font-medium text-gray-800 mb-4">Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={notifications.emailOrders}
                onChange={(e) => handleNotificationChange('emailOrders', e.target.checked)}
              />
              <span className="text-gray-700">Email notifications for orders</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={notifications.smsNotifications}
                onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
              />
              <span className="text-gray-700">SMS notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={notifications.marketingEmails}
                onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
              />
              <span className="text-gray-700">Marketing emails</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={notifications.pushNotifications}
                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
              />
              <span className="text-gray-700">Push notifications</span>
            </label>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="border-b pb-6">
          <h4 className="font-medium text-gray-800 mb-4">Privacy</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={privacy.dataAnalytics}
                onChange={(e) => handlePrivacyChange('dataAnalytics', e.target.checked)}
              />
              <span className="text-gray-700">Allow data analytics</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={privacy.shareWithPartners}
                onChange={(e) => handlePrivacyChange('shareWithPartners', e.target.checked)}
              />
              <span className="text-gray-700">Share data with partners</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                checked={privacy.trackingCookies}
                onChange={(e) => handlePrivacyChange('trackingCookies', e.target.checked)}
              />
              <span className="text-gray-700">Allow tracking cookies</span>
            </label>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Account Actions</h4>
          <div className="space-y-3">
            <button className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Export My Data
            </button>
            <button className="w-full md:w-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              Reset Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  ), [notifications, privacy, handleNotificationChange, handlePrivacyChange, handleDeleteAccount])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'orders', label: 'Orders' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              activeTab === tab.id 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'orders' && renderOrdersTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  )
}

export default UserProfile
