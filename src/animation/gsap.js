/**
 * GSAP Central Registration
 *
 * Import this module ONCE at the application entry point (main.jsx).
 * It registers all required GSAP plugins in one place.
 *
 * Do NOT call gsap.registerPlugin() anywhere else in the codebase.
 * Duplicate plugin registrations are harmless but wasteful.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register all plugins in one shot
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global GSAP defaults — prefer transform/opacity for performance
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
});

// ScrollTrigger defaults
ScrollTrigger.config({
  // Prevent auto-refresh storms during rapid resizes
  limitCallbacks: true,
  // Use a small tolerance to avoid unnecessary recalculations
  syncInterval: 50,
});

export { gsap, ScrollTrigger, ScrollToPlugin };
