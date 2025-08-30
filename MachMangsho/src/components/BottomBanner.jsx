import React, { useEffect, useRef, useState } from 'react'
import { features } from "../assets/assets"

const BottomBanner = () => {
    const rootRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setIsVisible(true);
            return;
        }
        const el = rootRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { root: null, threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={rootRef} className='relative mt-24 overflow-hidden rounded-xl ring-1 ring-emerald-100'>
            {/* Professional subtle background */}
            <div className='w-full h-72 md:h-96 bg-gradient-to-r from-slate-50 via-emerald-50 to-teal-50' />

            {/* Content: two-column layout */}
            <div className='absolute inset-0 h-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6 md:px-12'>
                {/* Left: heading centered vertically, aligned left */}
                <div
                  className={`flex flex-col justify-center transition-all duration-700 ease-out will-change-[transform,opacity] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                >
                    <h2 className='text-3xl md:text-4xl font-semibold text-slate-900'>
                        Why are we the best?
                    </h2>
                    <div className='mt-3 h-1 w-24 bg-emerald-400 rounded-full' />
                    <p className='mt-4 text-slate-600 max-w-md'>
                        Fresh groceries, fair prices, and reliable delivery—crafted for your daily needs.
                    </p>
                </div>

                {/* Right: four bullet points */}
                <div className='grid grid-cols-1 gap-4 md:gap-5'>
                    {features.slice(0, 4).map((feature, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 md:p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm hover:shadow-md transition-all duration-700 ease-out will-change-[transform,opacity] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          style={{ transitionDelay: isVisible ? `${150 + index * 120}ms` : '0ms' }}
                        >
                            <img
                              src={feature.icon}
                              alt={feature.title}
                              className='w-8 h-8 md:w-10 md:h-10 shrink-0 hover:scale-105 transition-transform'
                            />
                            <div>
                                <h3 className='text-base md:text-lg font-semibold text-slate-900'>{feature.title}</h3>
                                <p className='text-slate-600 text-sm md:text-[15px]'>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BottomBanner