/**
 * UniverseState.js
 *
 * World state for the interstellar exploration experience.
 * Replaces the previous "sector / region" model with a spacecraft-centric universe.
 *
 * Tracks:
 *   - spacecraft: live position, velocity, rotation (refs, not state — never setState per frame)
 *   - nearestDestination: which destination is currently closest
 *   - approachingDestination: which destination is being approached (within range)
 *   - discoveredDestinations: Set of IDs already visited/discovered
 *   - activeDestination: destination open for inspection (null = flying free)
 *   - explorationMode: 'FREE' | 'APPROACHING' | 'DOCKED' | 'MAP'
 *
 * Architecture:
 *   - Mutable spacecraft state (position, velocity) lives in refs inside the R3F loop.
 *   - Only meaningful discovery events cause pub/sub notifications.
 *   - UI components subscribe once; expensive re-renders never triggered per frame.
 */

import { useState, useEffect } from 'react';

class UniverseStateManager {
  constructor() {
    this._state = {
      nearestDestination: null,
      approachingDestination: null,
      discoveredDestinations: new Set(['home']),
      activeDestination: null,
      explorationMode: 'FREE', // 'FREE' | 'APPROACHING' | 'DOCKED' | 'MAP'
      mapOpen: false,
    };

    this._listeners = new Set();
  }

  getState() {
    return {
      ...this._state,
      discoveredDestinations: Array.from(this._state.discoveredDestinations),
    };
  }

  subscribe(listener) {
    this._listeners.add(listener);
    listener(this.getState());
    return () => this._listeners.delete(listener);
  }

  _notify() {
    const snapshot = this.getState();
    for (const listener of this._listeners) {
      try { listener(snapshot); } catch (e) { console.error('UniverseState listener error:', e); }
    }
  }

  /** Called each frame by the approach sensor — only notifies if changed */
  setNearestDestination(destination) {
    if (this._state.nearestDestination?.id !== destination?.id) {
      this._state.nearestDestination = destination;
      this._notify();
    }
  }

  /** Called when spacecraft enters approach range of a destination */
  beginApproach(destination) {
    if (this._state.approachingDestination?.id !== destination?.id) {
      this._state.approachingDestination = destination;
      this._state.explorationMode = 'APPROACHING';
      this._notify();
    }
  }

  /** Called when spacecraft leaves approach range */
  endApproach() {
    if (this._state.approachingDestination !== null) {
      this._state.approachingDestination = null;
      if (this._state.explorationMode === 'APPROACHING') {
        this._state.explorationMode = 'FREE';
      }
      this._notify();
    }
  }

  /** Open the destination inspection panel */
  dock(destination) {
    if (!destination) return;
    this._state.activeDestination = destination;
    this._state.explorationMode = 'DOCKED';
    this.discover(destination.id);
    this._notify();
  }

  /** Close inspection and return to free flight */
  undock() {
    this._state.activeDestination = null;
    this._state.explorationMode = this._state.approachingDestination ? 'APPROACHING' : 'FREE';
    this._notify();
  }

  /** Mark a destination as discovered */
  discover(id) {
    if (!this._state.discoveredDestinations.has(id)) {
      this._state.discoveredDestinations.add(id);
      this._notify();
    }
  }

  /** Toggle star map */
  toggleMap(forceState) {
    const next = forceState !== undefined ? forceState : !this._state.mapOpen;
    if (next !== this._state.mapOpen) {
      this._state.mapOpen = next;
      this._state.explorationMode = next ? 'MAP' : (this._state.activeDestination ? 'DOCKED' : 'FREE');
      this._notify();
    }
  }
}

// Singleton
export const universeState = new UniverseStateManager();

/** React hook for UI components */
export const useUniverseState = () => {
  const [state, setState] = useState(() => universeState.getState());
  useEffect(() => universeState.subscribe(setState), []);
  return state;
};

export default universeState;
