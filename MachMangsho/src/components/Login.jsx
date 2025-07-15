import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = () => {
    const { setShowUserLogin, setUser } = useAppContext()
    const [state, setState] = useState("login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    
    const formRef = useRef(null)
    const emailInputRef = useRef(null)

    // Focus email input when component mounts
    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus()
        }
    }, [])

    // Handle input changes
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }))
        }
    }, [errors])

    // Form validation
    const validateForm = useCallback(() => {
        const newErrors = {}
        
        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }
        
        // Name validation for registration
        if (state === "register") {
            if (!formData.name) {
                newErrors.name = "Name is required"
            } else if (formData.name.length < 2) {
                newErrors.name = "Name must be at least 2 characters"
            }
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData, state])

    // Handle form submission
    const onSubmitHandler = useCallback(async (event) => {
        event.preventDefault()
        
        if (!validateForm()) {
            toast.error("Please fix the errors and try again")
            return
        }

        setIsLoading(true)
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Mock authentication logic
            const userData = {
                email: formData.email,
                name: state === "register" ? formData.name : formData.email.split('@')[0]
            }
            
            setUser(userData)
            
            // Save to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email)
            }
            
            toast.success(state === "register" ? "Account created successfully!" : "Login successful!")
            setShowUserLogin(false)
            
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [formData, state, validateForm, setUser, setShowUserLogin, rememberMe])

    // Handle state change (login/register)
    const handleStateChange = useCallback((newState) => {
        setState(newState)
        setErrors({})
        setFormData({
            name: "",
            email: formData.email, // Keep email when switching
            password: ""
        })
    }, [formData.email])

    // Handle close modal
    const handleCloseModal = useCallback(() => {
        setShowUserLogin(false)
    }, [setShowUserLogin])

    // Load remembered email on mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        if (rememberedEmail) {
            setFormData(prev => ({
                ...prev,
                email: rememberedEmail
            }))
            setRememberMe(true)
        }
    }, [])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleCloseModal()
            }
        }
        
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleCloseModal])

    return (
        <div 
            onClick={handleCloseModal} 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300'
        >
            <div 
                ref={formRef}
                onClick={(e) => e.stopPropagation()} 
                className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
            >
                {/* Close Button */}
                <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <form onSubmit={onSubmitHandler} className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            <span className="text-[#FF6B6C]">User</span> {state === "login" ? "Login" : "Sign Up"}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {state === "login" ? "Welcome back! Please sign in to your account." : "Create your account to get started."}
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Name Field (Registration only) */}
                        {state === "register" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Enter your full name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B6C]/20 focus:border-[#FF6B6C] transition-all duration-200 ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Enter your email address"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B6C]/20 focus:border-[#FF6B6C] transition-all duration-200 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#FF6B6C]/20 focus:border-[#FF6B6C] transition-all duration-200 ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        {state === "login" && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-[#FF6B6C] border-gray-300 rounded focus:ring-[#FF6B6C]/20 focus:ring-2"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-[#FF6B6C] hover:text-[#FF8788] transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#FF6B6C] hover:bg-[#FF8788] hover:scale-[1.02] active:scale-[0.98]'
                        } focus:outline-none focus:ring-2 focus:ring-[#FF6B6C]/50 focus:ring-offset-2`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                {state === "register" ? "Creating Account..." : "Signing In..."}
                            </div>
                        ) : (
                            state === "register" ? "Create Account" : "Sign In"
                        )}
                    </button>

                    {/* Toggle State */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            {state === "register" ? "Already have an account? " : "Don't have an account? "}
                            <button
                                type="button"
                                onClick={() => handleStateChange(state === "register" ? "login" : "register")}
                                className="text-[#FF6B6C] hover:text-[#FF8788] font-semibold transition-colors"
                            >
                                {state === "register" ? "Sign In" : "Sign Up"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login