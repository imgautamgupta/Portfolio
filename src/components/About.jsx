/**
 * About.jsx — Rebuilt presentation, all facts verbatim from original.
 *
 * Key changes from previous version:
 *   - Removed the two blurred gradient blobs (bg-indigo-600/5, bg-purple-600/5).
 *   - Removed useScrollAnimation (IntersectionObserver) — replaced with GSAP
 *     ScrollTrigger via the project's useGSAP hook.
 *   - Section heading + Journey paragraph use .mask-line rising-text reveal.
 *   - Removed identical glass-card treatment from all four blocks; each block
 *     has a distinct visual register to match its importance:
 *       Journey    → editorial text, no card chrome
 *       Experience → vertical timeline (kept + refined from original)
 *       Education  → quiet ruled list
 *       Certifications → compact pill grid, no card wrapper
 *   - Profile image: no hover gradient glow, no grayscale effect. "Available
 *     for opportunities" badge enters via ScrollTrigger, staggered after image.
 *   - Two-column layout (image left / content right) preserved.
 */

import React, { useRef } from 'react';
import { gsap } from '../animation/gsap';
import { ScrollTrigger } from '../animation/gsap';
import useGSAP from '../animation/hooks/useGSAP';
import useReducedMotion from '../animation/hooks/useReducedMotion';

/* ─── Experience data (verbatim from original) ─────────────────────────────── */
const EXPERIENCE = [
  {
    role:    'AI/ML Developer Intern',
    company: 'Shaeryl Data Tech Pvt. Ltd.',
    accent:  'indigo',
    bullets: [
      'Built an AI pipeline using Python, Tesseract OCR, OpenCV and LayoutLM for document text and layout extraction.',
      'Implemented fraud detection models with Scikit-learn and XGBoost to identify anomalous patterns across documents.',
      'Added model explainability using SHAP and LIME to highlight key fraud indicators.',
    ],
  },
  {
    role:    'Web Developer Intern',
    company: 'OctaNet Services Pvt. Ltd.',
    accent:  'purple',
    bullets: [
      'Developed responsive web pages using HTML and CSS, ensuring cross-browser compatibility and mobile-friendly layouts.',
      'Implemented interactive features and form validations using JavaScript to enhance user experience.',
    ],
  },
];

/* ─── Education data (verbatim from original) ──────────────────────────────── */
const EDUCATION = [
  {
    label:    'B.Tech',
    color:    'indigo',
    degree:   'Bachelor of Technology in Information Technology',
    school:   'I.T.M. Gwalior (Affiliated to RGPV Bhopal)',
  },
  {
    label:    'XII',
    color:    'purple',
    degree:   'Class 12 – MP Board',
    school:   'Maa Pitambra Higher Secondary School, Dabra',
  },
  {
    label:    'X',
    color:    'pink',
    degree:   'Class 10 – CBSE',
    school:   "St. Paul's School, Gwalior",
  },
];

/* ─── Certifications (verbatim from original) ──────────────────────────────── */
const CERTS = [
  'Zscaler Academy: Cybersecurity Fundamentals Associate',
  'Zscaler Academy: Zero Trust Associate (ZTCA)',
  'Shaeryl Data Tech: Web Developer',
  'EduSkills Academy: Python Full Stack',
  'EduSkills PaloAlto: Cybersecurity Virtual Internship',
  'Octanet Services: Python Development Internship',
];

/* ─── Colour map (Tailwind arbitrary classes must be full strings) ─────────── */
const ACCENT = {
  indigo: {
    dot:    'bg-indigo-500',
    // Full before: chain as a static string — Tailwind can scan this
    before: 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-indigo-500 before:to-purple-500',
    text:   'text-indigo-400',
  },
  purple: {
    dot:    'bg-purple-500',
    before: 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-purple-500 before:to-pink-500',
    text:   'text-purple-400',
  },
  pink: {
    dot:    'bg-pink-500',
    before: 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-pink-500 before:to-rose-500',
    text:   'text-pink-400',
  },
};
const EDU_COLOR = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  pink:   { bg: 'bg-pink-500/10',   text: 'text-pink-400'   },
};

/* ═══════════════════════════════════════════════════════════════════════════ */

