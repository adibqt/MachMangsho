import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { assets, features } from "../assets/assets"
import './BottomBanner.css'

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setIsVisible(true)
                    setHasAnimated(true)
                }
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px',
                ...options
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [hasAnimated, options])

    return [ref, isVisible]
}

// Enhanced feature component
const FeatureCard = ({ feature, index, isActive, onClick, isVisible }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            onClick={() => onClick(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform backdrop-blur-sm ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            } ${
                isActive 
                    ? 'bg-white/20 border-2 border-white/40 shadow-2xl scale-105' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/15 hover:scale-102'
            }`}
            style={{
                transitionDelay: `${index * 0.1}s`
            }}
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[#FF6B6C]/20 to-transparent transition-opacity duration-500 ${
                isActive || isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
            
            {/* Content */}
            <div className="relative p-6 flex items-center gap-4">
                {/* Icon container with enhanced animations */}
                <div className={`relative flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                    <div className={`relative p-4 rounded-full transition-all duration-300 ${
                        isActive 
                            ? 'bg-white shadow-xl' 
                            : 'bg-white/90 group-hover:bg-white group-hover:shadow-lg'
                    }`}>
                        <img 
                            src={feature.icon} 
                            alt={feature.title} 
                            className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ${
                                isActive ? 'filter brightness-110 saturate-110' : ''
                            }`}
                        />
                        
                        {/* Pulse animation for active feature */}
                        {isActive && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-white/50 animate-ping"></div>
                                <div className="absolute inset-0 rounded-full bg-[#FF6B6C]/30 animate-pulse"></div>
                            </>
                        )}
                    </div>
                    
                    {/* Floating elements */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 bg-[#FF6B6C] rounded-full transition-all duration-300 ${
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`} />
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-bold mb-2 transition-all duration-300 line-clamp-1 ${
                        isActive 
                            ? 'text-white text-xl md:text-2xl text-shadow-lg' 
                            : 'text-gray-800 group-hover:text-white text-lg md:text-xl'
                    }`}>
                        {feature.title}
                    </h3>
                    <p className={`text-sm md:text-base transition-all duration-300 line-clamp-2 ${
                        isActive 
                            ? 'text-white/95' 
                            : 'text-gray-600 group-hover:text-white/90'
                    }`}>
                        {feature.description}
                    </p>
                </div>

                {/* Active indicator with animation */}
                <div className={`flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'transform translate-x-0 opacity-100' : 'transform translate-x-4 opacity-0'
                }`}>
                    <div className="w-1 h-12 bg-white rounded-full shadow-lg">
                        <div className="w-full h-full bg-gradient-to-b from-[#FF6B6C] to-white rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[#FF6B6C]/10 to-transparent transition-opacity duration-300 ${
                isHovered && !isActive ? 'opacity-100' : 'opacity-0'
            }`} />
        </div>
    )
}

// Statistics component
const StatsCounter = ({ target, label, duration = 2000 }) => {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [])

    useEffect(() => {
        if (isVisible) {
            let startTime = null
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime
                const progress = Math.min((currentTime - startTime) / duration, 1)
                setCount(Math.floor(progress * target))
                
                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }
            requestAnimationFrame(animate)
        }
    }, [isVisible, target, duration])

    return (
        <div ref={ref} className="text-center text-white">
            <div className="text-2xl md:text-3xl font-bold mb-1">{count.toLocaleString()}+</div>
            <div className="text-sm md:text-base opacity-90">{label}</div>
        </div>
    )
}

