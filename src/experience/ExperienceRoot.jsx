/**
 * ExperienceRoot.jsx
 *
 * Top-level orchestrator for the entire portfolio experience.
 *
 * Responsibilities:
 *   1. Detect WebGL availability and quality tier
 *   2. Mount the 3D universe canvas (UniverseCanvas)
 *   3. Layer the UI overlay: NavCompass, DestinationPanel, StarMap
 *   4. Wire keyboard shortcut: M = toggle StarMap
 *   5. Provide ExperienceFallback if WebGL is unavailable
 *   6. Set data-quality-tier on <html> for CSS hooks
 */

import { useEffect } from 'react';
import InteractionManager from './InteractionManager';
import { isWebGLAvailable } from '../utils/webgl';
import { getQualityTier } from './PerformanceManager';
import ExperienceFallback from './ExperienceFallback';
import UniverseCanvas from './universe/UniverseCanvas';
import NavCompass from '../ui/NavCompass';
import DestinationPanel from '../ui/DestinationPanel';
import StarMap from '../ui/StarMap';
import DebugOverlay from './universe/DebugOverlay';
import universeState from './universe/UniverseState';

const ExperienceRoot = () => {
  const qualityTier = getQualityTier();
  const isMobile    = typeof window !== 'undefined' && window.innerWidth < 768;
  const hasWebGL    = isWebGLAvailable();

  // Stamp quality tier onto <html> for CSS selectors
  useEffect(() => {
    document.documentElement.setAttribute('data-quality-tier', qualityTier);
    InteractionManager.getInstance().init();
    return () => {
      document.documentElement.removeAttribute('data-quality-tier');
      InteractionManager.destroy();
    };
  }, [qualityTier]);

  // M key → toggle star map
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'KeyM') universeState.toggleMap();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!hasWebGL) {
    return <ExperienceFallback />;
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000008' }}
      aria-label="Interstellar portfolio universe"
    >
      {/* ── 3D Universe ─────────────────────────────────────────── */}
      <UniverseCanvas qualityTier={qualityTier} isMobile={isMobile} />

      {/* ── Navigation HUD ──────────────────────────────────────── */}
      <NavCompass />

      {/* ── Destination Content Panel ────────────────────────────── */}
      <DestinationPanel />

      {/* ── Star Map Overlay ─────────────────────────────────────── */}
      <StarMap />

      {/* ── Debug Overlay (` key to toggle) ──────────────────────── */}
      <DebugOverlay />
    </div>
  );
};

export default ExperienceRoot;
