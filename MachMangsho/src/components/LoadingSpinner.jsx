import React from 'react'

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'green', 
  message = 'Loading...',
  fullScreen = false 
}) => {
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  const colorClasses = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    red: 'border-red-600',
    gray: 'border-gray-600'
  }

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={spinnerClass}></div>
          {message && (
            <p className="mt-4 text-gray-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div className={spinnerClass}></div>
        {message && (
          <p className="mt-2 text-gray-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}

// Alternative pulsing loader
export const PulseLoader = ({ 
  color = 'green',
  size = 'medium',
  count = 3 
}) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  }

  const colorClasses = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    gray: 'bg-gray-600'
  }

  const dotClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`

  return (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={dotClass}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
    </div>
  )
}

// Card skeleton loader
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
            <div className="bg-gray-300 h-6 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Button with loading state
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {children}
      </span>
    </button>
  )
}

export default LoadingSpinner
