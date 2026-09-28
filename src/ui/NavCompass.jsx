/**
 * NavCompass.jsx
 *
 * Minimal heads-up navigation compass for the spacecraft.
 * Shows:
 *   - Current exploration mode
 *   - Nearest destination name + distance (when within range)
 *   - Active approach notification
 *   - Brief control hint (fades out after 8 seconds)
 *
 * Deliberately minimal — this is NOT a dashboard.
 * It is a whisper of context.
 */

import { useEffect, useRef, useState } from 'react';
import { useUniverseState } from '../experience/universe/UniverseState';

const NavCompass = () => {
  const state = useUniverseState();
  const [hintsVisible, setHintsVisible] = useState(true);
  const hintTimerRef = useRef(null);

  // Hide control hints after 8s
  useEffect(() => {
    hintTimerRef.current = setTimeout(() => setHintsVisible(false), 8000);
    return () => clearTimeout(hintTimerRef.current);
  }, []);

  const isApproaching = state.explorationMode === 'APPROACHING';
  const isDocked      = state.explorationMode === 'DOCKED';
  const isMap         = state.explorationMode === 'MAP';

  if (isDocked || isMap) return null;

  return (
    <div className="nav-compass" aria-label="Navigation HUD">
      {/* ── Mode indicator ─────────────────────────────────────────── */}
      <div className="compass-mode">
        <span className={`mode-dot ${isApproaching ? 'mode-dot--approach' : ''}`} />
        <span className="mode-text">
          {isApproaching ? 'DESTINATION NEARBY' : 'FREE FLIGHT'}
        </span>
      </div>

      {/* ── Nearest destination ────────────────────────────────────── */}
      {state.nearestDestination && !isApproaching && (
        <div className="compass-nearest">
          <span className="nearest-label">NEAREST</span>
          <span className="nearest-name">{state.nearestDestination.name}</span>
        </div>
      )}

      {/* ── Approach hint ─────────────────────────────────────────── */}
      {isApproaching && state.approachingDestination && (
        <div className="compass-approach">
          <div className="approach-name">{state.approachingDestination.name}</div>
          <div className="approach-sub">{state.approachingDestination.subtitle}</div>
        </div>
      )}

      {/* ── Control hints (first 8s only) ─────────────────────────── */}
      {hintsVisible && (
        <div className="compass-hints">
          <div className="hint-row">
            <kbd>W A S D</kbd>
            <span>Thrust / Turn</span>
          </div>
          <div className="hint-row">
            <kbd>SPACE</kbd>
            <span>Boost</span>
          </div>
          <div className="hint-row">
            <kbd>M</kbd>
            <span>Star Map</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavCompass;
