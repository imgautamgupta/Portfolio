/**
 * introConfig.js
 *
 * Performance-aware configuration for the cinematic opening scene.
 * Called once at component mount — never reactive.
 */

import { getQualityPreset, QUALITY, getQualityTier } from '../../experience/PerformanceManager';
import { getReducedMotion } from '../../animation/hooks/useReducedMotion';

export const getIntroConfig = () => {
  const preset   = getQualityPreset();
  const tier     = getQualityTier();
  const reduced  = getReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
  const rawDpr   = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  // Particle count: scaled by tier, device, and reduced-motion
  let particleCount = preset.particleCount;
  if (tier === QUALITY.HIGH)   particleCount = 2400;
  if (tier === QUALITY.MEDIUM) particleCount = 1000;
  if (tier === QUALITY.LOW)    particleCount = 400;

  if (isTablet && !isMobile)   particleCount = Math.min(particleCount, 750);
  if (isMobile)                particleCount = Math.min(particleCount, 350);
  if (reduced)                 particleCount = Math.min(particleCount, 80);

  return {
    // ─── Particle System ──────────────────────────────────────────
    particleCount,
    sizeRange: [1.2, 3.8], // [min, max] point size in CSS pixels

    // ─── Procedural Dimensions ────────────────────────────────────
    voidBounds: {
      x: isMobile ? 12 : 22,
      y: isMobile ? 10 : 15,
      zNear: 8,
      zFar: -28,
    },
    galaxyRadius: isMobile ? 5.5 : 8.5,

    // ─── Camera Trajectory Keyframes ─────────────────────────────
    camera: {
      start:     { x:  0.0,  y:  0.0,  z:  9.5 }, // Void
      awakening: { x:  0.35, y:  0.15, z:  8.8 }, // Particles drifting
      gravity:   { x: -0.50, y:  0.35, z: 11.2 }, // Matter accelerating inward
      name:      { x:  0.0,  y:  0.0,  z:  9.4 }, // Centered on GAUTAM GUPTA
      explosion: { x:  0.0,  y:  0.2,  z: 13.5 }, // Pull back on radial blast
      galaxy:    { x:  0.75, y: -0.45, z: 11.5 }, // Tilted 3D cosmic view
      exit:      { x:  0.0,  y:  0.0,  z: -6.0 }, // Fly straight through galaxy
    },
    cameraFov:  isMobile ? 65 : 52,
    cameraLerp: 0.042, // smoothing factor per frame

    // ─── Rendering ────────────────────────────────────────────────
    dpr:       Math.min(rawDpr, preset.dprCap),
    antialias: tier === QUALITY.HIGH,

    // ─── Scroll & Interaction ─────────────────────────────────────
    scrollLength: isMobile ? '260vh' : '340vh',
    scrub:        1.0,

    // ─── Device Flags ─────────────────────────────────────────────
    reduced,
    isMobile,
    isTablet,
    tier,
  };
};
