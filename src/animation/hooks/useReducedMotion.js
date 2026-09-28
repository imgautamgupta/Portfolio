/**
 * useReducedMotion — prefers-reduced-motion utility hook
 *
 * Returns true if the user has requested reduced motion via OS/browser settings.
 * Reactively updates if the user changes their preference while the page is open.
 *
 * Usage:
 *   const prefersReducedMotion = useReducedMotion();
 *   if (!prefersReducedMotion) {
 *     // run heavy animation
 *   }
 *
 * Guidelines when reduced motion is true:
 *   - Skip or minimise parallax effects
 *   - Skip large camera movements
 *   - Skip continuous particle motion
 *   - Still render the complete UI — do NOT disable the portfolio
 *   - Use instant transitions or very short fades instead of elaborate sequences
 */

import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * @returns {boolean} true if the user prefers reduced motion
 */
export const useReducedMotion = () => {
  // Default to false (motion ok) during SSR or when matchMedia is unavailable
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(QUERY);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Legacy fallback
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Non-hook utility for use outside React components (e.g. in GSAP timelines).
 * @returns {boolean}
 */
export const getReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
};

export default useReducedMotion;
