/**
 * DebugOverlay.jsx
 *
 * Development-only flight model debug overlay. Rendered OUTSIDE R3F Canvas.
 *
 * Toggle: backtick key  `  or URL ?debug=1
 *
 * Reads directly from module singletons:
 *   physicsState  — written by SpacecraftController every R3F frame
 *   proximityData — written by the proximity sensor every N frames
 *
 * Updates the DOM directly via setInterval at ~10 fps.
 * Zero React setState calls during normal display. Zero WebGL/R3F deps.
 *
 * Strip for production: remove <DebugOverlay /> from ExperienceRoot.jsx.
 */

import { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import physicsState from './physicsState';
import { proximityData } from './SpacecraftController';
import cfg from './flightConfig';

const DebugOverlay = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debug') === '1';
  });

  // Direct DOM refs — mutated in setInterval, never via React state
  const domFps      = useRef(null);
  const domSpeed    = useRef(null);
  const domBoost    = useRef(null);
  const domPos      = useRef(null);
  const domYaw      = useRef(null);
  const domNearest  = useRef(null);
  const domApproach = useRef(null);
  const domBoundary = useRef(null);

  const handleKey = useCallback((e) => {
    if (e.code === 'Backquote') setVisible(v => !v);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Poll singletons at 10 fps — lightweight, readable, no useFrame needed
  useEffect(() => {
    if (!visible) return;

    const id = setInterval(() => {
      const pos = physicsState.pos;

      set(domFps,      `${(physicsState.fps ?? 0).toFixed(0)} fps`);
      set(domSpeed,    `${(physicsState.speed ?? 0).toFixed(1)} u/s`);
      set(domBoost,    `${((physicsState.boostPwr ?? 0) * 100).toFixed(0)}%`);

      if (pos) {
        set(domPos, `${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}, ${pos.z.toFixed(0)}`);
      }

      set(domYaw, `${(physicsState.angYaw ?? 0).toFixed(3)} r/s`);

      const n = proximityData.nearest;
      set(domNearest, n ? `${n.name}  ${proximityData.nearestDist.toFixed(0)} u` : '—');

      const a = proximityData.approaching;
      if (domApproach.current) {
        domApproach.current.textContent = a ? a.name : '—';
        domApproach.current.style.color = a ? '#40ff80' : 'rgba(255,255,255,0.3)';
      }

      if (pos && domBoundary.current) {
        const d = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        const pct = ((d / cfg.BOUNDARY_RADIUS) * 100).toFixed(0);
        domBoundary.current.textContent = `${d.toFixed(0)} u  (${pct}%)`;
        domBoundary.current.style.color = d > cfg.BOUNDARY_RADIUS * cfg.BOUNDARY_FOG_START
          ? '#ffaa40' : 'rgba(255,255,255,0.3)';
      }
    }, 100);

    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position:      'fixed',
        top:           '1rem',
        left:          '1rem',
        zIndex:        9999,
        fontFamily:    "'JetBrains Mono', 'Fira Code', monospace",
        fontSize:      '0.62rem',
        lineHeight:    '1.7',
        color:         'rgba(255,255,255,0.55)',
        background:    'rgba(0,0,0,0.72)',
        border:        '1px solid rgba(255,255,255,0.08)',
        borderRadius:  '3px',
        padding:       '0.5rem 0.8rem',
        pointerEvents: 'none',
        userSelect:    'none',
        minWidth:      '14rem',
      }}
      aria-hidden="true"
    >
      <div style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '0.3rem', letterSpacing: '0.15em' }}>
        ─ DEBUG  ` to hide ─
      </div>
      <DR label="FPS"      ref={domFps} />
      <DR label="SPEED"    ref={domSpeed} />
      <DR label="BOOST"    ref={domBoost} />
      <DR label="POSITION" ref={domPos} />
      <DR label="YAW ω"    ref={domYaw} />
      <DR label="NEAREST"  ref={domNearest} />
      <DR label="APPROACH" ref={domApproach} />
      <DR label="BOUNDARY" ref={domBoundary} />
    </div>
  );
};

// Helper: safe DOM text mutation
function set(ref, text) {
  if (ref.current) ref.current.textContent = text;
}

// Static labelled row — ref passed for direct DOM updates
const DR = forwardRef(({ label }, ref) => (
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <span style={{ color: 'rgba(255,255,255,0.22)', minWidth: '5.5rem', flexShrink: 0 }}>
      {label}
    </span>
    <span ref={ref} style={{ color: 'rgba(255,255,255,0.5)' }}>—</span>
  </div>
));
DR.displayName = 'DebugRow';

export default DebugOverlay;
