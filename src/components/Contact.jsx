import React, { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Toast from './Toast';

const Contact = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation(0.1);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setToast({
            message: "Message sent successfully! I'll get back to you soon.",
            type: 'success'
        });
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
    };

    const contactInfo = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            label: 'Email',
            value: 'gautamguptaworkin@gmail.com',
            href: 'mailto:gautamguptaworkin@gmail.com'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: 'Location',
            value: 'Gwalior, Madhya Pradesh, India',
            href: null
        }
    ];

    const socials = [
        {
            name: 'GitHub',
            href: 'https://github.com/gautamgupta',
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/in/gautam-gupta-620559285',
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            )
        },
        {
            name: 'Twitter',
            href: '#',
            icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        }
    ];

    return (
        <section id="contact" className="py-24 bg-transparent relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative" ref={sectionRef}>
                {/* Section Header */}
                <div className={`text-center mb-16 animate-on-scroll ${sectionVisible ? 'visible' : ''}`}>
                    <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Get In Touch</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Let's Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Together</span>
                    </h2>
                    <p className="text-neutral-400 mt-4 max-w-xl mx-auto">
                        Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new projects and creative ideas.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className={`animate-on-scroll-left ${sectionVisible ? 'visible' : ''}`}>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                                <div className="space-y-4">
                                    {contactInfo.map((info, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-indigo-500/30 transition-colors group">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                                                {info.icon}
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 text-sm">{info.label}</p>
                                                {info.href ? (
                                                    <a href={info.href} className="text-white hover:text-indigo-400 transition-colors font-medium">
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-white font-medium">{info.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Connect with me</h4>
                                <div className="flex gap-3">
                                    {socials.map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-neutral-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-indigo-600/20"
                                            aria-label={social.name}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Card */}
                            <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 font-medium">Currently Available</span>
                                </div>
                                <p className="text-neutral-300 text-sm">
                                    I'm open to freelance projects and full-time opportunities. Let's build something amazing together!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`animate-on-scroll-right ${sectionVisible ? 'visible' : ''}`}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">
                                    Your Name
                                </label>
                                <div className={`relative transition-all ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className="w-full px-5 py-4 bg-neutral-900/80 border border-neutral-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        placeholder="John Doe"
                                    />
                                    {focusedField === 'name' && (
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-xl -z-10 blur-xl"></div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                                    Email Address
                                </label>
                                <div className={`relative transition-all ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className="w-full px-5 py-4 bg-neutral-900/80 border border-neutral-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        placeholder="john@example.com"
                                    />
                                    {focusedField === 'email' && (
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-xl -z-10 blur-xl"></div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">
                                    Your Message
                                </label>
                                <div className={`relative transition-all ${focusedField === 'message' ? 'scale-[1.02]' : ''}`}>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        className="w-full px-5 py-4 bg-neutral-900/80 border border-neutral-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                        placeholder="Tell me about your project..."
                                    ></textarea>
                                    {focusedField === 'message' && (
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-xl -z-10 blur-xl"></div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 transform hover:-translate-y-1 hover:shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className={`mt-20 pt-8 border-t border-neutral-800 animate-on-scroll ${sectionVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-neutral-500 text-sm">
                            &copy; {new Date().getFullYear()} Gautam Gupta. All rights reserved.
                        </p>

                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </section>
    );
};

export default Contact;
