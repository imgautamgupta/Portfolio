/**
 * IntroOverlay.jsx
 *
 * Cinematic HTML/Typography overlay layer.
 * All elements start in a hidden initial state and are choreographed by GSAP.
 *
 * Visual hierarchy:
 *   - CORNER METADATA: Restrained, subtle film-like captions (top left & right).
 *   - IDENTITY REVEAL: "GAUTAM GUPTA" in editorial film-title typography with overflow clip.
 *   - SUBTITLE: "SOFTWARE ENGINEER" & "AI / ML — FULL STACK — SYSTEMS".
 *   - GALAXY IDENTITY: Subtle floating title as the galaxy forms.
 *   - SCROLL CUE: Minimalist prompt at the bottom.
 *   - CURTAIN: Full-bleed fade to seamlessly transition into the portfolio.
 */

const IntroOverlay = ({ refs }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        zIndex:        10,
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
    >
      {/* ── Top-Left Metadata (Scene 01: Void) ────────────────────── */}
      <div
        ref={refs.metaLeftRef}
        style={{
          position: 'absolute',
          top:      '2.4rem',
          left:     '2.4rem',
          opacity:  0,
        }}
      >
        <p style={{
          fontSize:      '0.55rem',
          letterSpacing: '0.42em',
          color:         '#52525b', /* zinc-600 */
          textTransform: 'uppercase',
          fontFamily:    '"Inter", system-ui, sans-serif',
          fontWeight:    500,
          margin:        0,
          lineHeight:    1.6,
        }}>
          GAUTAM GUPTA<br />
          <span style={{ color: '#3f3f46' }}>DIGITAL EXPERIENCE — 2026</span>
        </p>
      </div>

      {/* ── Top-Right Metadata (Scene 01: Void) ───────────────────── */}
      <div
        ref={refs.metaRightRef}
        style={{
          position:  'absolute',
          top:       '2.4rem',
          right:     '2.4rem',
          textAlign: 'right',
          opacity:   0,
        }}
      >
        <p style={{
          fontSize:      '0.55rem',
          letterSpacing: '0.38em',
          color:         '#3f3f46', /* zinc-700 */
          textTransform: 'uppercase',
          fontFamily:    '"Inter", system-ui, sans-serif',
          fontWeight:    500,
          margin:        0,
        }}>
          ORIGIN // 0.0.0
        </p>
      </div>

      {/* ── Center Identity: GAUTAM GUPTA (Scene 06) ──────────────── */}
      <div
        ref={refs.titleWrapRef}
        style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width:     '100%',
          padding:   '0 1.5rem',
        }}
      >
        {/* Line 1: GAUTAM */}
        <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingBottom: '0.08em' }}>
          <div
            ref={refs.nameGRef}
            style={{
              fontSize:      'clamp(3.4rem, 13vw, 13.5rem)',
              fontWeight:    900,
              fontFamily:    '"Outfit", "Inter", system-ui, sans-serif',
              color:         '#f8fafc',
              letterSpacing: '-0.035em',
              lineHeight:    0.88,
              userSelect:    'none',
              willChange:    'transform, opacity',
            }}
          >
            GAUTAM
          </div>
        </div>

        {/* Line 2: GUPTA */}
        <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingBottom: '0.08em' }}>
          <div
            ref={refs.nameGURef}
            style={{
              fontSize:      'clamp(3.4rem, 13vw, 13.5rem)',
              fontWeight:    900,
              fontFamily:    '"Outfit", "Inter", system-ui, sans-serif',
              color:         '#f8fafc',
              letterSpacing: '-0.035em',
              lineHeight:    0.88,
              userSelect:    'none',
              willChange:    'transform, opacity',
            }}
          >
            GUPTA
          </div>
        </div>

        {/* Editorial Subtitle */}
        <div
          ref={refs.subtitleRef}
          style={{ marginTop: '2.2rem', opacity: 0 }}
        >
          <p style={{
            fontSize:      'clamp(0.55rem, 1.1vw, 0.82rem)',
            letterSpacing: '0.45em',
            color:         '#94a3b8', /* slate-400 */
            textTransform: 'uppercase',
            fontFamily:    '"Inter", system-ui, sans-serif',
            fontWeight:    500,
            userSelect:    'none',
            margin:        0,
          }}>
            SOFTWARE ENGINEER
          </p>
        </div>

        {/* Subtle Discipline Metadata */}
        <div
          ref={refs.rolesRef}
          style={{ marginTop: '0.8rem', opacity: 0 }}
        >
          <p style={{
            fontSize:      'clamp(0.42rem, 0.75vw, 0.62rem)',
            letterSpacing: '0.35em',
            color:         '#52525b', /* zinc-600 */
            textTransform: 'uppercase',
            fontFamily:    '"Inter", system-ui, sans-serif',
            fontWeight:    400,
            userSelect:    'none',
            margin:        0,
          }}>
            AI&nbsp;/&nbsp;ML &nbsp;&mdash;&nbsp; FULL&nbsp;STACK &nbsp;&mdash;&nbsp; SYSTEMS
          </p>
        </div>
      </div>

      {/* ── Galaxy Scene Identity (Scene 08) ──────────────────────── */}
      <div
        ref={refs.galaxyTitleRef}
        style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width:     '100%',
          padding:   '0 2rem',
          opacity:   0,
        }}
      >
        <p style={{
          fontSize:      'clamp(0.85rem, 2.2vw, 1.6rem)',
          letterSpacing: '0.45em',
          color:         '#f1f5f9',
          fontFamily:    '"Outfit", "Inter", system-ui, sans-serif',
          fontWeight:    700,
          textTransform: 'uppercase',
          margin:        0,
          userSelect:    'none',
        }}>
          GAUTAM GUPTA
        </p>
        <p style={{
          fontSize:      'clamp(0.48rem, 0.9vw, 0.72rem)',
          letterSpacing: '0.40em',
          color:         '#64748b',
          fontFamily:    '"Inter", system-ui, sans-serif',
          textTransform: 'uppercase',
          marginTop:     '0.75rem',
          margin:        '0.75rem 0 0 0',
          userSelect:    'none',
        }}>
          INTERACTIVE PORTFOLIO
        </p>
      </div>

      {/* ── Bottom Scroll Prompt ─────────────────────────────────── */}
      <div
        ref={refs.scrollCueRef}
        style={{
          position:  'absolute',
          bottom:    '3rem',
          left:      '50%',
          transform: 'translateX(-50%)',
          opacity:   0,
          textAlign: 'center',
        }}
      >
        <p style={{
          fontSize:      '0.48rem',
          letterSpacing: '0.48em',
          color:         '#52525b',
          textTransform: 'uppercase',
          fontFamily:    '"Inter", system-ui, sans-serif',
          userSelect:    'none',
          margin:        0,
        }}>
          SCROLL&nbsp;TO&nbsp;ENTER
        </p>
      </div>

      {/* ── Final Exit Curtain ───────────────────────────────────── */}
      <div
        ref={refs.curtainRef}
        style={{
          position:      'absolute',
          inset:         0,
          background:    '#050508',
          opacity:       0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default IntroOverlay;
