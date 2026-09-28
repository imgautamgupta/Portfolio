/**
 * StarMap.jsx
 *
 * A radial SVG-based overview map of the universe.
 * Opens when the player presses M.
 *
 * Features:
 *   - Radial topology — home star at center
 *   - Destination nodes sized by type
 *   - Discovered vs undiscovered state (dimmed)
 *   - Coordinates derived from actual 3D positions (flattened to 2D)
 *   - Click to undock and return (doesn't teleport — pilot still flies)
 *   - Keyboard: M or Escape to close
 *
 * This is not a minimap — it is a navigator's chart.
 */

import { useCallback, useEffect } from 'react';
import universeState, { useUniverseState } from '../experience/universe/UniverseState';
import { DESTINATION_LIST } from '../experience/universe/universeConfig';

// Map dimensions
const MAP_W = 580;
const MAP_H = 520;
const CX = MAP_W / 2;
const CY = MAP_H / 2;
const SCALE = 0.28;

// Project 3D coords to flat chart coords
const project = (position) => {
  const [x, , z] = position;
  return {
    cx: CX + x * SCALE,
    cy: CY + z * SCALE,
  };
};

// Node visual sizes by type
const NODE_RADIUS = { star: 14, planet: 7, cluster: 5 };

const StarMap = () => {
  const state = useUniverseState();

  const handleClose = useCallback(() => {
    universeState.toggleMap(false);
  }, []);

  // Keyboard close
  useEffect(() => {
    const onKey = (e) => {
      if ((e.code === 'KeyM' || e.code === 'Escape') && state.mapOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.mapOpen, handleClose]);

  if (!state.mapOpen) return null;

  const discovered = new Set(state.discoveredDestinations);

  return (
    <div className="starmap-overlay" role="dialog" aria-modal="true" aria-label="Star map">
      <div className="starmap-panel">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="starmap-header">
          <span className="starmap-title">NAVIGATION CHART</span>
          <button className="starmap-close" onClick={handleClose} id="starmap-close-btn">✕</button>
        </div>

        {/* ── Chart ───────────────────────────────────────────────── */}
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          width="100%"
          className="starmap-svg"
          aria-label="Universe map"
        >
          {/* Grid rings */}
          {[100, 200, 300].map((r) => (
            <circle
              key={r}
              cx={CX} cy={CY} r={r}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={0.5}
            />
          ))}

          {/* Connection lines (to home star) */}
          {DESTINATION_LIST.filter(d => d.id !== 'home').map((dest) => {
            const { cx, cy } = project(dest.position);
            const isDim = !discovered.has(dest.id);
            return (
              <line
                key={dest.id}
                x1={CX} y1={CY}
                x2={cx} y2={cy}
                stroke={isDim ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.09)'}
                strokeWidth={0.6}
                strokeDasharray="3 6"
              />
            );
          })}

          {/* Destination nodes */}
          {DESTINATION_LIST.map((dest) => {
            const { cx, cy } = project(dest.position);
            const isDiscovered = discovered.has(dest.id);
            const isApproaching = state.nearestDestination?.id === dest.id;
            const r = NODE_RADIUS[dest.type] ?? 6;

            return (
              <g key={dest.id} onClick={() => isDiscovered && handleClose()} style={{ cursor: isDiscovered ? 'pointer' : 'default' }}>
                {/* Glow ring for approaching / discovered */}
                {isDiscovered && (
                  <circle
                    cx={cx} cy={cy} r={r + 3}
                    fill="none"
                    stroke={isApproaching ? '#ffffff' : dest.id === 'home' ? '#ff9900' : '#4488ff'}
                    strokeWidth={isApproaching ? 1.5 : 0.8}
                    opacity={0.4}
                  />
                )}

                {/* Main node */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={isDiscovered ? dest.color : 'rgba(255,255,255,0.08)'}
                  stroke={isDiscovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={0.8}
                />

                {/* Label (only when discovered) */}
                {isDiscovered && (
                  <text
                    x={cx + r + 5}
                    y={cy + 3}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.08em"
                  >
                    {dest.name}
                  </text>
                )}

                {/* Unknown marker */}
                {!isDiscovered && (
                  <text
                    x={cx}
                    y={cy + 3}
                    fill="rgba(255,255,255,0.15)"
                    fontSize="8"
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                  >
                    ?
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* ── Legend ──────────────────────────────────────────────── */}
        <div className="starmap-legend">
          <span className="legend-item legend-star">◉ STAR</span>
          <span className="legend-item legend-planet">● PLANET</span>
          <span className="legend-item legend-unknown">○ UNEXPLORED</span>
        </div>
      </div>
    </div>
  );
};

export default StarMap;
