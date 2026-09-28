/**
 * useLenis.js
 *
 * Controls the global Lenis smooth-scroll instance that was created in
 * main.jsx via utils/scroll.js.
 *
 * Architecture note:
 *   Only ONE Lenis instance exists for the app lifetime (see scroll.js).
 *   This hook does NOT create or destroy it — it only calls .start() /
 *   .stop() on the shared instance so individual features (like the
 *   CinematicIntro) can pause scrolling without duplicating instances.
 *
 * @param {boolean} [enabled=true]
 *   Pass `false` to pause Lenis and snap the page back to the top.
 *   Pass `true` (or omit) to let Lenis run normally.
 *
 * Usage in App.jsx:
 *   useLenis(!introPlaying);  // blocked while intro is active
 */

import { useEffect, useRef } from 'react';
import { getLenis } from '../utils/scroll';

/**
 * @param {boolean} [enabled=true]
 */
const useLenis = (enabled = true) => {
  // Track the previous enabled state so we only act on changes.
  const prevEnabled = useRef(null);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return; // Lenis was never created (e.g. prefers-reduced-motion path)

    // Avoid calling start/stop on every render if the value hasn't changed.
    if (prevEnabled.current === enabled) return;
    prevEnabled.current = enabled;

    if (enabled) {
      lenis.start();
    } else {
      // Stop Lenis from processing wheel/touch events.
      lenis.stop();
      // Snap the native scroll position to the top immediately so the Hero
      // is always revealed at y=0 when the intro finishes.
      lenis.scrollTo(0, { immediate: true });
    }
  }, [enabled]);
};

export default useLenis;