const About = () => {
  const sectionRef   = useRef(null);
  const imageRef     = useRef(null);
  const badgeRef     = useRef(null);
  const headingRef   = useRef(null);   // mask-line heading
  const journeyRef   = useRef(null);   // mask-line paragraph lines
  const expRef       = useRef(null);
  const eduRef       = useRef(null);
  const certRef      = useRef(null);

  const prefersReduced = useReducedMotion();

  useGSAP(() => {
    if (prefersReduced) {
      // Skip all motion; ensure everything is visible
      gsap.set([
        imageRef.current,
        badgeRef.current,
        '.about-heading-inner',
        '.about-journey-line',
        expRef.current,
        eduRef.current,
        certRef.current,
      ], { clearProps: 'all' });
      return;
    }

    // ── 1. Image: slide up from below ─────────────────────────────────────
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 2. Available badge: staggered after image ─────────────────────────
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 3. Section heading — rising mask reveal ───────────────────────────
    gsap.fromTo(
      '.about-heading-inner',
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

    // ── 4. Journey paragraph — line-by-line rising mask ───────────────────
    gsap.fromTo(
      '.about-journey-line',
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: journeyRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 5. Experience block: slide in from left ───────────────────────────
    gsap.fromTo(
      expRef.current,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: expRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 6. Experience timeline items: staggered ───────────────────────────
    gsap.fromTo(
      '.about-exp-item',
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: expRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 7. Education: staggered rows ──────────────────────────────────────
    gsap.fromTo(
      '.about-edu-row',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: eduRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // ── 8. Certification pills: staggered ────────────────────────────────
    gsap.fromTo(
      '.about-cert-pill',
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'back.out(1.4)',
        stagger: 0.07,
        scrollTrigger: {
          trigger: certRef.current,
          start: 'top 82%',
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
      id="about"
      ref={sectionRef}
      className="py-24 bg-transparent text-neutral-300 relative overflow-hidden"
    >
      {/*
        No gradient blobs here. The section relies on its own typography and
        layout for visual interest — no decorative blur layers.
      */}

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section Header (mask-line reveal) ─────────────────────────── */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="mask-line">
            <span className="about-heading-inner mask-line-inner text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4 block">
              Get to know me
            </span>
          </div>
          <div className="mask-line">
            <h2 className="about-heading-inner mask-line-inner text-4xl md:text-5xl font-bold text-white">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Me
              </span>
            </h2>
          </div>
        </div>

        {/* ── Two-column grid ───────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: Profile image ─────────────────────────────────────── */}
          <div ref={imageRef} style={{ opacity: 0 }}>
            {/*
              Simplified image treatment:
              - No hover gradient-glow frame (removed decorative -inset-4 blur div)
              - No grayscale-to-color transition
              - Clean border, subtle inner gradient only
            */}
            <div className="aspect-square rounded-2xl bg-neutral-800 overflow-hidden relative shadow-2xl border border-neutral-700/40">
              {/* Subtle bottom-up gradient for badge readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent z-10" />

              <img
                src="/avatar.png"
                alt="Gautam Gupta — developer portrait"
                className="w-full h-full object-cover"
              />

              {/* "Available" badge — enters via its own ScrollTrigger (see useGSAP above) */}
              <div
                ref={badgeRef}
                className="absolute bottom-0 left-0 right-0 p-6 z-20"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/90 text-sm font-medium tracking-wide">
                    Available for opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Content blocks ─────────────────────────────────── */}
          <div className="space-y-12">

            {/* ── Journey — editorial text, no card wrapper ──────────── */}
            <div ref={journeyRef}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400/70 mb-3 block">
                01 / My Journey
              </span>
              {/*
                Each sentence gets its own mask-line so GSAP can stagger
                the rise line-by-line.
              */}
              <div className="mask-line">
                <p className="about-journey-line mask-line-inner text-neutral-300 text-base leading-relaxed">
                  I am an Information Technology student at ITM UNIVERSE,
                  Sithouli Gwalior, Madhya Pradesh, India.
                </p>
              </div>
              <div className="mask-line mt-2">
                <p className="about-journey-line mask-line-inner text-neutral-400 text-base leading-relaxed">
                  I have a strong focus on Web Development and Python technologies,
                  including Optical Character Recognition (OCR) and OpenCV.
                </p>
              </div>
            </div>

            {/* ── Experience — vertical timeline ────────────────────── */}
            <div ref={expRef} style={{ opacity: 0 }}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400/70 mb-5 block">
                02 / Experience
              </span>

              <div className="space-y-8">
                {EXPERIENCE.map(({ role, company, accent, bullets }) => {
                  const a = ACCENT[accent] || ACCENT.indigo;
                  return (
                    <div
                      key={company}
                      className={`about-exp-item relative pl-5 ${a.before}`}
                      style={{ opacity: 0 }}
                    >
                      <div className={`absolute left-0 top-1.5 w-2 h-2 ${a.dot} rounded-full -translate-x-[3px]`} />
                      <h4 className="text-sm font-semibold text-white">{role}</h4>
                      <p className={`${a.text} text-xs font-medium mt-0.5 mb-2`}>{company}</p>
                      <ul className="text-neutral-400 text-sm space-y-1.5">
                        {bullets.map((b, i) => (
                          <li key={i} className="flex gap-2 leading-snug">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Education — quiet ruled list ──────────────────────── */}
            <div ref={eduRef}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400/70 mb-4 block">
                03 / Education
              </span>

              <div className="divide-y divide-neutral-800">
                {EDUCATION.map(({ label, color, degree, school }) => {
                  const ec = EDU_COLOR[color] || EDU_COLOR.indigo;
                  return (
                    <div
                      key={degree}
                      className="about-edu-row flex items-center gap-4 py-3"
                      style={{ opacity: 0 }}
                    >
                      <div className={`w-10 h-10 ${ec.bg} rounded-lg flex items-center justify-center shrink-0`}>
                        <span className={`${ec.text} font-bold text-xs`}>{label}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{degree}</h4>
                        <p className="text-neutral-500 text-xs mt-0.5">{school}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Certifications — compact pill grid ────────────────── */}
            <div ref={certRef}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400/70 mb-4 block">
                04 / Certifications
              </span>

              <div className="flex flex-wrap gap-2">
                {CERTS.map((cert, i) => (
                  <span
                    key={i}
                    className="about-cert-pill px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                    style={{ opacity: 0 }}
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

          </div>
          {/* end right column */}
        </div>
        {/* end grid */}
      </div>
    </section>
  );
};

export default About;
