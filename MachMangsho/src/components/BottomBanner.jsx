import React, { useState, useEffect, useRef, useCallback } from 'react'
import { assets, features } from "../assets/assets"

const BottomBanner = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [activeFeature, setActiveFeature] = useState(0)
    const bannerRef = useRef(null)
    const intervalRef = useRef(null)

    // Intersection Observer for animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -100px 0px'
            }
        )

        if (bannerRef.current) {
            observer.observe(bannerRef.current)
        }

        return () => {
            if (bannerRef.current) {
                observer.unobserve(bannerRef.current)
            }
        }
    }, [])

    // Auto-rotate features for better engagement
    useEffect(() => {
        if (isVisible) {
            intervalRef.current = setInterval(() => {
                setActiveFeature(prev => (prev + 1) % features.length)
            }, 3000)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isVisible])

    // Handle manual feature selection
    const handleFeatureClick = useCallback((index) => {
        setActiveFeature(index)
        // Reset interval when user manually selects
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = setInterval(() => {
                setActiveFeature(prev => (prev + 1) % features.length)
            }, 3000)
        }
    }, [])

    // Memoized feature items for performance
    const featureItems = React.useMemo(() => 
        features.map((feature, index) => (
            <div
                key={index}
                onClick={() => handleFeatureClick(index)}
                className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } ${
                    activeFeature === index 
                        ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg' 
                        : 'hover:bg-white/10'
                }`}
                style={{
                    transitionDelay: `${index * 0.1}s`
                }}
            >
                {/* Icon with enhanced styling */}
                <div className={`relative p-3 rounded-full transition-all duration-300 ${
                    activeFeature === index 
                        ? 'bg-white shadow-lg scale-110' 
                        : 'bg-white/80 group-hover:bg-white group-hover:scale-105'
                }`}>
                    <img 
                        src={feature.icon} 
                        alt={feature.title} 
                        className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ${
                            activeFeature === index ? 'filter brightness-110' : ''
                        }`}
                    />
                    {/* Pulse animation for active feature */}
                    {activeFeature === index && (
                        <div className="absolute inset-0 rounded-full bg-white/50 animate-ping"></div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className={`text-lg md:text-xl font-bold mb-1 transition-all duration-300 ${
                        activeFeature === index 
                            ? 'text-white text-shadow-lg' 
                            : 'text-gray-800 group-hover:text-white'
                    }`}>
                        {feature.title}
                    </h3>
                    <p className={`text-sm md:text-base transition-all duration-300 ${
                        activeFeature === index 
                            ? 'text-white/90' 
                            : 'text-gray-600 group-hover:text-white/90'
                    }`}>
                        {feature.description}
                    </p>
                </div>

                {/* Active indicator */}
                {activeFeature === index && (
                    <div className="w-1 h-8 bg-white rounded-full shadow-lg"></div>
                )}
            </div>
        )), [activeFeature, isVisible, handleFeatureClick])

    return (
        <div ref={bannerRef} className='relative mt-24 overflow-hidden'>
            {/* Background images with parallax effect */}
            <div className="relative">
                <img 
                    src={assets.bottom_banner_image} 
                    alt="Why choose us banner" 
                    className='w-full hidden md:block object-cover'
                />
                <img 
                    src={assets.bottom_banner_image_sm} 
                    alt="Why choose us banner" 
                    className='w-full md:hidden object-cover'
                />
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/60"></div>
                
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute top-3/4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-2/3 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
            </div>

            {/* Content overlay */}
            <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-10 md:pt-0 md:pr-8 lg:pr-16 xl:pr-24'>
                <div className="max-w-lg px-6 md:px-0">
                    {/* Main heading with animation */}
                    <div className="text-center md:text-right mb-8">
                        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 ${
                            isVisible 
                                ? 'transform translate-y-0 opacity-100' 
                                : 'transform translate-y-8 opacity-0'
                        }`}>
                            <span className="text-white drop-shadow-2xl">Why We Are</span>
                            <br />
                            <span className="text-[#FF6B6C] drop-shadow-2xl">The Best?</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className={`text-white/90 text-base md:text-lg font-medium transition-all duration-700 ${
                            isVisible 
                                ? 'transform translate-y-0 opacity-100' 
                                : 'transform translate-y-8 opacity-0'
                        }`} style={{transitionDelay: '0.2s'}}>
                            Discover what makes us your trusted grocery partner
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                        {featureItems}
                    </div>

                    {/* Feature indicators */}
                    <div className="flex justify-center md:justify-end mt-8 space-x-2">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleFeatureClick(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    activeFeature === index 
                                        ? 'bg-white shadow-lg scale-125' 
                                        : 'bg-white/50 hover:bg-white/70'
                                }`}
                                aria-label={`Feature ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Call to action */}
                    <div className={`text-center md:text-right mt-8 transition-all duration-700 ${
                        isVisible 
                            ? 'transform translate-y-0 opacity-100' 
                            : 'transform translate-y-8 opacity-0'
                    }`} style={{transitionDelay: '0.8s'}}>
                        <button className="group bg-[#FF6B6C] hover:bg-[#FF8788] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            <span>Experience the Difference</span>
                            <svg className="inline-block ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading skeleton for better UX */}
            {!isVisible && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse bg-white/20 rounded-lg p-8 max-w-md">
                        <div className="h-8 bg-white/30 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-white/30 rounded mb-1"></div>
                                        <div className="h-3 bg-white/20 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BottomBanner