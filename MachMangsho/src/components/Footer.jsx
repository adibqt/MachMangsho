import React, { useEffect, useRef, useState } from 'react'
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
   
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setStatsVisible(true);
            return;
        }
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    setStatsVisible(true);
                    obs.disconnect();
                }
            })
        }, { root: null, threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24" style={{backgroundColor:'#f7f7fa'}}>
            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                {/* Brand + mission (left) */}
                <div className="max-w-xl">
                    <img className="w-34 md:w-32" src={assets.Mach} alt="logo" />
                    <p className="max-w-[480px] mt-3">We deliver fresh groceries and snacks right to your doorstep. Trusted by thousands, our mission is to make your shopping experience easy, convenient, and budget-friendly.</p>
                </div>

                {/* Stats (center) */}
                <div
                  ref={statsRef}
                  className={`justify-self-center text-center w-full max-w-md md:mt-6 lg:mt-8 transition-all duration-700 ease-out will-change-[transform,opacity] ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                    <div className="grid grid-cols-3 gap-3 text-gray-700">
                        {[{
                            v: '10k+',
                            l: 'Happy Customers'
                        }, {
                            v: '30–60m',
                            l: 'Avg Delivery'
                        }, {
                            v: '1000+',
                            l: 'Daily Products'
                        }].map((s, i) => (
                            <div
                              key={s.l}
                              className={`bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm transition-all duration-700 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                              style={{ transitionDelay: statsVisible ? `${150 + i * 120}ms` : '0ms' }}
                            >
                                <p className="text-base md:text-lg font-semibold text-gray-900">{s.v}</p>
                                <p className="text-xs">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links (right) */}
                <div className="justify-self-end text-right">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-lg md:text-xl text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="text-[15px] md:text-base hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © MachMangsho.dev All Right Reserved.
            </p>
        </div>
    );
};

export default Footer;