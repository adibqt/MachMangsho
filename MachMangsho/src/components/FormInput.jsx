import React, { forwardRef } from 'react'

const FormInput = forwardRef(({ 
    label, 
    error, 
    required = false, 
    className = "", 
    containerClassName = "",
    labelClassName = "",
    errorClassName = "",
    type = "text",
    ...props 
}, ref) => {
    return (
        <div className={`${containerClassName}`}>
            {label && (
                <label className={`block text-sm font-semibold text-gray-700 mb-2 ${labelClassName}`}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B6C]/20 focus:border-[#FF6B6C] transition-all duration-200 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${className}`}
                {...props}
            />
            {error && (
                <p className={`mt-1 text-sm text-red-500 ${errorClassName}`}>
                    {error}
                </p>
            )}
        </div>
    )
})

FormInput.displayName = 'FormInput'

export default FormInput
