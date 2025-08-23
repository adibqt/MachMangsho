import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import axios from "axios";

// A smart, multi-stage transition: processing -> success -> redirect with progress
const Loading = () => {
    const { navigate, setCartItems } = useAppContext();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextUrl = query.get('next') || '/my-orders';
    const sessionId = query.get('session_id');

    // stages: 'processing' | 'success' | 'redirect'
    const [stage, setStage] = useState(sessionId ? 'processing' : 'redirect');
    const [progress, setProgress] = useState(0);
    const navigated = useRef(false);

    // Verify Stripe session if present
    useEffect(() => {
        let cancelled = false;
        const verify = async () => {
            if (!sessionId) {
                // no verification needed, move to redirect stage
                setStage('redirect');
                return;
            }
            try {
                const { data } = await axios.post('/api/order/verify-payment', { sessionId });
                if (cancelled) return;
                if (data?.success) {
                    // Clear cart locally for immediate UX
                    setCartItems({});
                    // brief success flash before redirect
                    setStage('success');
                    setTimeout(() => !cancelled && setStage('redirect'), 700);
                } else {
                    // Even if not confirmed, continue UX to redirect
                    setStage('redirect');
                }
            } catch (e) {
                console.error('Payment verify failed', e?.response?.data || e?.message);
                setStage('redirect');
            }
        };
        verify();
        return () => { cancelled = true; };
    }, [sessionId, setCartItems]);

    // Handle redirect stage: animate progress then navigate
    useEffect(() => {
        if (stage !== 'redirect' || navigated.current) return;
        // kick off progress bar animation
        const start = setTimeout(() => setProgress(100), 50);
        const done = setTimeout(() => {
            if (!navigated.current) {
                navigated.current = true;
                navigate(nextUrl);
            }
        }, 1300);
        return () => {
            clearTimeout(start);
            clearTimeout(done);
        };
    }, [stage, nextUrl, navigate]);

    return (
        <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden">
            {/* Subtle animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-pulse opacity-70" />

            {/* Card */}
            <div className="relative z-10 w-[min(92vw,460px)] rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-sm p-8">
                {/* Processing spinner */}
                {stage === 'processing' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-500" />
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">Confirming payment…</p>
                            <p className="text-sm text-gray-500">Please wait a moment</p>
                        </div>
                    </div>
                )}

                {/* Success checkmark */}
                {stage === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                            <svg
                                className="h-10 w-10 text-green-500"
                                viewBox="0 0 52 52"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="26" cy="26" r="25" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                                <path
                                    d="M14 27.5 L22 35 L38 18"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="check-path"
                                />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">Payment successful</p>
                            <p className="text-sm text-gray-500">Preparing your orders page…</p>
                        </div>
                    </div>
                )}

                {/* Redirect with progress bar */}
                {stage === 'redirect' && (
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-lg font-semibold text-gray-800">Redirecting…</p>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                                style={{ width: `${progress}%`, transition: 'width 1.2s ease-in-out' }}
                            />
                        </div>
                        <p className="text-sm text-gray-500">Taking you to My Orders</p>
                    </div>
                )}
            </div>

            {/* Local styles for checkmark path animation */}
            <style>{`
                .check-path {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    animation: draw-check 650ms ease-out forwards;
                }
                @keyframes draw-check {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};

export default Loading;