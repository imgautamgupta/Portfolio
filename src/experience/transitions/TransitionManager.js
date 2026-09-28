/**
 * TransitionManager.js
 *
 * Coordinates cinematic camera transitions between spatial regions.
 *
 * Ensures:
 *   - Smooth interpolation between region camera vantage points.
 *   - Zero physics or camera glitches on rapid clicks (re-targets in flight).
 *   - Respects reduced-motion by snapping directly to destination.
 *   - Dispatches arrival completion to WorldState.
 */

import * as THREE from 'three';
import { getRegionById } from '../world/worldConfig';
import { worldState } from '../WorldState';
import { getReducedMotion } from '../../animation/hooks/useReducedMotion';

class TransitionManagerClass {
  constructor() {
    this._currentTargetPos = new THREE.Vector3(0, 5.5, 13.5);
    this._currentLookAt = new THREE.Vector3(0, 0, 0);

    this._desiredTargetPos = new THREE.Vector3(0, 5.5, 13.5);
    this._desiredLookAt = new THREE.Vector3(0, 0, 0);

    this._activeRegionId = 'hub';
    this._lerpFactor = 0.055;
    this._arrivalThreshold = 0.08;

    this._init();
  }

  _init() {
    // Listen to world state travel events
    worldState.subscribe((state) => {
      if (state.navigationTarget && state.navigationTarget !== this._activeRegionId) {
        this.startTransition(state.navigationTarget);
      }
    });
  }

  /**
   * Set target region and compute destination vectors
   * @param {string} regionId
   */
  startTransition(regionId) {
    const region = getRegionById(regionId);
    this._activeRegionId = region.id;

    this._desiredTargetPos.set(...region.cameraOffset);
    this._desiredLookAt.set(...region.cameraLookAt);

    if (getReducedMotion()) {
      // Instant transition for reduced motion
      this._currentTargetPos.copy(this._desiredTargetPos);
      this._currentLookAt.copy(this._desiredLookAt);
      worldState.completeArrival(region.id);
    }
  }

  /**
   * Update camera position and lookAt every frame inside R3F useFrame
   * @param {THREE.Camera} camera
   * @param {number} delta
   * @param {{ x: number, y: number }} [userParallax]
   */
  update(camera, delta, userParallax = { x: 0, y: 0 }) {
    // Smoothly step position towards destination
    this._currentTargetPos.lerp(this._desiredTargetPos, this._lerpFactor);
    this._currentLookAt.lerp(this._desiredLookAt, this._lerpFactor);

    // Apply user parallax offset gently to camera position
    camera.position.set(
      this._currentTargetPos.x + userParallax.x,
      this._currentTargetPos.y + userParallax.y,
      this._currentTargetPos.z
    );

    camera.lookAt(this._currentLookAt);

    // Check if we arrived at target
    const distPos = this._currentTargetPos.distanceTo(this._desiredTargetPos);
    const distLook = this._currentLookAt.distanceTo(this._desiredLookAt);

    if (distPos < this._arrivalThreshold && distLook < this._arrivalThreshold) {
      const state = worldState.getState();
      if (state.isTransitioning && state.navigationTarget) {
        worldState.completeArrival(this._activeRegionId);
      }
    }
  }

  getActiveTarget() {
    return {
      targetPos: this._currentTargetPos,
      lookAt: this._currentLookAt,
      regionId: this._activeRegionId,
    };
  }
}

export const transitionManager = new TransitionManagerClass();
export default transitionManager;
