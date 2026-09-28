/**
 * SpacecraftController.jsx
 *
 * Physics engine for the spacecraft. Runs entirely inside R3F useFrame.
 * Zero React state changes per frame — all mutable state lives in refs.
 *
 * ─── FRAME-RATE INDEPENDENCE ─────────────────────────────────────────────────
 * All motion is multiplied by `dt` (delta time in seconds from R3F).
 * Exponential drag uses `Math.pow(retention, dt)` so it decays identically
 * at 30 fps, 60 fps, 144 fps. Linear lerps use `1 - exp(-speed * dt)`.
 *
 * ─── BOOST RAMP ──────────────────────────────────────────────────────────────
 * `boostPower` (0–1) smoothly ramps toward 1 when Space is held and
 * back toward 0 when released. This creates a natural spool-up/spool-down
 * feel instead of an instant speed multiply.
 *
 * ─── SOFT BOUNDARY ───────────────────────────────────────────────────────────
 * Beyond BOUNDARY_RADIUS from origin, a return force proportional to
 * excess distance is applied pointing inward. The ship can fight it
 * temporarily but will always curve back — no hard wall.
 *
 * ─── PROXIMITY DETECTION ─────────────────────────────────────────────────────
 * Every PROXIMITY_CHECK_INTERVAL frames, distances to all destinations
 * are computed and universe state is updated. Writes to a shared mutable
 * object (`proximityData`) that the debug overlay can read without any
 * React subscriptions.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import inputSystem from './InputSystem';
import universeState from './UniverseState';
import { DESTINATION_LIST } from './universeConfig';
import cfg from './flightConfig';
import physicsState from './physicsState';

// ── Shared proximity data (mutable, read by DebugOverlay without React) ───────
export const proximityData = {
  nearest: null,
  nearestDist: Infinity,
  approaching: null,
};

// ── Pre-allocated vectors — zero GC inside the render loop ────────────────────
const _fwd      = new THREE.Vector3();
const _destPos  = new THREE.Vector3();
const _toCenter = new THREE.Vector3();
const _origin   = new THREE.Vector3(0, 0, 0);

const SpacecraftController = ({ spacecraftRef, reduced }) => {
  // ── Physics state (refs, never React state) ───────────────────────────────
  const vel        = useRef(new THREE.Vector3(0, 0, 0));  // linear velocity
  const angVel     = useRef(new THREE.Vector3(0, 0, 0));  // angular velocity [pitch, yaw, roll]
  const boostPower = useRef(0);                            // 0–1 smooth ramp
  const bankZ      = useRef(0);                            // current visual bank angle
  const frame      = useRef(0);
  const _fpsAccum  = useRef(0);                            // time accumulator for fps
  const _fpsSamples= useRef(0);                            // sample count
  const _fpsVal    = useRef(60);                           // rolling fps value

  useFrame((_, rawDelta) => {
    const ship = spacecraftRef.current;
    if (!ship) return;

    // Clamp dt — prevents huge physics jumps when tab was hidden
    const dt = Math.min(rawDelta, 0.05);
    frame.current++;

    // ── Reduced motion: just slow spin, no player control ─────────────────
    if (reduced) {
      ship.rotation.y += dt * 0.10;
      return;
    }

    const inp = inputSystem.update();

    // ═══════════════════════════════════════════════════════════════════════
    // 1. BOOST RAMP — smooth power accumulation/decay
    // ═══════════════════════════════════════════════════════════════════════
    const boostDesired = (inp.boost && !inp.stabilize) ? 1 : 0;
    const boostRate    = boostDesired > boostPower.current
      ? cfg.BOOST_RAMP_IN   // ramping up
      : cfg.BOOST_RAMP_OUT; // ramping down
    // Exponential approach: bp → boostDesired
    boostPower.current += (boostDesired - boostPower.current) * (1 - Math.exp(-boostRate * dt));

    const bp = boostPower.current; // 0–1

    // ═══════════════════════════════════════════════════════════════════════
    // 2. ANGULAR VELOCITY — dt-scaled acceleration + exponential drag
    // ═══════════════════════════════════════════════════════════════════════
    const av = angVel.current;

    // Apply angular acceleration from input
    av.y -= inp.yaw  * cfg.YAW_ACCEL  * dt;
    av.z -= inp.roll * cfg.ROLL_ACCEL * dt;

    // Clamp to max angular speeds
    av.y = THREE.MathUtils.clamp(av.y, -cfg.YAW_MAX, cfg.YAW_MAX);
    av.z = THREE.MathUtils.clamp(av.z, -cfg.ROLL_MAX, cfg.ROLL_MAX);

    // Frame-rate-independent angular drag:  av *= retention^dt
    const angRetention = Math.pow(cfg.ANGULAR_DRAG, dt);
    av.multiplyScalar(angRetention);

    // Apply rotation to spacecraft quaternion
    ship.rotateY(av.y * dt);
    ship.rotateZ(av.z * dt);

    // ═══════════════════════════════════════════════════════════════════════
    // 3. LINEAR VELOCITY — thrust + drag + boost
    // ═══════════════════════════════════════════════════════════════════════
    const v = vel.current;

    if (inp.thrust !== 0) {
      ship.getWorldDirection(_fwd);
      const thrustScale = cfg.THRUST_ACCEL
        * (1 + (cfg.BOOST_MULTIPLIER - 1) * bp)  // smoothly scale with boost
        * inp.thrust                              // +1 forward, -1 brake/reverse
        * dt;
      v.addScaledVector(_fwd, thrustScale);
    }

    // Frame-rate-independent drag: v *= retention^dt
    const linRetention = inp.stabilize
      ? Math.pow(cfg.BRAKE_DRAG, dt)
      : Math.pow(cfg.LINEAR_DRAG, dt);
    v.multiplyScalar(linRetention);

    // Velocity cap (rises smoothly with boost power)
    const maxSpeed = cfg.MAX_SPEED + (cfg.BOOST_MAX_SPEED - cfg.MAX_SPEED) * bp;
    const speed = v.length();
    if (speed > maxSpeed) v.multiplyScalar(maxSpeed / speed);

    // ═══════════════════════════════════════════════════════════════════════
    // 4. SOFT BOUNDARY — gentle inward return force beyond BOUNDARY_RADIUS
    // ═══════════════════════════════════════════════════════════════════════
    const distFromCenter = ship.position.distanceTo(_origin);
    if (distFromCenter > cfg.BOUNDARY_RADIUS) {
      // Return direction: toward origin
      _toCenter.copy(_origin).sub(ship.position).normalize();
      // Force proportional to how far past the boundary
      const excess = distFromCenter - cfg.BOUNDARY_RADIUS;
      const forceMag = cfg.BOUNDARY_FORCE * (excess / cfg.BOUNDARY_RADIUS) * dt;
      v.addScaledVector(_toCenter, forceMag);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 5. INTEGRATE POSITION
    // ═══════════════════════════════════════════════════════════════════════
    ship.position.addScaledVector(v, dt);

    // ═══════════════════════════════════════════════════════════════════════
    // 6. VISUAL BANK (Z-axis lean) — exponential smoothing
    // ═══════════════════════════════════════════════════════════════════════
    const bankTarget = -inp.yaw * cfg.BANK_ANGLE;
    // alpha = 1 - exp(-speed * dt) for frame-rate-independent lerp
    const bankAlpha = 1 - Math.exp(-cfg.BANK_SPEED * dt);
    bankZ.current  += (bankTarget - bankZ.current) * bankAlpha;
    ship.rotation.z = bankZ.current;

    // ═══════════════════════════════════════════════════════════════════════
    // 7. PROXIMITY DETECTION — every N frames, no per-frame cost
    // ═══════════════════════════════════════════════════════════════════════
    if (frame.current % cfg.PROXIMITY_CHECK_INTERVAL === 0) {
      _runProximityCheck(ship.position);
    }

    // ── Write to shared physics state singleton (read by DebugOverlay) ────
    // FPS rolling average every 20 frames
    _fpsAccum.current   += dt;
    _fpsSamples.current++;
    if (_fpsSamples.current >= 20) {
      physicsState.fps = 20 / _fpsAccum.current;
      _fpsAccum.current = 0;
      _fpsSamples.current = 0;
    }
    physicsState.speed    = speed;
    physicsState.pos      = ship.position; // mutable ref — DO NOT clone
    physicsState.boostPwr = bp;
    physicsState.angYaw   = av.y;
  });

  return null;
};

// ── Proximity check (called every N frames, not every frame) ─────────────────
function _runProximityCheck(shipPos) {
  let nearest    = null;
  let nearestDist = Infinity;
  let approaching = null;

  for (const dest of DESTINATION_LIST) {
    _destPos.set(...dest.position);
    const dist = shipPos.distanceTo(_destPos);

    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = dest;
    }

    if (dist < dest.approachDistance) {
      approaching = dest;
    }
  }

  // Write to shared mutable proximity data (debug overlay reads this directly)
  proximityData.nearest    = nearestDist < cfg.PROXIMITY_NEAR_THRESHOLD ? nearest : null;
  proximityData.nearestDist = nearestDist;
  proximityData.approaching = approaching;

  // Update universe state (pub/sub — only fires when value changes)
  if (approaching) {
    universeState.beginApproach(approaching);
    universeState.discover(approaching.id);
  } else {
    universeState.endApproach();
  }
  universeState.setNearestDestination(proximityData.nearest);
}

export default SpacecraftController;