const EnhancedBottomBanner = () => {
    const [activeFeature, setActiveFeature] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef(null)
    const [bannerRef, isVisible] = useIntersectionObserver()

    // Enhanced auto-rotation with pause on interaction
    useEffect(() => {
        if (isVisible && !isPaused) {
            intervalRef.current = setInterval(() => {
                setActiveFeature(prev => (prev + 1) % features.length)
            }, 4000)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isVisible, isPaused])

    // Handle manual feature selection with smart pausing
    const handleFeatureClick = useCallback((index) => {
        setActiveFeature(index)
        setIsPaused(true)
        
        // Resume auto-rotation after 5 seconds
        setTimeout(() => {
            setIsPaused(false)
        }, 5000)
    }, [])

    // Memoized stats data
    const stats = useMemo(() => [
        { target: 10000, label: 'Happy Customers' },
        { target: 500, label: 'Products Available' },
        { target: 30, label: 'Delivery Areas' },
        { target: 24, label: 'Support Hours' }
    ], [])

    // Memoized feature cards
    const featureCards = useMemo(() => 
        features.map((feature, index) => (
            <FeatureCard
                key={index}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                onClick={handleFeatureClick}
                isVisible={isVisible}
            />
        )), [activeFeature, handleFeatureClick, isVisible])

    return (
        <div ref={bannerRef} className='relative mt-24 overflow-hidden'>
            {/* Enhanced background with parallax effect */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6C]/20 via-transparent to-[#FF6B6C]/10" />
                
                <picture>
                    <source media="(min-width: 768px)" srcSet={assets.bottom_banner_image} />
                    <img 
                        src={assets.bottom_banner_image_sm} 
                        alt="Why choose MachMangsho - Premium grocery delivery service" 
                        className='w-full h-full object-cover'
                        loading="lazy"
                    />
                </picture>
                
                {/* Enhanced gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Dynamic floating elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-float"></div>
                    <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-[#FF6B6C]/10 rounded-full blur-xl animate-float-delayed"></div>
                    <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-float-slow"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-[#FF6B6C]/5 rounded-full blur-3xl animate-pulse"></div>
                </div>
            </div>

            {/* Main content */}
            <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-8 md:pt-0 px-4 md:px-8 lg:px-16 xl:px-24'>
                <div className="max-w-2xl w-full">
                    {/* Enhanced header section */}
                    <div className="text-center md:text-right mb-8 md:mb-12">
                        <div className={`transition-all duration-1000 ${
                            isVisible 
                                ? 'transform translate-y-0 opacity-100' 
                                : 'transform translate-y-12 opacity-0'
                        }`}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                <span className="text-white drop-shadow-2xl">Why We Are</span>
                                <br />
                                <span className="text-[#FF6B6C] drop-shadow-2xl relative">
                                    The Best?
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B6C] to-transparent rounded-full" />
                                </span>
                            </h1>
                        </div>
                        
                        <div className={`transition-all duration-1000 ${
                            isVisible 
                                ? 'transform translate-y-0 opacity-100' 
                                : 'transform translate-y-12 opacity-0'
                        }`} style={{transitionDelay: '0.2s'}}>
                            <p className="text-white/95 text-lg md:text-xl font-medium mb-6 leading-relaxed">
                                Discover what makes us Bangladesh's most trusted grocery delivery service
                            </p>
                            
                            {/* Quick stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                                {stats.map((stat, index) => (
                                    <StatsCounter
                                        key={index}
                                        target={stat.target}
                                        label={stat.label}
                                        duration={2000 + index * 200}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced features section */}
                    <div className="space-y-4 mb-8">
                        {featureCards}
                    </div>

                    {/* Interactive feature indicators */}
                    <div className="flex justify-center md:justify-end items-center space-x-3 mb-8">
                        <span className="text-white/70 text-sm mr-2">Features</span>
                        {features.map((feature, index) => (
                            <button
                                key={index}
                                onClick={() => handleFeatureClick(index)}
                                className={`relative group transition-all duration-300 ${
                                    activeFeature === index 
                                        ? 'scale-125' 
                                        : 'hover:scale-110'
                                }`}
                                aria-label={`View ${feature.title}`}
                                title={feature.title}
                            >
                                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                    activeFeature === index 
                                        ? 'bg-white shadow-lg' 
                                        : 'bg-white/50 group-hover:bg-white/70'
                                }`} />
                                {activeFeature === index && (
                                    <div className="absolute inset-0 rounded-full bg-white/50 animate-ping" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Enhanced call to action */}
                    <div className={`text-center md:text-right transition-all duration-1000 ${
                        isVisible 
                            ? 'transform translate-y-0 opacity-100' 
                            : 'transform translate-y-12 opacity-0'
                    }`} style={{transitionDelay: '0.8s'}}>
                        <button className="group relative overflow-hidden bg-gradient-to-r from-[#FF6B6C] to-[#FF8788] hover:from-[#FF8788] hover:to-[#FFB3B3] text-white font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                            <span className="relative z-10 flex items-center">
                                Experience the MachMangsho Difference
                                <svg className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {!isVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="animate-pulse bg-white/10 rounded-2xl p-8 max-w-2xl w-full mx-4">
                        <div className="h-12 bg-white/20 rounded-lg mb-6"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-16 bg-white/20 rounded-lg"></div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-white/20 rounded mb-2"></div>
                                        <div className="h-3 bg-white/15 rounded"></div>
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

export default EnhancedBottomBanner
