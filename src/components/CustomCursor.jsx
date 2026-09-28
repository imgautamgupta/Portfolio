import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsPointer(isClickable);
        };

        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Only show on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return null;
    }

    return (
        <>
            {/* Main cursor dot */}
            <div
                className={`fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ${isHidden ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    left: position.x,
                    top: position.y,
                    transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`
                }}
            >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${isPointer ? 'scale-150' : 'scale-100'}`}></div>
            </div>

            {/* Trailing circle */}
            <div
                className={`fixed pointer-events-none z-[9998] transition-all duration-300 ease-out ${isHidden ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    left: position.x,
                    top: position.y,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div
                    className={`w-10 h-10 border border-indigo-400/50 rounded-full transition-all duration-300 ${isPointer ? 'scale-150 border-indigo-400' : 'scale-100'} ${isClicking ? 'scale-75' : ''}`}
                ></div>
            </div>
        </>
    );
};

export default CustomCursor;
