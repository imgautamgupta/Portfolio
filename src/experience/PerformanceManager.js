/**
 * PerformanceManager
 *
 * Detects device capability using simple, synchronous browser signals.
 * Does NOT run benchmarks or stress tests.
 *
 * Output: a quality tier (HIGH / MEDIUM / LOW) that will be used later to:
 *   - Adjust particle counts
 *   - Set DPR cap
 *   - Toggle postprocessing passes
 *   - Simplify shader complexity
 *   - Reduce animation intensity
 *
 * Usage:
 *   import { getQualityTier, QUALITY } from '../experience/PerformanceManager';
 *
 *   const tier = getQualityTier();
 *   if (tier === QUALITY.LOW) {
 *     // skip heavy effects
 *   }
 */

/** Quality tier constants */
export const QUALITY = Object.freeze({
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
});

/**
 * Gather raw device signals.
 * All checks are synchronous and safe in non-browser environments.
 *
 * @returns {object} raw signals object
 */
export const getDeviceSignals = () => {
  if (typeof window === 'undefined') {
    return {
      dpr: 1,
      isMobile: false,
      hardwareConcurrency: 4,
      deviceMemory: 4,
      prefersReducedMotion: false,
      webglVersion: null,
      isSlowConnection: false,
    };
  }

  const dpr = window.devicePixelRatio ?? 1;
  const viewportWidth = window.innerWidth ?? 1280;
  const isMobile = viewportWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

  // Hardware concurrency: number of logical CPU cores (2–32 typically)
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;

  // deviceMemory: approximate RAM in GB (Chrome/Edge only, undefined elsewhere)
  // Values: 0.25, 0.5, 1, 2, 4, 8
  const deviceMemory = navigator.deviceMemory ?? 4;

  // prefers-reduced-motion
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // Network quality (Chrome/Edge only)
  const connection = navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;
  const isSlowConnection =
    connection
      ? ['slow-2g', '2g'].includes(connection.effectiveType)
      : false;

  // WebGL version — import lazily to avoid circular dep
  // We check here directly to keep PerformanceManager self-contained
  let webglVersion = null;
  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl2')) webglVersion = 2;
    else if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) webglVersion = 1;
  } catch {
    webglVersion = null;
  }

  return {
    dpr,
    isMobile,
    hardwareConcurrency,
    deviceMemory,
    prefersReducedMotion,
    webglVersion,
    isSlowConnection,
  };
};

/**
 * Derive a quality tier from device signals.
 *
 * Tier criteria (approximate):
 *   HIGH   — desktop, ≥4 cores, ≥4 GB RAM, DPR ≤ 3, WebGL2, no reduced motion
 *   MEDIUM — desktop/tablet, ≥2 cores, ≥2 GB RAM, WebGL1+
 *   LOW    — mobile, <2 cores, <2 GB RAM, slow connection, reduced motion, no WebGL
 *
 * @param {object} [signals] — optionally pass pre-computed signals
 * @returns {'HIGH' | 'MEDIUM' | 'LOW'}
 */
export const deriveQualityTier = (signals) => {
  const s = signals ?? getDeviceSignals();

  if (s.webglVersion === null) return QUALITY.LOW;
  if (s.prefersReducedMotion) return QUALITY.LOW;
  if (s.isSlowConnection) return QUALITY.LOW;

  if (
    !s.isMobile &&
    s.hardwareConcurrency >= 4 &&
    s.deviceMemory >= 4 &&
    s.webglVersion === 2
  ) {
    return QUALITY.HIGH;
  }

  if (
    s.hardwareConcurrency >= 2 &&
    s.deviceMemory >= 2 &&
    s.webglVersion !== null
  ) {
    return QUALITY.MEDIUM;
  }

  return QUALITY.LOW;
};

// Cached tier — computed once per page load
let _cachedTier = null;
let _cachedSignals = null;

/**
 * Get the quality tier for this device/session.
 * Result is cached after first call.
 *
 * @returns {'HIGH' | 'MEDIUM' | 'LOW'}
 */
export const getQualityTier = () => {
  if (_cachedTier === null) {
    _cachedSignals = getDeviceSignals();
    _cachedTier = deriveQualityTier(_cachedSignals);
  }
  return _cachedTier;
};

/**
 * Get the cached device signals (populated after first getQualityTier() call).
 * @returns {object | null}
 */
export const getCachedSignals = () => _cachedSignals;

/**
 * Quality-based configuration presets.
 * Use these to drive rendering decisions throughout the experience.
 *
 * @returns {object} preset for the current tier
 */
export const getQualityPreset = () => {
  const tier = getQualityTier();

  const presets = {
    [QUALITY.HIGH]: {
      particleCount: 2000,
      dprCap: 2,
      postprocessing: true,
      shaderComplexity: 'HIGH',
      animationIntensity: 1.0,
      shadows: true,
    },
    [QUALITY.MEDIUM]: {
      particleCount: 800,
      dprCap: 1.5,
      postprocessing: false,
      shaderComplexity: 'MEDIUM',
      animationIntensity: 0.7,
      shadows: false,
    },
    [QUALITY.LOW]: {
      particleCount: 200,
      dprCap: 1,
      postprocessing: false,
      shaderComplexity: 'LOW',
      animationIntensity: 0.2,
      shadows: false,
    },
  };

  return presets[tier];
};
