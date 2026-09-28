import React, { useEffect, useState } from 'react';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setFadeOut(true);
                        setTimeout(onComplete, 500);
                    }, 300);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Logo Animation */}
            <div className="relative mb-8">
                <div className="text-4xl md:text-6xl font-bold font-mono text-indigo-400 animate-pulse">
                    &lt;Dev /&gt;
                </div>
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>

            {/* Loading Text */}
            <p className="mt-4 text-neutral-500 text-sm font-mono">
                Loading<span className="animate-pulse">...</span>
            </p>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-500/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Preloader;
