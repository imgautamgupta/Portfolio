/**
 * CinematicIntro.jsx
 *
 * Master orchestrator for the revised cinematic opening sequence:
 * VOID → AWAKENING → GRAVITY → SILENCE → IDENTITY → EXPLOSION → GALAXY → ENTRY
 *
 * Key principles:
 *   - Scroll drives the single coordinated GSAP ScrollTrigger timeline.
 *   - NO random 3D shapes or blobs before the name — pure gravitational buildup.
 *   - "GAUTAM GUPTA" reveals with editorial film-title typography.
 *   - Particles react to the name, then explode outward in a radial shockwave.
 *   - The explosion curls tangentially into a deep procedural 3D spiral galaxy.
 *   - The camera enters and flies through the galaxy, transitioning into the portfolio.
 *   - Fully scrubbable forward and backward.
 *   - Zero per-frame React state re-renders.
 */

import { useRef, useMemo, useLayoutEffect, useEffect, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../animation/gsap';
import { isWebGLAvailable } from '../../utils/webgl';
import { getIntroConfig } from './introConfig';
import IntroCanvas   from './IntroCanvas';
import IntroOverlay  from './IntroOverlay';
import IntroFallback from './IntroFallback';

const CinematicIntro = () => {
  // ─── Config (computed once) ─────────────────────────────────────────────
  const config     = useMemo(() => getIntroConfig(), []);
  const webGLReady = useMemo(() => isWebGLAvailable(), []);

  // ─── DOM refs ───────────────────────────────────────────────────────────
  const spacerRef    = useRef(null);
  const containerRef = useRef(null);

  // ─── World state — mutated by GSAP, read by R3F useFrame ────────────────
  const worldStateRef = useRef({
    voidProgress: 0.0,
    gravity:      0.0,
    freeze:       0.0,
    nameReaction: 0.0,
    explosion:    0.0,
    galaxy:       0.0,
    enterGalaxy:  0.0,
    globalFade:   1.0,
    cameraX:      config.camera.start.x,
    cameraY:      config.camera.start.y,
    cameraZ:      config.camera.start.z,
  });

  // ─── Particle uniforms — exposed by ParticleField, read by SceneUpdater ──
  const uniformsRef = useRef(null);

  // ─── Overlay element refs ────────────────────────────────────────────────
  const metaLeftRef    = useRef(null);
  const metaRightRef   = useRef(null);
  const titleWrapRef   = useRef(null);
  const nameGRef       = useRef(null);
  const nameGURef      = useRef(null);
  const subtitleRef    = useRef(null);
  const rolesRef       = useRef(null);
  const galaxyTitleRef = useRef(null);
  const scrollCueRef   = useRef(null);
  const curtainRef     = useRef(null);

  const overlayRefs = {
    metaLeftRef,
    metaRightRef,
    titleWrapRef,
    nameGRef,
    nameGURef,
    subtitleRef,
    rolesRef,
    galaxyTitleRef,
    scrollCueRef,
    curtainRef,
  };

  // ─── Fallback completion handler ─────────────────────────────────────────
  const handleFallbackComplete = useCallback(() => {
    if (containerRef.current) containerRef.current.style.display = 'none';
    document.documentElement.removeAttribute('data-intro-active');
  }, []);

  // ─── Set initial GSAP states before first paint ─────────────────────────
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-intro-active', 'true');

    gsap.set([metaLeftRef.current, metaRightRef.current], { opacity: 0 });
    gsap.set([nameGRef.current, nameGURef.current], { yPercent: 110, opacity: 1 });
    gsap.set([subtitleRef.current, rolesRef.current], { opacity: 0 });
    gsap.set([galaxyTitleRef.current, scrollCueRef.current], { opacity: 0 });
    gsap.set(curtainRef.current, { opacity: 0 });
    if (titleWrapRef.current) {
      gsap.set(titleWrapRef.current, { opacity: 1, scale: 1, filter: 'blur(0px)' });
    }
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1, display: 'block' });
    }
  }, []);

  // ─── Main timeline setup ─────────────────────────────────────────────────
  useEffect(() => {
    if (!webGLReady) return;

    const ws = worldStateRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacerRef.current,
          start:   'top top',
          end:     'bottom top',
          scrub:   config.scrub,
          onLeave: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
            document.documentElement.removeAttribute('data-intro-active');
          },
          onEnterBack: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'block';
            }
            document.documentElement.setAttribute('data-intro-active', 'true');
          },
        },
      });

      if (!config.reduced) {
        // ── Scene 01: The Void (0.0 → 0.8) ─────────────────────────────────
        // Starts in space & silence; metadata gently fades in
        tl.to(metaLeftRef.current,  { opacity: 1, duration: 0.6, ease: 'none' }, 0.2)
          .to(metaRightRef.current, { opacity: 1, duration: 0.6, ease: 'none' }, 0.3);

        // ── Scene 02: The First Particles (0.7 → 2.0) ──────────────────────
        // The first ~15 solitary stars glimmer across depths
        tl.to(ws, { voidProgress: 0.35, duration: 1.3, ease: 'power1.out' }, 0.7)
          .to(ws, {
            cameraX: config.camera.awakening.x,
            cameraY: config.camera.awakening.y,
            cameraZ: config.camera.awakening.z,
            duration: 2.5,
            ease: 'power1.inOut',
          }, 0.7);

        // ── Scene 03: Particles Awaken (2.0 → 3.6) ─────────────────────────
        // Field awakens into expansive cosmic drifting dust
        tl.to(ws, { voidProgress: 1.0, duration: 1.6, ease: 'power1.inOut' }, 2.0);

        // ── Scene 04: Invisible Gravity (3.6 → 5.4) ────────────────────────
        // Matter accelerates inward along curved orbital streamlines around
        // an unseen center. No spheres, no shapes — raw gravitational motion.
        tl.to(ws, { gravity: 1.0, duration: 1.8, ease: 'power2.inOut' }, 3.6)
          .to(ws, {
            cameraX: config.camera.gravity.x,
            cameraY: config.camera.gravity.y,
            cameraZ: config.camera.gravity.z,
            duration: 1.8,
            ease: 'power1.inOut',
          }, 3.6);

        // ── Scene 05: The Silence Before Identity (5.4 → 6.2) ──────────────
        // Velocity drops by 94%; particles suspend in breathless anticipation
        tl.to(ws, { freeze: 1.0, duration: 0.8, ease: 'power2.out' }, 5.4)
          .to(ws, {
            cameraX: config.camera.name.x,
            cameraY: config.camera.name.y,
            cameraZ: config.camera.name.z,
            duration: 0.8,
            ease: 'power1.inOut',
          }, 5.4)
          .to([metaLeftRef.current, metaRightRef.current], {
            opacity: 0.35, duration: 0.5, ease: 'none',
          }, 5.4);

        // ── Scene 06: GAUTAM GUPTA (6.2 → 7.3) ─────────────────────────────
        // Identity reveal in editorial film-title typography
        tl.fromTo(nameGRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65, ease: 'power3.out' },
          6.2)
          .fromTo(nameGURef.current,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.65, ease: 'power3.out' },
            6.38)
          .to(subtitleRef.current, { opacity: 1, duration: 0.5, ease: 'none' }, 6.7)
          .to(rolesRef.current,    { opacity: 1, duration: 0.5, ease: 'none' }, 6.9)
          .to(ws, { nameReaction: 1.0, duration: 0.8, ease: 'power2.out' }, 6.4);

        // ── Scene 07: THE EXPLOSION (7.3 → 8.2) ────────────────────────────
        // Energy releases outward radially in an immense 3D shockwave!
        tl.to(ws, { explosion: 1.0, duration: 0.9, ease: 'power3.out' }, 7.3)
          .to(titleWrapRef.current, {
            opacity: 0, scale: 1.15, filter: 'blur(8px)', duration: 0.6, ease: 'power2.in',
          }, 7.35)
          .to(ws, {
            cameraX: config.camera.explosion.x,
            cameraY: config.camera.explosion.y,
            cameraZ: config.camera.explosion.z,
            duration: 0.9,
            ease: 'power2.out',
          }, 7.3);

        // ── Scene 08: Explosion Curves into Galaxy (8.2 → 9.2) ─────────────
        // Radial blast curls tangentially into procedural 3D spiral galaxy
        tl.to(ws, { galaxy: 1.0, duration: 1.0, ease: 'power2.inOut' }, 8.2)
          .to(ws, {
            cameraX: config.camera.galaxy.x,
            cameraY: config.camera.galaxy.y,
            cameraZ: config.camera.galaxy.z,
            duration: 1.0,
            ease: 'power1.inOut',
          }, 8.2)
          .to(galaxyTitleRef.current, { opacity: 1, duration: 0.6, ease: 'none' }, 8.4)
          .to(scrollCueRef.current,   { opacity: 1, duration: 0.5, ease: 'none' }, 8.6);

        // ── Scene 09: Camera Enters Galaxy & Exit (9.2 → 10.0) ─────────────
        // Camera dives forward through the galactic disk into the portfolio
        tl.to(ws, {
          enterGalaxy: 1.0,
          cameraZ:     config.camera.exit.z,
          duration:    0.8,
          ease:        'power2.in',
        }, 9.2)
          .to([
            galaxyTitleRef.current,
            scrollCueRef.current,
            metaLeftRef.current,
            metaRightRef.current,
          ], { opacity: 0, duration: 0.4, ease: 'none' }, 9.2)
          .to(ws, { globalFade: 0.0, duration: 0.5, ease: 'none' }, 9.5)
          .to(curtainRef.current,   { opacity: 1, duration: 0.6, ease: 'power2.in' }, 9.4)
          .to(containerRef.current, { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, 9.5);

      } else {
        // ── Reduced-motion mode: Static, restrained sequence ────────────────
        tl.set(ws, { voidProgress: 1.0, gravity: 0.0, galaxy: 1.0, freeze: 1.0 })
          .to([metaLeftRef.current, metaRightRef.current], { opacity: 1, duration: 0.5 }, 0.1)
          .fromTo([nameGRef.current, nameGURef.current],
            { yPercent: 0 },
            { opacity: 1, duration: 0.6 },
            0.5)
          .to([subtitleRef.current, rolesRef.current], { opacity: 1, duration: 0.5 }, 1.0)
          .to(scrollCueRef.current, { opacity: 1, duration: 0.5 }, 1.5)
          .to(curtainRef.current,   { opacity: 1, duration: 0.4 }, 4.5)
          .to(containerRef.current, { opacity: 0, duration: 0.5 }, 4.5);
      }

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      document.documentElement.removeAttribute('data-intro-active');
    };
  }, [config, webGLReady]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* Spacer — creates scroll runway for ScrollTrigger */}
      {webGLReady && (
        <div
          ref={spacerRef}
          style={{
            height:     config.scrollLength,
            background: '#030305',
          }}
        />
      )}

      {/* Fixed container — the cinematic experience */}
      <div
        ref={containerRef}
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     100,
          background: '#030305',
        }}
      >
        {webGLReady && (
          <IntroCanvas
            config={config}
            worldStateRef={worldStateRef}
            uniformsRef={uniformsRef}
          />
        )}

        <IntroOverlay refs={overlayRefs} />

        {!webGLReady && (
          <IntroFallback onComplete={handleFallbackComplete} />
        )}
      </div>
    </>
  );
};

export default CinematicIntro;
