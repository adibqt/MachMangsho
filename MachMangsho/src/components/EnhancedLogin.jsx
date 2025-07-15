import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import FormInput from './FormInput'

const EnhancedLogin = () => {
    const { setShowUserLogin, setUser } = useAppContext()
    const [state, setState] = useState("login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    
    const formRef = useRef(null)
    const emailInputRef = useRef(null)

    // Focus email input when component mounts
    useEffect(() => {
        emailInputRef.current?.focus()
    }, [])

    // Handle input changes with debouncing for validation
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

    // Enhanced form validation
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
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }
        
        // Registration-specific validation
        if (state === "register") {
            // Name validation
            if (!formData.name) {
                newErrors.name = "Name is required"
            } else if (formData.name.length < 2) {
                newErrors.name = "Name must be at least 2 characters"
            } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
                newErrors.name = "Name can only contain letters and spaces"
            }
            
            // Confirm password validation
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password"
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
            }
            
            // Terms agreement validation
            if (!agreedToTerms) {
                newErrors.terms = "You must agree to the terms and conditions"
            }
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData, state, agreedToTerms])

    // Handle form submission with enhanced error handling
    const onSubmitHandler = useCallback(async (event) => {
        event.preventDefault()
        
        if (!validateForm()) {
            toast.error("Please fix the errors and try again")
            return
        }

        setIsLoading(true)
        
        try {
            // Simulate API call with realistic delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Mock authentication logic with better user data
            const userData = {
                id: Date.now(),
                email: formData.email,
                name: state === "register" ? formData.name : formData.email.split('@')[0],
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || formData.email)}&background=FF6B6C&color=fff`,
                createdAt: new Date().toISOString(),
                preferences: {
                    theme: 'light',
                    notifications: true
                }
            }
            
            setUser(userData)
            
            // Save to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email)
                localStorage.setItem('userData', JSON.stringify(userData))
            }
            
            // Success feedback
            toast.success(
                state === "register" 
                    ? `Welcome ${userData.name}! Your account has been created successfully.`
                    : `Welcome back, ${userData.name}!`
            )
            
            setShowUserLogin(false)
            
        } catch (error) {
            console.error('Login/Registration error:', error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [formData, state, validateForm, setUser, setShowUserLogin, rememberMe, agreedToTerms])

    // Handle state change with form reset
    const handleStateChange = useCallback((newState) => {
        setState(newState)
        setErrors({})
        setFormData({
            name: "",
            email: formData.email, // Keep email when switching
            password: "",
            confirmPassword: ""
        })
        setAgreedToTerms(false)
    }, [formData.email])

    // Handle close modal
    const handleCloseModal = useCallback(() => {
        setShowUserLogin(false)
    }, [setShowUserLogin])

    // Load remembered email and user data on mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        const savedUserData = localStorage.getItem('userData')
        
        if (rememberedEmail) {
            setFormData(prev => ({
                ...prev,
                email: rememberedEmail
            }))
            setRememberMe(true)
        }
        
        // Auto-login if user data exists and is valid
        if (savedUserData && rememberedEmail) {
            try {
                const userData = JSON.parse(savedUserData)
                if (userData.email === rememberedEmail) {
                    setUser(userData)
                    setShowUserLogin(false)
                    toast.success(`Welcome back, ${userData.name}!`)
                }
            } catch (error) {
                console.error('Error parsing saved user data:', error)
                localStorage.removeItem('userData')
            }
        }
    }, [setUser, setShowUserLogin])

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

    // Password strength indicator
    const getPasswordStrength = useCallback((password) => {
        if (!password) return { level: 0, text: '', color: 'gray' }
        
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
        
        const levels = [
            { level: 0, text: 'Very Weak', color: 'red' },
            { level: 1, text: 'Weak', color: 'red' },
            { level: 2, text: 'Fair', color: 'yellow' },
            { level: 3, text: 'Good', color: 'blue' },
            { level: 4, text: 'Strong', color: 'green' },
            { level: 5, text: 'Very Strong', color: 'green' }
        ]
        
        return levels[strength]
    }, [])

    const passwordStrength = getPasswordStrength(formData.password)

    return (
        <div 
            onClick={handleCloseModal} 
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300'
        >
            <div 
                ref={formRef}
                onClick={(e) => e.stopPropagation()} 
                className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] max-h-[90vh] overflow-y-auto"
            >
                {/* Close Button */}
                <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
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
                            {state === "login" 
                                ? "Welcome back! Please sign in to your account." 
                                : "Create your account to get started with MachMangsho."}
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Name Field (Registration only) */}
                        {state === "register" && (
                            <FormInput
                                label="Full Name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                error={errors.name}
                                required
                            />
                        )}

                        {/* Email Field */}
                        <FormInput
                            ref={emailInputRef}
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email address"
                            error={errors.email}
                            required
                        />

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
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
                            
                            {/* Password Strength Indicator */}
                            {state === "register" && formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                                                style={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                                            {passwordStrength.text}
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field (Registration only) */}
                        {state === "register" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        placeholder="Confirm your password"
                                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#FF6B6C]/20 focus:border-[#FF6B6C] transition-all duration-200 ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
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
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        {/* Terms Agreement (Registration only) */}
                        {state === "register" && (
                            <div>
                                <label className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-4 h-4 text-[#FF6B6C] border-gray-300 rounded focus:ring-[#FF6B6C]/20 focus:ring-2 mt-1"
                                    />
                                    <span className="text-sm text-gray-600">
                                        I agree to the{' '}
                                        <button type="button" className="text-[#FF6B6C] hover:text-[#FF8788] transition-colors">
                                            Terms of Service
                                        </button>
                                        {' '}and{' '}
                                        <button type="button" className="text-[#FF6B6C] hover:text-[#FF8788] transition-colors">
                                            Privacy Policy
                                        </button>
                                    </span>
                                </label>
                                {errors.terms && (
                                    <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
                                )}
                            </div>
                        )}

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
                    <LoadingButton
                        type="submit"
                        isLoading={isLoading}
                        loadingText={state === "register" ? "Creating Account..." : "Signing In..."}
                        className="w-full"
                        size="md"
                    >
                        {state === "register" ? "Create Account" : "Sign In"}
                    </LoadingButton>

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

                    {/* Social Login Options */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EnhancedLogin
