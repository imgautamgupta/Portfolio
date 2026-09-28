import React, { useEffect, useState } from 'react';

const BackgroundStars = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const starCount = 150;
        const newStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * 2 + 1}px`,
            delay: `${Math.random() * 5}s`,
            duration: `${Math.random() * 3 + 2}s`,
            opacity: Math.random() * 0.7 + 0.3,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-neutral-950">
            {/* Dark gradient for galaxy depth */}
            <div className="absolute inset-0 bg-radial-gradient from-indigo-950/20 via-neutral-950 to-neutral-950 opacity-60"></div>

            {/* Twinkling Stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        animationDelay: star.delay,
                        animationDuration: star.duration,
                        boxShadow: `0 0 ${parseInt(star.size) * 2}px rgba(255, 255, 255, 0.8)`,
                    }}
                ></div>
            ))}

            {/* Distant Nebulae (Subtle purple/blue glows) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '15s' }}></div>
        </div>
    );
};

export default BackgroundStars;
