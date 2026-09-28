/**
 * Smooth Scroll Controller
 *
 * Creates and manages a single Lenis smooth-scroll instance and bridges
 * it to GSAP ScrollTrigger so both systems share ONE requestAnimationFrame loop.
 *
 * CRITICAL RULES:
 *  1. Only ONE Lenis instance may exist at a time.
 *  2. Only ONE RAF loop drives the scroll — via GSAP's ticker.
 *  3. Call initScroll() once at application startup (main.jsx).
 *  4. Call destroyScroll() on application teardown (HMR / unmount).
 *  5. Never call new Lenis() inside individual components.
 *
 * Usage in main.jsx:
 *   import { initScroll, destroyScroll } from './utils/scroll';
 *   initScroll();
 *   // On HMR hot dispose:
 *   if (import.meta.hot) import.meta.hot.dispose(destroyScroll);
 */

import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../animation/gsap';
import { getReducedMotion } from '../animation/hooks/useReducedMotion';

/** @type {Lenis | null} */
let lenisInstance = null;

/**
 * Initialise smooth scrolling.
 * Safe to call multiple times — will destroy the previous instance first.
 *
 * @param {object} [overrides] — Lenis constructor options to override defaults
 * @returns {Lenis} the active Lenis instance
 */
export const initScroll = (overrides = {}) => {
  // Prevent duplicate instances
  if (lenisInstance) {
    destroyScroll();
  }

  const reducedMotion = getReducedMotion();

  lenisInstance = new Lenis({
    // Smoothness: 0 = instant, 1 = very smooth. Keep subtle.
    lerp: reducedMotion ? 0 : 0.08,
    // Smooth wheel scrolling
    smoothWheel: !reducedMotion,
    // Touch devices use native momentum — do not override
    smoothTouch: false,
    // Prevent Lenis from hijacking keyboard navigation
    prevent: (node) => {
      return node.tagName === 'INPUT' ||
             node.tagName === 'TEXTAREA' ||
             node.tagName === 'SELECT' ||
             node.isContentEditable;
    },
    ...overrides,
  });

  // Bridge Lenis to GSAP ScrollTrigger via GSAP's ticker.
  // This ensures ONE RAF loop drives both systems.
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  // Disable GSAP's own lag smoothing for this shared ticker
  gsap.ticker.lagSmoothing(0);

  // Tell ScrollTrigger to update when Lenis scrolls
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Use Lenis's virtual scroll position for ScrollTrigger calculations
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && lenisInstance) {
        lenisInstance.scrollTo(value, { immediate: true });
      }
      return lenisInstance?.scroll ?? window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener('refresh', () => lenisInstance?.resize());
  ScrollTrigger.refresh();

  return lenisInstance;
};

/**
 * Destroy the current Lenis instance and clean up ScrollTrigger proxy.
 * Call this on HMR dispose or application teardown.
 */
export const destroyScroll = () => {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
  // Restore native scrolling for ScrollTrigger
  ScrollTrigger.clearScrollMemory();
};

/**
 * Get the active Lenis instance (or null if not initialised).
 * Use this in components that need to programmatically scroll.
 *
 * @returns {Lenis | null}
 */
export const getLenis = () => lenisInstance;

/**
 * Scroll to a target element or position.
 * Falls back to native scrollIntoView if Lenis is not initialised.
 *
 * @param {string | HTMLElement | number} target — CSS selector, element, or numeric offset
 * @param {object} [options] — Lenis scrollTo options
 */
export const scrollTo = (target, options = {}) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), ...options });
    return;
  }
  // Graceful fallback
  if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth' });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
};
