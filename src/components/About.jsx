import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation(0.1);
    const [imageRef, imageVisible] = useScrollAnimation(0.2);
    const [contentRef, contentVisible] = useScrollAnimation(0.2);

    return (
        <section id="about" className="py-24 bg-transparent text-neutral-300 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

            <div className="max-w-6xl mx-auto px-6" ref={sectionRef}>
                {/* Section Header */}
                <div className={`text-center mb-16 animate-on-scroll ${sectionVisible ? 'visible' : ''}`}>
                    <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Get to know me</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Me</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Image Section */}
                    <div
                        ref={imageRef}
                        className={`animate-on-scroll-left ${imageVisible ? 'visible' : ''}`}
                    >
                        <div className="relative group">
                            {/* Decorative frame */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

                            <div className="aspect-square rounded-2xl bg-neutral-800 overflow-hidden relative shadow-2xl shadow-indigo-500/10 border border-neutral-700/50">
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent z-10"></div>
                                <img
                                    src="/avatar.png"
                                    alt="Developer"
                                    className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                                />

                                {/* Overlay info */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-white font-medium">Available for opportunities</span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Content Section */}
                    <div
                        ref={contentRef}
                        className={`space-y-8 animate-on-scroll-right ${contentVisible ? 'visible' : ''}`}
                    >
                        {/* Journey */}
                        <div className="glass-enhanced rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </span>
                                My Journey
                            </h3>
                            <p className="text-neutral-400 leading-relaxed">
                                I am an Information Technology student at ITM UNIVERSE, Sithouli Gwalior, Madhya Pradesh, India.
                                I have a strong focus on Web Development and Python technologies, including Optical Character Recognition (OCR) and OpenCV.
                            </p>
                        </div>

                        {/* Experience */}
                        <div className="glass-enhanced rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                Experience
                            </h3>
                            <div className="space-y-6">
                                {/* Shaeryl Data Tech */}
                                <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:to-purple-500">
                                    <div className="absolute left-0 top-1 w-2 h-2 bg-indigo-500 rounded-full -translate-x-[3px]"></div>
                                    <h4 className="text-base font-semibold text-white">AI/ML Developer Intern</h4>
                                    <p className="text-indigo-400 text-sm font-medium">Shaeryl Data Tech Pvt. Ltd.</p>
                                    <ul className="text-neutral-400 text-sm mt-2 space-y-1.5 list-disc list-inside">
                                        <li>Built an AI pipeline using Python, Tesseract OCR, OpenCV and LayoutLM for document text and layout extraction.</li>
                                        <li>Implemented fraud detection models with Scikit-learn and XGBoost to identify anomalous patterns across documents.</li>
                                        <li>Added model explainability using SHAP and LIME to highlight key fraud indicators.</li>
                                    </ul>
                                </div>

                                {/* OctaNet Services */}
                                <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-pink-500">
                                    <div className="absolute left-0 top-1 w-2 h-2 bg-purple-500 rounded-full -translate-x-[3px]"></div>
                                    <h4 className="text-base font-semibold text-white">Web Developer Intern</h4>
                                    <p className="text-purple-400 text-sm font-medium">OctaNet Services Pvt. Ltd.</p>
                                    <ul className="text-neutral-400 text-sm mt-2 space-y-1.5 list-disc list-inside">
                                        <li>Developed responsive web pages using HTML and CSS, ensuring cross-browser compatibility and mobile-friendly layouts.</li>
                                        <li>Implemented interactive features and form validations using JavaScript to enhance user experience.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="glass-enhanced rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                </span>
                                Education
                            </h3>
                            <div className="space-y-3">
                                {/* B.Tech */}
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-indigo-400 font-bold text-xs">B.Tech</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Bachelor of Technology in Information Technology</h4>
                                        <p className="text-neutral-400 text-xs">I.T.M. Gwalior (Affiliated to RGPV Bhopal)</p>
                                    </div>
                                </div>
                                {/* Class 12 */}
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-purple-400 font-bold text-xs">XII</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Class 12 – MP Board</h4>
                                        <p className="text-neutral-400 text-xs">Maa Pitambra Higher Secondary School, Dabra</p>
                                    </div>
                                </div>
                                {/* Class 10 */}
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors">
                                    <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-pink-400 font-bold text-xs">X</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Class 10 – CBSE</h4>
                                        <p className="text-neutral-400 text-xs">St. Paul's School, Gwalior</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="glass-enhanced rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </span>
                                Certifications
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Zscaler Academy: Cybersecurity Fundamentals Associate",
                                    "Zscaler Academy: Zero Trust Associate (ZTCA)",
                                    "Shaeryl Data Tech: Web Developer",
                                    "EduSkills Academy: Python Full Stack",
                                    "EduSkills PaloAlto: Cybersecurity Virtual Internship",
                                    "Octanet Services: Python Development Internship"
                                ].map((cert, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                                    >
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
