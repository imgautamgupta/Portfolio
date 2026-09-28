/**
 * Skills.jsx — Rebuilt: percentage bars replaced with proof-of-use sentences.
 *
 * Changes from previous version:
 *   - Removed `level` field and progress-bar block entirely.
 *   - Replaced emoji icons with react-icons/si brand icons (currentColor).
 *   - Replaced useScrollAnimation (IntersectionObserver) with GSAP ScrollTrigger.
 *   - Removed two blurred gradient blobs (bg-indigo-600/10, bg-purple-600/10).
 *   - Removed decorative rotated-gradient corner element from cards.
 *   - Kept hover border/background interaction.
 *   - "Also comfortable with" row moved onto GSAP ScrollTrigger.
 *   - Each skill has a real, specific usage sentence sourced from About.jsx
 *     and projects.js — no fabricated metrics or unfalsifiable numbers.
 */

import React, { useRef, useState } from 'react';
import {
  SiPython,
  SiOpencv,
  SiGithub,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
} from 'react-icons/si';
import { gsap } from '../animation/gsap';
import { ScrollTrigger } from '../animation/gsap';
import useGSAP from '../animation/hooks/useGSAP';
import useReducedMotion from '../animation/hooks/useReducedMotion';

/* ─── Skill definitions ─────────────────────────────────────────────────────
   `proof` is one sentence grounded in About.jsx experience bullets
   and the projects.js data — no invented claims.
   `level` and progress bars are deliberately absent.
   Ordered by impact:
     1. Python, OCR & OpenCV (specialized computer vision & ML work)
     2. React, GitHub (concrete frontend & review-automation tooling)
     3. Next.js (full-stack headless integration)
     4. JavaScript, Tailwind CSS, Node.js, Express (supporting & backend foundations)
*/
const SKILLS = [
  {
    name:     'Python',
    category: 'Language',
    Icon:     SiPython,
    iconColor: '#3B82F6',   // blue-500 — neutral, non-emoji
    proof:
      'Primary language for the Loan Fraud Detection pipeline (XGBoost, Autoencoders, Scikit-learn) built during the Shaeryl Data Tech internship, and for CodeGuard\'s FastAPI backend.',
  },
  {
    name:     'OCR & OpenCV',
    category: 'Computer Vision',
    Icon:     SiOpencv,
    iconColor: '#5046E5',   // indigo
    proof:
      'Used Tesseract, EasyOCR, OpenCV and LayoutLM to build the document-processing pipeline in the Loan Fraud Detection project — extracting text and layout features from unstructured financial documents.',
  },
  {
    name:     'React',
    category: 'Frontend',
    Icon:     SiReact,
    iconColor: '#22D3EE',   // cyan-400
    proof:
      'Used to build this portfolio — component-driven layout with hooks, context and GSAP-driven animations layered over a Three.js canvas.',
  },
  {
    name:     'GitHub',
    category: 'Version Control',
    Icon:     SiGithub,
    iconColor: '#A3A3A3',   // neutral-400
    proof:
      'All projects hosted on GitHub; CodeGuard itself automates repository code-review workflows, integrating Pylint, Flake8 and Bandit checks over REST APIs.',
  },
  {
    name:     'Next.js',
    category: 'Framework',
    Icon:     SiNextdotjs,
    iconColor: '#F8FAFC',   // slate-50
    proof:
      'Used to build ABHI-MOH, a premium saree e-commerce site with Next.js, TypeScript and Wix Headless integration, and NeuroNest, a full-stack notes-and-bookmarks manager.',
  },
  {
    name:     'JavaScript',
    category: 'Language',
    Icon:     SiJavascript,
    iconColor: '#EAB308',   // yellow-500
    proof:
      'Used for interactive features and form validation during the OctaNet Services internship; also powers CodeGuard\'s browser frontend and REST API integration.',
  },
  {
    name:     'Tailwind CSS',
    category: 'Styling',
    Icon:     SiTailwindcss,
    iconColor: '#2DD4BF',   // teal-400
    proof:
      'Styling system used throughout this portfolio and applied at OctaNet Services to build responsive, cross-browser-compatible layouts with mobile-first design.',
  },
  {
    name:     'Node.js',
    category: 'Runtime',
    Icon:     SiNodedotjs,
    iconColor: '#22C55E',   // green-500
    proof:
      'Backend runtime for NeuroNest, handling data storage and API routes for the notes-and-bookmarks manager.',
  },
  {
    name:     'Express',
    category: 'Backend',
    Icon:     SiExpress,
    iconColor: '#94A3B8',   // slate-400
    proof:
      'Used alongside Node.js to build NeuroNest\'s REST API for managing notes and bookmarks.',
  },
];

