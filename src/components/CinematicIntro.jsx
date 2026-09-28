/**
 * CinematicIntro.jsx
 *
 * Full-screen cinematic opening sequence for the portfolio.
 * The intro plays once per session: title card → iris wipe → Hero revealed.
 *
 * Bug-fix notes (applied at creation, not as a later patch):
 *
 *   BUG 1 FIX — Root overlay has NO bg-black / background colour.
 *     The iris element's box-shadow (`0 0 0 100vmax #000` on .cine-iris)
 *     is the ONLY thing painting the background black. Starting the iris
 *     at ~0×0 means the shadow covers the entire viewport. As the iris
 *     grows, the shadow retreats and the Hero (rendered behind this overlay)
 *     shows through the expanding hole — creating the smooth circular wipe.
 *     If we added bg-black to the root, the growing hole would just expose
 *     more solid black and the wipe would be invisible.
 *
 *   BUG 2 FIX — Iris z-index is 5 (set in index.css .cine-iris).
 *     Title text wrapper is z-10, reel counter is z-10.
 *     Both sit ABOVE the iris (z-5) so the text is visible during the
 *     title card phase. The root overlay is z-[95] — that keeps the whole
 *     intro above the Hero content. The iris being z-5 *within* the overlay
 *     is about internal stacking only.
 *
 *   BUG 3 FIX — Scroll is blocked via useLenis(false) during the intro
 *     (wired in App.jsx) so the page cannot drift while the screen is black.
 *
 * Props:
 *   onComplete {function} — called once the iris wipe animation is done
 */

import React, { useEffect, useRef, useState } from 'react';

// ─── Timing constants (ms) ───────────────────────────────────────────────────
const TITLE_HOLD_MS    = 2200;  // how long "Gautam Gupta" stays visible
const IRIS_EXPAND_MS   = 1100;  // duration of the iris-wipe CSS transition
const FADE_OUT_DELAY   = 300;   // small pause before starting the iris wipe
const REEL_FRAMES      = 24;    // number of "frame" ticks shown in the counter

const CinematicIntro = ({ onComplete }) => {
  const [phase, setPhase]           = useState('title');   // 'title' | 'wipe' | 'done'
  const [reelCount, setReelCount]   = useState(1);
  const [irisOpen, setIrisOpen]     = useState(false);
  const rafRef                      = useRef(null);
  const startRef                    = useRef(null);
  const completedRef                = useRef(false);

  // ── Reduced-motion: skip straight to done ───────────────────────────────
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      markDone();
      return;
    }

    // ── Set data-intro-active on <html> for CSS hooks (scrollbar hide, etc.)
    document.documentElement.setAttribute('data-intro-active', 'true');

    // ── Reel counter animation (RAF-driven for cinematic "film strip" feel)
    let frame = 0;
    const tickReel = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / TITLE_HOLD_MS, 1);
      const nextFrame = Math.floor(progress * REEL_FRAMES) + 1;
      if (nextFrame !== frame) {
        frame = nextFrame;
        setReelCount(frame);
      }
      if (elapsed < TITLE_HOLD_MS) {
        rafRef.current = requestAnimationFrame(tickReel);
      } else {
        // Title hold complete — begin iris wipe
        startIrisWipe();
      }
    };
    rafRef.current = requestAnimationFrame(tickReel);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.documentElement.removeAttribute('data-intro-active');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startIrisWipe = () => {
    setPhase('wipe');
    // Brief pause so the CSS transition fires cleanly after re-render.
    setTimeout(() => {
      setIrisOpen(true);
      // After the CSS transition completes, call onComplete.
      setTimeout(markDone, IRIS_EXPAND_MS + 100);
    }, FADE_OUT_DELAY);
  };

  const markDone = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase('done');
    document.documentElement.removeAttribute('data-intro-active');
    if (typeof onComplete === 'function') onComplete();
  };

  // Once done, render nothing (the overlay disappears).
  if (phase === 'done') return null;

  const paddedReel = String(reelCount).padStart(2, '0');

  return (
    /*
     * ROOT OVERLAY
     * ─────────────────────────────────────────────────────────────────────
     * z-[95]  : keeps the whole intro above everything on the page.
     * NO background colour: the iris's box-shadow is the only black paint.
     *   (BUG 1 fix — see file header)
     */
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {/*
       * IRIS ELEMENT
       * ─────────────────────────────────────────────────────────────────
       * .cine-iris in index.css:
       *   - position: absolute, centered via translate(-50%, -50%)
       *   - border-radius: 50% (circle)
       *   - box-shadow: 0 0 0 100vmax #000  ← this IS the black background
       *   - z-index: 5  ← BUG 2 fix: below text (z-10) but above nothing
       *   - width/height transition for the wipe
       *
       * When irisOpen=false: iris is ~0×0 so shadow covers the whole screen.
       * When irisOpen=true:  iris grows to ~220vmax, shadow retreats,
       *                      Hero shows through the expanding hole.
       */}
      <div
        className="cine-iris"
        style={{
          width:  irisOpen ? '220vmax' : '2px',
          height: irisOpen ? '220vmax' : '2px',
          transition: irisOpen
            ? `width ${IRIS_EXPAND_MS}ms cubic-bezier(0.76, 0, 0.24, 1),
               height ${IRIS_EXPAND_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`
            : 'none',
        }}
      />

      {/*
       * TITLE CARD — visible during 'title' phase only.
       * z-10 (relative z-10): above the iris (z-5). BUG 2 fix.
       */}
      {phase === 'title' && (
        <div className="relative z-10 flex flex-col items-center select-none pointer-events-none">
          {/* Director-style top rule */}
          <div
            className="w-24 h-px bg-white/30 mb-8"
            style={{ animation: 'cine-fade-in 0.6s ease both' }}
          />

          {/* Name */}
          <h1
            className="font-display text-white text-5xl md:text-7xl font-light tracking-[0.18em] uppercase"
            style={{ animation: 'cine-fade-in 0.8s ease 0.2s both' }}
          >
            Gautam Gupta
          </h1>

          {/* Role */}
          <p
            className="mt-4 font-mono text-white/50 text-xs tracking-[0.35em] uppercase"
            style={{ animation: 'cine-fade-in 0.8s ease 0.5s both' }}
          >
            Full-Stack Developer · AI Enthusiast
          </p>

          {/* Bottom rule */}
          <div
            className="w-24 h-px bg-white/30 mt-8"
            style={{ animation: 'cine-fade-in 0.6s ease 0.3s both' }}
          />
        </div>
      )}

      {/*
       * REEL COUNTER — bottom-right corner.
       * z-10: BUG 2 fix — explicit stacking above iris (z-5).
       */}
      {phase === 'title' && (
        <div
          className="fixed bottom-8 right-8 z-10 font-mono text-white/40 text-xs tracking-[0.25em] uppercase select-none pointer-events-none"
          style={{ animation: 'cine-fade-in 0.5s ease 0.4s both' }}
        >
          REEL 01 / {paddedReel}
        </div>
      )}
    </div>
  );
};

export default CinematicIntro;
