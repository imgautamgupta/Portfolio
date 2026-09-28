/**
 * IntroFallback.jsx
 *
 * CSS-only opening sequence used when WebGL is unavailable.
 * Preserves the cinematic identity without any Three.js / GPU dependency.
 *
 * Behaviour:
 *  - Elements animate in automatically via CSS keyframes (not scroll-driven).
 *  - After ~5 s an "ENTER" button appears; clicking it dismisses the overlay.
 *  - After 8 s the overlay auto-dismisses if the user hasn't clicked.
 */

import { useEffect, useRef } from 'react';
import { gsap } from '../../animation/gsap';

const IntroFallback = ({ onComplete }) => {
  const containerRef = useRef(null);
  const nameGRef     = useRef(null);
  const nameGURef    = useRef(null);
  const subtitleRef  = useRef(null);
  const rolesRef     = useRef(null);
  const enterRef     = useRef(null);
  const metaRef      = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Brief hold, then cascade in
      const tl = gsap.timeline({ delay: 0.6 });

      tl.fromTo(metaRef.current,
        { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'none' }, 0)

        .fromTo(nameGRef.current,
          { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 0.8)
        .fromTo(nameGURef.current,
          { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 1.0)

        .fromTo(subtitleRef.current,
          { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'none' }, 2.0)
        .fromTo(rolesRef.current,
          { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'none' }, 2.6)

        .fromTo(enterRef.current,
          { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'none' }, 4.2);

      // Auto-dismiss after 8 s
      const autoTimer = setTimeout(() => onComplete?.(), 8000);
      return () => clearTimeout(autoTimer);
    });

    return () => ctx.revert();
  }, [onComplete]);

  const handleEnter = () => {
    gsap.to(containerRef.current, {
      opacity: 0, duration: 0.6, ease: 'power2.in',
      onComplete: onComplete,
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position:   'absolute',
        inset:      0,
        background: '#050508',
        display:    'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent: 'center',
        zIndex:     11,
      }}
    >
      {/* Corner meta */}
      <div
        ref={metaRef}
        style={{ position: 'absolute', top: '2.2rem', left: '2.2rem', opacity: 0 }}
      >
        <p style={{
          fontSize: '0.47rem', letterSpacing: '0.38em',
          color: '#374151', textTransform: 'uppercase',
          fontFamily: '"Inter", system-ui, sans-serif', margin: 0,
        }}>
          GG — PORTFOLIO — 2026
        </p>
      </div>

      {/* Name */}
      <div style={{ textAlign: 'center', padding: '0 1.5rem' }}>
        <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingBottom: '0.05em' }}>
          <div ref={nameGRef} style={{
            fontSize: 'clamp(3.2rem, 12.5vw, 13rem)',
            fontWeight: 900,
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            color: '#ffffff', letterSpacing: '-0.03em',
            lineHeight: 0.88, userSelect: 'none',
          }}>GAUTAM</div>
        </div>
        <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingBottom: '0.05em' }}>
          <div ref={nameGURef} style={{
            fontSize: 'clamp(3.2rem, 12.5vw, 13rem)',
            fontWeight: 900,
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            color: '#ffffff', letterSpacing: '-0.03em',
            lineHeight: 0.88, userSelect: 'none',
          }}>GUPTA</div>
        </div>

        <div ref={subtitleRef} style={{ marginTop: '2rem', opacity: 0 }}>
          <p style={{
            fontSize: 'clamp(0.5rem, 0.9vw, 0.78rem)', letterSpacing: '0.42em',
            color: '#6b7280', textTransform: 'uppercase',
            fontFamily: '"Inter", system-ui, sans-serif', margin: 0,
          }}>SOFTWARE ENGINEER</p>
        </div>

        <div ref={rolesRef} style={{ marginTop: '0.75rem', opacity: 0 }}>
          <p style={{
            fontSize: 'clamp(0.42rem, 0.65vw, 0.6rem)', letterSpacing: '0.3em',
            color: '#374151', textTransform: 'uppercase',
            fontFamily: '"Inter", system-ui, sans-serif', margin: 0,
          }}>
            AI / ML &mdash; FULL STACK &mdash; ENGINEERING
          </p>
        </div>
      </div>

      {/* Enter button */}
      <button
        ref={enterRef}
        onClick={handleEnter}
        style={{
          position:        'absolute',
          bottom:          '3.5rem',
          left:            '50%',
          transform:       'translateX(-50%)',
          opacity:         0,
          background:      'transparent',
          border:          'none',
          cursor:          'pointer',
          padding:         '0.5rem 1rem',
          pointerEvents:   'all',
        }}
      >
        <p style={{
          fontSize: '0.47rem', letterSpacing: '0.48em',
          color: '#374151', textTransform: 'uppercase',
          fontFamily: '"Inter", system-ui, sans-serif', margin: 0,
        }}>
          ENTER PORTFOLIO
        </p>
      </button>
    </div>
  );
};

export default IntroFallback;
