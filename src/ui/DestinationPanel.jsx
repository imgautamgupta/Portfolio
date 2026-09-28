/**
 * DestinationPanel.jsx
 *
 * The content inspection panel that opens when the pilot docks at a destination.
 * This is the primary content delivery surface of the portfolio.
 *
 * Design:
 *   - Slides in from the right edge
 *   - Minimal: name, subtitle, body content, tags, links
 *   - Close button returns to free flight
 *   - Transparent blur glass — the universe remains visible behind it
 *   - Keyboard: Escape closes
 *
 * The panel does NOT show ALL portfolio content at once — just the focused destination.
 */

import { useEffect, useCallback } from 'react';
import universeState, { useUniverseState } from '../experience/universe/UniverseState';
import { getDestinationById } from '../experience/universe/universeConfig';

const DestinationPanel = () => {
  const state = useUniverseState();

  const handleClose = useCallback(() => {
    universeState.undock();
  }, []);

  // Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape' && state.activeDestination) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.activeDestination, handleClose]);

  if (!state.activeDestination) return null;

  const dest = typeof state.activeDestination === 'string'
    ? getDestinationById(state.activeDestination)
    : state.activeDestination;

  if (!dest) return null;

  const content = dest.content ?? {};
  const requiresContent = content.status === 'requires-content';

  return (
    <div className="dest-panel" role="complementary" aria-label="Destination details">
      {/* ── Close button ─────────────────────────────────────────── */}
      <button
        className="dest-close"
        onClick={handleClose}
        aria-label="Close destination panel"
        id="dest-panel-close-btn"
      >
        ✕
      </button>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="dest-header">
        <div className="dest-type">{dest.type.toUpperCase()}</div>
        <h2 className="dest-name">{dest.name}</h2>
        <div className="dest-subtitle">{dest.subtitle}</div>
        <div className="dest-divider" />
      </div>

      {/* ── Body content ─────────────────────────────────────────── */}
      <div className="dest-body">
        {content.title && (
          <h3 className="dest-content-title">{content.title}</h3>
        )}

        {requiresContent ? (
          <div className="dest-requires-content">
            <span className="requires-badge">CONTENT INCOMING</span>
            <p>This destination is being prepared. Check back soon.</p>
          </div>
        ) : (
          <p className="dest-content-body">{content.body}</p>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="dest-tags" aria-label="Technology tags">
            {content.tags.map((tag) => (
              <span key={tag} className="dest-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* GitHub link */}
        {content.github && (
          <a
            href={content.github}
            target="_blank"
            rel="noreferrer noopener"
            className="dest-link"
            id={`dest-github-${dest.id}`}
          >
            <span className="link-icon">↗</span>
            View on GitHub
          </a>
        )}
      </div>

      {/* ── Discovery badge ──────────────────────────────────────── */}
      <div className="dest-footer">
        <span className="dest-coord">
          {dest.position.map(v => Math.round(v)).join(' · ')}
        </span>
      </div>
    </div>
  );
};

export default DestinationPanel;
