import React from 'react'

const LoadingButton = ({ 
    children, 
    isLoading = false, 
    loadingText = "Loading...", 
    className = "", 
    disabled = false,
    variant = "primary",
    size = "md",
    ...props 
}) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed"
    
    const variants = {
        primary: "bg-[#FF6B6C] text-white hover:bg-[#FF8788] focus:ring-[#FF6B6C]/50 disabled:bg-gray-400",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500/50 disabled:bg-gray-200",
        outline: "border-2 border-[#FF6B6C] text-[#FF6B6C] hover:bg-[#FF6B6C] hover:text-white focus:ring-[#FF6B6C]/50 disabled:border-gray-300 disabled:text-gray-400"
    }
    
    const sizes = {
        sm: "px-3 py-2 text-sm rounded-md",
        md: "px-4 py-3 text-base rounded-lg",
        lg: "px-6 py-4 text-lg rounded-xl"
    }
    
    const isDisabled = disabled || isLoading
    
    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
                !isDisabled ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
            }`}
            disabled={isDisabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    )
}

export default LoadingButton
