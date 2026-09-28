import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    const colors = {
        success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
        error: 'bg-red-500/20 border-red-500/50 text-red-400',
        info: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
    };

    return (
        <div
            className={`fixed bottom-24 right-8 z-[60] flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 ${colors[type]} ${isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
                }`}
        >
            <span className="shrink-0">{icons[type]}</span>
            <p className="font-medium text-sm">{message}</p>
            <button
                onClick={handleClose}
                className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Toast;
