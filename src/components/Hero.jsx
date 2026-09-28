import React, { useState, useEffect } from 'react';
import { useParallax } from '../hooks/useScrollAnimation';

const TypewriterText = ({ words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = words[currentWordIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < word.length) {
                    setCurrentText(word.slice(0, currentText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                if (currentText.length > 0) {
                    setCurrentText(word.slice(0, currentText.length - 1));
                } else {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className="text-indigo-400">
            {currentText}
            <span className="typewriter-cursor text-indigo-400">|</span>
        </span>
    );
};

const Hero = () => {
    const parallaxOffset = useParallax(0.3);

    const roles = [
        "Web Developer",
        "Python Developer",
        "OCR Specialist",
        "AI Enthusiast"
    ];

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent pt-16">
            {/* Animated Background Gradients with Parallax */}
            <div
                className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] -z-10 animate-pulse"
                style={{ transform: `translate(-50%, ${parallaxOffset}px)` }}
            ></div>
            <div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px] -z-10"
                style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
            ></div>
            <div
                className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[150px] -z-10"
                style={{ transform: `translateY(${-parallaxOffset * 0.3}px)` }}
            ></div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400/40 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${4 + Math.random() * 6}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="text-center px-6 max-w-4xl mx-auto relative z-10">
                {/* Greeting with wave */}
                <div className="mb-6 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
                    <span className="text-2xl md:text-3xl inline-block animate-wave mr-3">👋</span>
                    <span className="text-sm md:text-base font-display font-semibold tracking-widest text-indigo-400 uppercase">
                        Welcome to my portfolio
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-6 leading-tight tracking-tight opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
                    Hi, I'm{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                        Gautam Gupta
                    </span>
                </h1>

                {/* Typewriter Effect */}
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-neutral-300 mb-8 opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
                    I'm a <TypewriterText words={roles} />
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeIn_1s_ease-out_0.7s_forwards]">
                    B.Tech in Information Technology Student. Passionate about building high-performance web applications and working with technologies like OCR and OpenCV.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
                    <a
                        href="#projects"
                        className="group px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 flex items-center gap-2"
                    >
                        View My Work
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3.5 border border-neutral-700 hover:border-indigo-500 hover:text-indigo-400 text-neutral-300 rounded-full font-medium transition-all hover:bg-indigo-500/10"
                    >
                        Contact Me
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-6 mt-12 opacity-0 animate-[fadeIn_1s_ease-out_1.1s_forwards]">
                    <a
                        href="https://github.com/gautamgupta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-all hover:scale-110 transform p-2 hover:bg-neutral-800/50 rounded-full"
                    >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/gautam-gupta-620559285"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-all hover:scale-110 transform p-2 hover:bg-neutral-800/50 rounded-full"
                    >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    <a
                        href="mailto:gautamguptaworkin@gmail.com"
                        className="text-neutral-400 hover:text-white transition-all hover:scale-110 transform p-2 hover:bg-neutral-800/50 rounded-full"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <div className="flex flex-col items-center gap-2 text-neutral-500">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <div className="w-6 h-10 border-2 border-neutral-700 rounded-full flex justify-center pt-2">
                        <div className="w-1.5 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="wave-divider">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.65,118.92,150.18,71.67,321.39,56.44Z" fill="rgb(23 23 23)"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
