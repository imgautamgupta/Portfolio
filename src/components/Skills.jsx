import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Skills = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation(0.1);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const skills = [
        {
            name: "Python",
            category: "Language",
            description: "Data Analysis, Automation, Scripting",
            level: 85,
            icon: "🐍",
            color: "from-yellow-500 to-green-500"
        },
        {
            name: "OCR & OpenCV",
            category: "Technology",
            description: "Tesseract, Document Analysis, Fraud Detection",
            level: 80,
            icon: "👁️",
            color: "from-blue-500 to-cyan-500"
        },
        {
            name: "GitHub",
            category: "Tools",
            description: "Version Control, Collaboration, CI/CD",
            level: 90,
            icon: "🔧",
            color: "from-gray-500 to-gray-700"
        },
        {
            name: "JavaScript",
            category: "Language",
            description: "ES6+, Async/Await, DOM Manipulation",
            level: 85,
            icon: "⚡",
            color: "from-yellow-400 to-orange-500"
        },
        {
            name: "React",
            category: "Frontend",
            description: "Hooks, Redux, Context API, Next.js",
            level: 80,
            icon: "⚛️",
            color: "from-cyan-400 to-blue-500"
        },
        {
            name: "Tailwind CSS",
            category: "Styling",
            description: "Responsive Design, Animations, UI/UX",
            level: 90,
            icon: "🎨",
            color: "from-teal-400 to-cyan-400"
        }
    ];

    return (
        <section id="skills" className="py-24 bg-transparent relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative" ref={sectionRef}>
                {/* Section Header */}
                <div className={`text-center mb-16 animate-on-scroll ${sectionVisible ? 'visible' : ''}`}>
                    <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">What I Know</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tech Stack</span>
                    </h2>
                    <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
                        Technologies and tools I've been working with recently
                    </p>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, index) => (
                        <div
                            key={index}
                            className={`animate-on-scroll stagger-${index + 1} ${sectionVisible ? 'visible' : ''}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className={`relative p-6 rounded-xl border transition-all duration-500 h-full ${hoveredIndex === index
                                ? 'bg-neutral-800/80 border-indigo-500/50 shadow-xl shadow-indigo-500/10 -translate-y-2'
                                : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                                }`}>
                                {/* Glow effect on hover */}
                                {hoveredIndex === index && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl blur-xl -z-10"></div>
                                )}

                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{skill.icon}</span>
                                        <div>
                                            <h3 className={`text-lg font-bold transition-colors ${hoveredIndex === index ? 'text-indigo-400' : 'text-white'
                                                }`}>
                                                {skill.name}
                                            </h3>
                                            <span className="text-xs text-neutral-500">{skill.category}</span>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${hoveredIndex === index ? 'text-indigo-400' : 'text-neutral-500'
                                        }`}>
                                        {skill.level}%
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-neutral-400 text-sm mb-6">{skill.description}</p>

                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                                        style={{
                                            width: sectionVisible ? `${skill.level}%` : '0%',
                                            transitionDelay: `${index * 100 + 300}ms`
                                        }}
                                    ></div>
                                </div>

                                {/* Decorative corner */}
                                <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl transition-opacity ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${skill.color} opacity-10 transform rotate-45 translate-x-16 -translate-y-16`}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Skills Tags */}
                <div className={`mt-12 text-center animate-on-scroll ${sectionVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.8s' }}>
                    <p className="text-neutral-500 text-sm mb-4">Also comfortable with:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git', 'VS Code', 'Figma', 'Linux'].map((tag, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-800/50 rounded-full border border-neutral-700/50 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
