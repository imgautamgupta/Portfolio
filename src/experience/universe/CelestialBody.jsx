/**
 * CelestialBody.jsx
 *
 * Renders a single celestial destination in the universe:
 *   - Star / Planet / Asteroid Cluster
 *
 * Features:
 *   - PBR materials with per-destination color/roughness/metalness
 *   - Atmospheric shell (slightly enlarged transparent sphere)
 *   - Optional planetary ring (e.g. Journey destination)
 *   - Subtle slow self-rotation
 *   - Corona glow for the home star
 *   - NO floating labels by default — discovered on approach
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CelestialBody = ({ destination, reduced }) => {
  const meshRef = useRef(null);
  const atmoRef = useRef(null);
  const coronaRef = useRef(null);

  const { vp } = { vp: destination.visualParams };
  const rotSpeed = vp?.rotationSpeed ?? 0.004;

  // Build materials once
  const { bodyMat, atmoMat, coronaMat } = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color:    new THREE.Color(destination.color),
      emissive: new THREE.Color(destination.emissive ?? '#000000'),
      emissiveIntensity: destination.emissiveIntensity ?? 0,
      roughness: destination.roughness ?? 0.7,
      metalness: destination.metalness ?? 0.1,
    });

    const atmo = new THREE.MeshStandardMaterial({
      color:       new THREE.Color(destination.atmosphereColor ?? destination.color),
      emissive:    new THREE.Color(destination.color),
      emissiveIntensity: destination.type === 'star' ? 0 : 0.12,
      transparent: true,
      opacity:     destination.type === 'star' ? 0.06 : 0.20,
      depthWrite:  false,
      side:        THREE.FrontSide,
    });

    let corona = null;
    if (destination.type === 'star') {
      corona = new THREE.MeshBasicMaterial({
        color:       new THREE.Color(destination.atmosphereColor ?? '#ff8844'),
        transparent: true,
        opacity:     vp?.coronaOpacity ?? 0.09,
        depthWrite:  false,
        side:        THREE.FrontSide,
      });
    }

    return { bodyMat: body, atmoMat: atmo, coronaMat: corona };
  }, [destination]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useFrame((_, delta) => {
    if (reduced) return;
    if (meshRef.current) meshRef.current.rotation.y += delta * rotSpeed;
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.002;
      const pulse = vp?.pulseAmplitude ?? 0;
      if (pulse > 0) {
        const s = 1.0 + Math.sin(Date.now() * 0.001) * pulse;
        coronaRef.current.scale.setScalar(s);
      }
    }
  });

  const r = destination.radius;
  const atmoScale = destination.type === 'star' ? 1.065 : 1.055;
  const coronaScale = vp?.coronaRadius ? vp.coronaRadius / r : 1.52;

  return (
    <group position={destination.position}>
      {/* ── Main Celestial Body ───────────────────────────────────── */}
      <mesh ref={meshRef} material={bodyMat}>
        <sphereGeometry args={[r, 48, 32]} />
      </mesh>

      {/* ── Atmosphere Shell ──────────────────────────────────────── */}
      <mesh ref={atmoRef} material={atmoMat} scale={atmoScale}>
        <sphereGeometry args={[r, 32, 24]} />
      </mesh>

      {/* ── Corona (star only) ────────────────────────────────────── */}
      {destination.type === 'star' && coronaMat && (
        <mesh ref={coronaRef} material={coronaMat} scale={coronaScale}>
          <sphereGeometry args={[r, 24, 18]} />
        </mesh>
      )}

      {/* ── Planetary Ring (Journey) ──────────────────────────────── */}
      {vp?.ringRadius && (
        <mesh rotation={[Math.PI * 0.3, 0.4, 0.1]}>
          <ringGeometry args={[vp.ringRadius * 0.85, vp.ringRadius, 64]} />
          <meshBasicMaterial
            color={destination.color}
            transparent
            opacity={vp.ringOpacity ?? 0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Light Emission for Star ────────────────────────────────── */}
      {destination.type === 'star' && (
        <pointLight
          color={destination.atmosphereColor ?? '#ffffff'}
          intensity={3.5}
          distance={1800}
          decay={1.5}
        />
      )}

      {/* ── Subtle ambient halo for planets ──────────────────────── */}
      {destination.type !== 'star' && (
        <pointLight
          color={destination.color}
          intensity={0.55}
          distance={destination.radius * 9}
          decay={1.5}
        />
      )}
    </group>
  );
};

export default CelestialBody;