const ALSO_COMFORTABLE = [
  'MongoDB', 'SQL', 'REST APIs',
  'Git', 'VS Code', 'Figma', 'Linux',
];

/* ═══════════════════════════════════════════════════════════════════════════ */

const Skills = () => {
  const sectionRef    = useRef(null);
  const headingRef    = useRef(null);
  const tagsRef       = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReduced = useReducedMotion();

  useGSAP(() => {
    if (prefersReduced) {
      gsap.set([
        '.skills-heading-inner',
        '.skill-card',
        tagsRef.current,
      ], { clearProps: 'all' });
      return;
    }

    // ── 1. Section heading — rising mask reveal ──────────────────────────
    gsap.fromTo(
      '.skills-heading-inner',
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 2. Skill cards — staggered slide-up ─────────────────────────────
    gsap.fromTo(
      '.skill-card',
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 3. "Also comfortable with" row ──────────────────────────────────
    gsap.fromTo(
      tagsRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tagsRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, {
    scope:        sectionRef,
    dependencies: [prefersReduced],
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 bg-transparent relative overflow-hidden"
    >
      {/*
        No gradient blobs. The two bg-indigo-600/10 and bg-purple-600/10
        decorative blurs have been removed entirely.
      */}

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* ── Section Header (mask-line reveal) ─────────────────────────── */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="mask-line">
            <span className="skills-heading-inner mask-line-inner text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">
              What I Know
            </span>
          </div>
          <div className="mask-line">
            <h2 className="skills-heading-inner mask-line-inner text-4xl md:text-5xl font-bold text-white">
              My{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Tech Stack
              </span>
            </h2>
          </div>
          <div className="mask-line mt-4">
            <p className="skills-heading-inner mask-line-inner text-neutral-400 max-w-2xl mx-auto">
              Technologies I've shipped production work with — each listed with how it was actually used.
            </p>
          </div>
        </div>

        {/* ── Skills Grid ───────────────────────────────────────────────── */}
        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill, index) => {
            const { name, category, Icon, iconColor, proof } = skill;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={name}
                className="skill-card"
                style={{ opacity: 0 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={[
                    'relative p-6 rounded-xl border transition-all duration-400 h-full',
                    isHovered
                      ? 'bg-neutral-800/80 border-indigo-500/50 shadow-xl shadow-indigo-500/10 -translate-y-1'
                      : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700',
                  ].join(' ')}
                >
                  {/* ── Card header: icon + name + category ─────────── */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="shrink-0"
                      style={{ color: isHovered ? iconColor : '#737373' /* neutral-500 */ }}
                    >
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3
                        className={[
                          'text-base font-semibold transition-colors',
                          isHovered ? 'text-indigo-400' : 'text-white',
                        ].join(' ')}
                      >
                        {name}
                      </h3>
                      <span className="text-xs text-neutral-500">{category}</span>
                    </div>
                  </div>

                  {/* ── Proof sentence ───────────────────────────────── */}
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {proof}
                  </p>

                  {/*
                    No progress bar.
                    No rotated gradient corner element.
                    No numeric level.
                  */}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Also comfortable with ────────────────────────────────────── */}
        <div
          ref={tagsRef}
          className="mt-12 text-center"
          style={{ opacity: 0 }}
        >
          <p className="text-neutral-500 text-sm mb-4">Also comfortable with:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {ALSO_COMFORTABLE.map((tag) => (
              <span
                key={tag}
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
