import React, { useState, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projects';

const ProjectCard = ({ project, index, isVisible }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setTransform({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0 });
    };

    return (
        <div
            ref={cardRef}
            className={`animate-on-scroll-scale stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <div className="group h-full bg-neutral-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-700/50 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent z-10"></div>
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />

                    {/* Overlay buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <a
                            href={project.github}
                            className="p-3 bg-neutral-900/90 backdrop-blur-sm rounded-full border border-neutral-700 hover:border-indigo-500 hover:bg-indigo-600 transition-all transform hover:scale-110"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a
                            href={project.link}
                            className="p-3 bg-indigo-600 rounded-full border border-indigo-500 hover:bg-indigo-500 transition-all transform hover:scale-110"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>

                    {/* Featured badge */}
                    {project.featured && (
                        <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                                Featured
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 4).map((tag, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 text-xs font-medium text-indigo-300 bg-indigo-500/10 rounded-full border border-indigo-500/20"
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 4 && (
                            <span className="px-2.5 py-1 text-xs font-medium text-neutral-400 bg-neutral-700/50 rounded-full">
                                +{project.tags.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-400 text-sm line-clamp-3 mb-4">
                        {project.description}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-700/50">
                        <a
                            href={project.github}
                            className="text-neutral-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors group/link"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span className="group-hover/link:underline">View Code</span>
                        </a>
                        <a
                            href={project.link}
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2 transition-colors group/link"
                        >
                            <span className="group-hover/link:underline">Live Demo</span>
                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation(0.1);
    const [filter, setFilter] = useState('all');

    const categories = PROJECT_CATEGORIES;

    const filteredProjects = filter === 'all'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === filter);

    return (
        <section id="projects" className="py-24 bg-transparent relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative" ref={sectionRef}>
                {/* Section Header */}
                <div className={`text-center mb-12 animate-on-scroll ${sectionVisible ? 'visible' : ''}`}>
                    <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">My Work</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Projects</span>
                    </h2>
                    <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
                        Here are some of my recent projects that showcase my skills and passion for development
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className={`flex flex-wrap justify-center gap-2 mb-12 animate-on-scroll ${sectionVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            index={index}
                            isVisible={sectionVisible}
                        />
                    ))}
                </div>

                {/* View More */}
                <div className={`text-center mt-12 animate-on-scroll ${sectionVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
                    <a
                        href="https://github.com/imgautamgupta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 hover:border-indigo-500 text-neutral-300 hover:text-indigo-400 rounded-full font-medium transition-all hover:bg-indigo-500/10"
                    >
                        View All Projects on GitHub
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Projects;
