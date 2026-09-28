/**
 * Letterbox.jsx
 *
 * Renders the classic cinematic black bars (top + bottom).
 * These are purely decorative — they appear during the intro and fade
 * out once the iris wipe completes.
 *
 * Props:
 *   visible {boolean} — when false the bars animate out (scaleY → 0)
 */

import React from 'react';

const BAR_HEIGHT = '10vh'; // ~2.4:1 aspect ratio on 16:9 screens

const Letterbox = ({ visible }) => {
  const barStyle = {
    position: 'fixed',
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    background: '#000',
    zIndex: 96,                       // above the intro overlay (z-[95])
    transformOrigin: 'top',
    transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Top bar */}
      <div
        aria-hidden="true"
        style={{
          ...barStyle,
          top: 0,
          transformOrigin: 'top',
          transform: visible ? 'scaleY(1)' : 'scaleY(0)',
        }}
      />
      {/* Bottom bar */}
      <div
        aria-hidden="true"
        style={{
          ...barStyle,
          bottom: 0,
          transformOrigin: 'bottom',
          transform: visible ? 'scaleY(1)' : 'scaleY(0)',
        }}
      />
    </>
  );
};

export default Letterbox;
