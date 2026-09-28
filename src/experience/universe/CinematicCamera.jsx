/**
 * CinematicCamera.jsx
 *
 * Third-person cinematic follow camera. No gimbal lock. No frame-rate coupling.
 *
 * ─── ARCHITECTURE ────────────────────────────────────────────────────────────
 *
 *  Position follow:
 *    Uses `1 - exp(-CAM_POS_SPEED * dt)` as the lerp alpha each frame.
 *    This is identical to a critically-damped spring at any frame rate.
 *    The camera always converges to the target at the same *rate* in seconds,
 *    regardless of whether it ticks at 30 fps or 144 fps.
 *
 *  Orientation follow:
 *    We derive the target quaternion by constructing a temp camera that
 *    lookAt()s the desired look-target. We then quaternion slerp the real
 *    camera toward it. Quaternion slerp cannot produce gimbal lock or the
 *    discontinuities that come from Euler-based lookAt interpolation.
 *
 *  Offset space:
 *    CAM_OFFSET is expressed in the spacecraft's LOCAL space and transformed
 *    to world space each frame via ship.quaternion. This means the camera
 *    always stays behind the ship regardless of heading.
 *
 *  Anti-clip:
 *    Camera near-plane is set tight (0.1 units) and the camera offset keeps
 *    the camera far enough back that it can't intersect the ship mesh during
 *    any reasonable maneuver. No raycasting is needed.
 *
 *  Pointer parallax:
 *    A subtle world-space offset is added to the ideal position proportional
 *    to the normalized pointer position. This adds a sense of looking around
 *    without changing the camera's lookAt target.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import InteractionManager from '../InteractionManager';
import cfg from './flightConfig';

// ── Pre-allocated objects — zero GC per frame ──────────────────────────────
const _idealPos    = new THREE.Vector3();
const _idealLookAt = new THREE.Vector3();
const _localOff    = new THREE.Vector3();
const _localLook   = new THREE.Vector3();
const _tempCam     = new THREE.PerspectiveCamera(); // PerspectiveCamera: lookAt sets -Z to target
const _targetQuat  = new THREE.Quaternion();

const CinematicCamera = ({ spacecraftRef, reduced, isMobile }) => {
  const { camera } = useThree();
  const im = InteractionManager.getInstance();

  // Current smoothed camera state — refs, never React state
  const camPos      = useRef(new THREE.Vector3());
  const camQuat     = useRef(new THREE.Quaternion());
  const initialized = useRef(false);

  useFrame((_, rawDelta) => {
    const ship = spacecraftRef.current;
    if (!ship) return;

    const dt = Math.min(rawDelta, 0.05);

    // ── Compute ideal camera world position ───────────────────────────────
    _localOff.set(cfg.CAM_OFFSET_X, cfg.CAM_OFFSET_Y, cfg.CAM_OFFSET_Z);
    _localOff.applyQuaternion(ship.quaternion); // local → world
    _idealPos.copy(ship.position).add(_localOff);

    // ── Pointer parallax (world-space horizontal/vertical nudge) ──────────
    const ptr = im.getNormalized();
    const par = isMobile ? cfg.CAM_PARALLAX * 0.35 : cfg.CAM_PARALLAX;
    _idealPos.x += ptr.x * par;
    _idealPos.y += ptr.y * par * 0.55;

    // ── Compute ideal lookAt target ───────────────────────────────────────
    _localLook.set(cfg.CAM_LOOKAT_X, cfg.CAM_LOOKAT_Y, cfg.CAM_LOOKAT_Z);
    _localLook.applyQuaternion(ship.quaternion);
    _idealLookAt.copy(ship.position).add(_localLook);

    // ── Snap immediately on first frame so there is no opening camera jump ─
    if (!initialized.current) {
      _tempCam.position.copy(_idealPos);
      _tempCam.lookAt(_idealLookAt);

      camPos.current.copy(_idealPos);
      camQuat.current.copy(_tempCam.quaternion);
      camera.position.copy(_idealPos);
      camera.quaternion.copy(_tempCam.quaternion);
      initialized.current = true;
      return;
    }

    // ── Derive target quaternion via a scratch PerspectiveCamera ──────────
    _tempCam.position.copy(camPos.current);
    _tempCam.lookAt(_idealLookAt);
    _targetQuat.copy(_tempCam.quaternion);

    // ── Exponential smoothing (frame-rate independent) ────────────────────
    //    alpha = 1 - exp(-speed * dt)  →  converges at `speed` units/second
    const posAlpha  = reduced ? 1 : (1 - Math.exp(-cfg.CAM_POS_SPEED * dt));
    const rotAlpha  = reduced ? 1 : (1 - Math.exp(-cfg.CAM_ROT_SPEED * dt));

    camPos.current.lerp(_idealPos, posAlpha);
    camQuat.current.slerp(_targetQuat, rotAlpha); // quaternion slerp — no gimbal

    // ── Apply to real camera ──────────────────────────────────────────────
    camera.position.copy(camPos.current);
    camera.quaternion.copy(camQuat.current);
  });

  return null;
};

export default CinematicCamera;
