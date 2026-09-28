import React, { useState, useEffect, useMemo } from "react";
import { useActiveSection } from "../hooks/useScrollAnimation";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sectionIds = useMemo(() => ["home", "about", "skills", "projects", "contact"], []);
    const activeSection = useActiveSection(sectionIds);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" },
    ];

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled
                ? "bg-neutral-950/80 backdrop-blur-xl border-b border-indigo-500/20 py-3 shadow-lg shadow-indigo-500/5"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a
                    href="#home"
                    onClick={(e) => handleNavClick(e, '#home')}
                    className="text-2xl font-bold font-mono tracking-tighter text-indigo-400 hover:text-indigo-300 transition-colors relative group"
                >
                    &lt;Dev /&gt;
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.href.slice(1);
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`text-sm font-medium transition-all uppercase tracking-wider relative group ${isActive
                                    ? 'text-indigo-400'
                                    : 'text-neutral-300 hover:text-indigo-400'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                            </a>
                        );
                    })}
                </div>

                {/* Resume Button - Desktop */}
                <a
                    href="/RESUME.pdf"
                    download
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 rounded-lg hover:bg-indigo-600/30 hover:border-indigo-400 transition-all text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resume
                </a>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-neutral-300 hover:text-white focus:outline-none p-2 hover:bg-neutral-800/50 rounded-lg transition-colors"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}>
                <div className="bg-neutral-900/95 backdrop-blur-xl border-t border-indigo-500/10 shadow-xl">
                    <div className="flex flex-col p-6 space-y-4">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.slice(1);
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`font-medium py-2 transition-colors ${isActive ? 'text-indigo-400' : 'text-neutral-300 hover:text-indigo-400'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
                        <a
                            href="/RESUME.pdf"
                            download
                            className="flex items-center gap-2 mt-4 px-4 py-3 bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 rounded-lg text-center justify-center font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Resume
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
