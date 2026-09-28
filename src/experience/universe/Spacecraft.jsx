/**
 * Spacecraft.jsx
 *
 * Original stylized futuristic exploration spacecraft built from Three.js geometry.
 * No downloaded assets. No generic spaceship models.
 *
 * Design language:
 *   - Elegant minimal form factor — small compared to the universe
 *   - Clean aerodynamic silhouette
 *   - Subtle navigation lights (port: red, starboard: green, tail: white)
 *   - Engine glow cones at the rear
 *   - Cockpit dome with dark tinted material
 *
 * The spacecraft group root acts as the physics object.
 * Camera rig follows it from behind/above.
 *
 * Props:
 *   spacecraftRef — ref to the group (physics/camera system reads position/rotation from it)
 *   reduced       — boolean, simplifies if prefers-reduced-motion
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SPACECRAFT_START } from './universeConfig';

// Pre-allocated color objects — avoid per-frame allocations
const ENGINE_GLOW_COLOR = new THREE.Color(0.4, 0.7, 1.0);

const Spacecraft = ({ spacecraftRef, reduced }) => {
  const engineGlowRef  = useRef(null);
  const engineGlow2Ref = useRef(null);
  const navLightPortRef = useRef(null);
  const navLightStarRef = useRef(null);

  // Animate engine glow and navigation lights
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();

    // Engine glow pulse
    if (engineGlowRef.current) {
      engineGlowRef.current.intensity = 0.6 + Math.sin(t * 3.5) * 0.18;
    }
    if (engineGlow2Ref.current) {
      engineGlow2Ref.current.intensity = 0.5 + Math.sin(t * 3.5 + 1.2) * 0.15;
    }

    // Navigation light blink (slow strobe)
    const strobe = Math.sin(t * 1.8) > 0.4 ? 1.0 : 0.0;
    if (navLightPortRef.current)  navLightPortRef.current.intensity = strobe * 0.9;
    if (navLightStarRef.current)  navLightStarRef.current.intensity = strobe * 0.9;
  });

  return (
    <group
      ref={spacecraftRef}
      position={SPACECRAFT_START.position}
      rotation={SPACECRAFT_START.rotation}
    >
      {/*
        NOTE: Three.js CylinderGeometry aligns along Y-axis by default.
        We rotate each cylinder part [Math.PI/2, 0, 0] to align along Z (forward).
        ConeGeometry also points along +Y by default.
      */}

      {/* ── Main Hull Body ────────────────────────────────────────── */}
      {/* Central fuselage — tapered cylinder along Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.30, 0.55, 4.2, 8, 1]} />
        <meshStandardMaterial
          color="#9aacb8"
          roughness={0.28}
          metalness={0.88}
        />
      </mesh>

      {/* Nose cone — points along +Z */}
      <mesh position={[0, 0, 2.58]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.30, 1.4, 8, 1]} />
        <meshStandardMaterial color="#c4d4e0" roughness={0.18} metalness={0.92} />
      </mesh>

      {/* Engine nacelle — rear widened collar */}
      <mesh position={[0, 0, -2.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.60, 0.44, 0.72, 8, 1]} />
        <meshStandardMaterial color="#6a7a88" roughness={0.42} metalness={0.82} />
      </mesh>

      {/* ── Wing Strakes (L & R) ─────────────────────────────────── */}
      {/* Left wing — angled down slightly */}
      <mesh position={[-1.15, -0.10, -0.3]} rotation={[0.05, 0, 0.20]}>
        <boxGeometry args={[1.8, 0.07, 1.0]} />
        <meshStandardMaterial color="#8a9aaa" roughness={0.24} metalness={0.90} />
      </mesh>

      {/* Right wing */}
      <mesh position={[1.15, -0.10, -0.3]} rotation={[0.05, 0, -0.20]}>
        <boxGeometry args={[1.8, 0.07, 1.0]} />
        <meshStandardMaterial color="#8a9aaa" roughness={0.24} metalness={0.90} />
      </mesh>

      {/* Wing tip pods — along Z */}
      <mesh position={[-1.95, -0.12, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.10, 0.70, 6]} />
        <meshStandardMaterial color="#7090a8" roughness={0.30} metalness={0.92} />
      </mesh>
      <mesh position={[1.95, -0.12, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.10, 0.70, 6]} />
        <meshStandardMaterial color="#7090a8" roughness={0.30} metalness={0.92} />
      </mesh>

      {/* ── Cockpit Dome ──────────────────────────────────────────── */}
      <mesh position={[0, 0.34, 0.55]}>
        <sphereGeometry args={[0.24, 14, 9, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial
          color="#061020"
          roughness={0.04}
          metalness={0.35}
          transparent
          opacity={0.90}
        />
      </mesh>

      {/* ── Engine Thrusters (Triple nozzle cluster) ──────────────── */}
      {/* Center nozzle */}
      <mesh position={[0, 0, -2.72]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.36, 8]} />
        <meshStandardMaterial color="#1e2e3c" roughness={0.62} metalness={0.58} />
      </mesh>
      {/* Left nozzle */}
      <mesh position={[-0.36, 0, -2.66]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.30, 8]} />
        <meshStandardMaterial color="#1e2e3c" roughness={0.62} metalness={0.58} />
      </mesh>
      {/* Right nozzle */}
      <mesh position={[0.36, 0, -2.66]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.30, 8]} />
        <meshStandardMaterial color="#1e2e3c" roughness={0.62} metalness={0.58} />
      </mesh>

      {/* ── Engine Glow ───────────────────────────────────────────── */}
      <pointLight
        ref={engineGlowRef}
        position={[0, 0, -3.1]}
        color="#60a0ff"
        intensity={1.2}
        distance={8}
        decay={2}
      />
      <pointLight
        ref={engineGlow2Ref}
        position={[0, 0, -2.8]}
        color="#b0d8ff"
        intensity={0.7}
        distance={4}
        decay={2}
      />

      {/* ── Navigation Lights ─────────────────────────────────────── */}
      {/* Port (left) — red */}
      <pointLight
        ref={navLightPortRef}
        position={[-1.95, -0.12, -0.18]}
        color="#ff3030"
        intensity={1.1}
        distance={3.0}
      />
      {/* Starboard (right) — green */}
      <pointLight
        ref={navLightStarRef}
        position={[1.95, -0.12, -0.18]}
        color="#40ff70"
        intensity={1.1}
        distance={3.0}
      />

      {/* ── Key fill light — illuminates hull from above */}
      <pointLight
        position={[0, 2.0, 0]}
        color="#c8deff"
        intensity={0.6}
        distance={7}
      />

      {/* ── Forward Rim Light ─────────────────────────────────────── */}
      <pointLight
        position={[0, 0.4, 2.0]}
        color="#a0c8ff"
        intensity={0.4}
        distance={5}
      />
    </group>
  );
};

export default Spacecraft;
