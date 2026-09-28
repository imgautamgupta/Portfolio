/**
 * WebGL Availability Detection
 *
 * Provides safe helpers for detecting WebGL support before
 * creating any Three.js / R3F context. Never assume WebGL exists.
 *
 * Usage:
 *   import { isWebGLAvailable, getWebGLVersion } from '../utils/webgl';
 *
 *   if (!isWebGLAvailable()) {
 *     // render fallback UI instead of 3D canvas
 *   }
 */

/**
 * Detect WebGL 1 or 2 support.
 * Creates a temporary canvas, probes for a context, then destroys it.
 * Never leaves a lingering context behind.
 *
 * @returns {{ available: boolean, version: 1 | 2 | null, reason?: string }}
 */
export const detectWebGL = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { available: false, version: null, reason: 'non-browser environment' };
  }

  const canvas = document.createElement('canvas');

  // Prefer WebGL2 — Three.js r152+ uses it by default
  const gl2 = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
  if (gl2) {
    // Clean up context so it doesn't consume GPU resources
    const ext = gl2.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    return { available: true, version: 2 };
  }

  const gl1 = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
              canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false });
  if (gl1) {
    const ext = gl1.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    return { available: true, version: 1 };
  }

  return { available: false, version: null, reason: 'WebGL context creation failed' };
};

// Cached result — only probe once per page load
let _cache = null;

/**
 * @returns {boolean} true if WebGL (1 or 2) is available
 */
export const isWebGLAvailable = () => {
  if (_cache === null) {
    _cache = detectWebGL();
  }
  return _cache.available;
};

/**
 * @returns {1 | 2 | null} the highest WebGL version available, or null
 */
export const getWebGLVersion = () => {
  if (_cache === null) {
    _cache = detectWebGL();
  }
  return _cache.version;
};

/**
 * Safe canvas wrapper — only renders children if WebGL is available.
 * Use this pattern in ExperienceRoot to guard Three.js scenes:
 *
 *   if (!isWebGLAvailable()) return <StaticFallback />;
 *   return <Canvas>...</Canvas>;
 */
export const WEB_GL_REASON = () => {
  if (_cache === null) {
    _cache = detectWebGL();
  }
  return _cache.reason ?? null;
};
