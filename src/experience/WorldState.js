/**
 * WorldState.js
 *
 * Centralized state store for the explorable digital world.
 *
 * Tracks:
 *   - currentLocation: Current region id ('hub', 'mind', 'journey', 'lab', 'projects', 'contact')
 *   - discoveredLocations: Set of unlocked region IDs
 *   - visitedProjects: Set of project IDs inspected
 *   - explorationMode: 'FREE' | 'INSPECTING' | 'MAP'
 *   - activeSector: Sector object or null (when inspecting content)
 *   - isTransitioning: Boolean indicating active camera travel
 *
 * Architecture:
 *   - Decoupled from Three.js render loop (zero per-frame state triggers).
 *   - Pub/sub listener model for UI components (WorldMap, HUD, SectorOverlay).
 *   - Provides a React hook `useWorldState()` for reactive components.
 */

import { useState, useEffect } from 'react';

class WorldStateManager {
  constructor() {
    this._state = {
      currentLocation: 'hub',
      discoveredLocations: new Set(['hub']),
      visitedProjects: new Set(),
      explorationMode: 'FREE', // 'FREE' | 'INSPECTING' | 'MAP'
      activeSector: null,
      navigationTarget: null,
      isTransitioning: false,
    };

    this._listeners = new Set();
  }

  /**
   * Get immutable snapshot of current state
   */
  getState() {
    return {
      ...this._state,
      discoveredLocations: Array.from(this._state.discoveredLocations),
      visitedProjects: Array.from(this._state.visitedProjects),
    };
  }

  /**
   * Subscribe to state changes (UI components only)
   * @param {Function} listener
   * @returns {Function} unsubscribe function
   */
  subscribe(listener) {
    this._listeners.add(listener);
    // Initial emit
    listener(this.getState());
    return () => this._listeners.delete(listener);
  }

  _notify() {
    const snapshot = this.getState();
    for (const listener of this._listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('WorldState listener error:', err);
      }
    }
  }

  /**
   * Initiate travel to a region
   * @param {string} regionId
   */
  travelTo(regionId) {
    if (this._state.currentLocation === regionId && !this._state.isTransitioning) {
      return;
    }

    this._state.navigationTarget = regionId;
    this._state.isTransitioning = true;
    this._notify();
  }

  /**
   * Confirm arrival at target region
   * @param {string} regionId
   */
  completeArrival(regionId) {
    this._state.currentLocation = regionId;
    this._state.navigationTarget = null;
    this._state.isTransitioning = false;
    this.discoverRegion(regionId);
    this._notify();
  }

  /**
   * Mark a region as discovered
   * @param {string} regionId
   */
  discoverRegion(regionId) {
    if (!this._state.discoveredLocations.has(regionId)) {
      this._state.discoveredLocations.add(regionId);
      this._notify();
    }
  }

  /**
   * Mark a project as inspected
   * @param {string} projectId
   */
  visitProject(projectId) {
    if (!this._state.visitedProjects.has(projectId)) {
      this._state.visitedProjects.add(projectId);
      this._notify();
    }
  }

  /**
   * Open sector content inspector
   * @param {string} sectorId
   */
  inspectSector(sectorId) {
    this._state.activeSector = sectorId;
    this._state.explorationMode = 'INSPECTING';
    this.discoverRegion(sectorId);
    this._notify();
  }

  /**
   * Close sector inspector and return to free exploration
   */
  closeSector() {
    this._state.activeSector = null;
    this._state.explorationMode = 'FREE';
    this._notify();
  }

  /**
   * Toggle World Map overview mode
   * @param {boolean} [forceState]
   */
  toggleMap(forceState) {
    const nextState = forceState !== undefined 
      ? (forceState ? 'MAP' : 'FREE')
      : (this._state.explorationMode === 'MAP' ? 'FREE' : 'MAP');

    this._state.explorationMode = nextState;
    this._notify();
  }

  /**
   * Set exploration mode directly
   * @param {'FREE' | 'INSPECTING' | 'MAP'} mode
   */
  setMode(mode) {
    if (this._state.explorationMode !== mode) {
      this._state.explorationMode = mode;
      this._notify();
    }
  }
}

// Singleton instance
export const worldState = new WorldStateManager();

/**
 * React Hook for UI components to bind to WorldState
 * @returns {object} current world state snapshot
 */
export const useWorldState = () => {
  const [state, setState] = useState(() => worldState.getState());

  useEffect(() => {
    return worldState.subscribe(setState);
  }, []);

  return state;
};

export default worldState;
