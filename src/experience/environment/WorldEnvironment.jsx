/**
 * WorldEnvironment.jsx
 *
 * Cinematic environment and atmosphere for the explorable digital world.
 *
 * Aesthetic:
 *   - Deep cosmic void with subtle spatial starlight dust.
 *   - Exponential depth fog for mysterious atmospheric falloff.
 *   - Topological constellation pathways connecting known sectors.
 *   - Restrained, dignified starlight lighting without garish neon or random floating geometry.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_PATHWAYS, REGIONS } from '../world/worldConfig';

const WorldEnvironment = ({ tier, isMobile }) => {
  const dustRef = useRef(null);
  const pathwaysRef = useRef(null);

  // ─── Ambient Cosmic Dust (Single BufferGeometry) ───────────────────────────
  const dustGeometry = useMemo(() => {
    const count = tier === 'HIGH' ? (isMobile ? 500 : 1200) : (isMobile ? 250 : 500);
    const positions = new Float32Array(count * 3);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across the world's functional volume
      positions[i * 3]     = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = -40 + Math.random() * 90;

      opacities[i] = 0.2 + Math.random() * 0.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    return geo;
  }, [tier, isMobile]);

  // ─── Topological Constellation Pathways (Lines connecting sectors) ─────────
  const pathwayGeometry = useMemo(() => {
    const points = [];

    for (const [startId, endId] of WORLD_PATHWAYS) {
      const start = REGIONS[startId];
      const end = REGIONS[endId];
      if (start && end) {
        points.push(new THREE.Vector3(...start.position));
        points.push(new THREE.Vector3(...end.position));
      }
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // ─── Subtle Ground Coordinate Rings ────────────────────────────────────────
  const rings = useMemo(() => [8, 18, 30, 42], []);

  // Animate slow organic drift of background dust
  useFrame((_, delta) => {
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group>
      {/* ── Atmospheric Fog ────────────────────────────────────────── */}
      <fogExp2 attach="fog" args={['#030307', 0.022]} />

      {/* ── Lighting ───────────────────────────────────────────────── */}
      <ambientLight intensity={0.45} color="#cbd5e1" />
      <directionalLight position={[20, 30, 25]} intensity={0.85} color="#f8fafc" />
      <pointLight position={[0, 4, 0]} intensity={1.2} distance={30} color="#818cf8" />

      {/* ── Ambient Cosmic Dust ────────────────────────────────────── */}
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          size={isMobile ? 1.5 : 2.2}
          color="#94a3b8"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Topological Constellation Pathways ──────────────────────── */}
      <lineSegments ref={pathwaysRef} geometry={pathwayGeometry}>
        <lineBasicMaterial
          color="#334155"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </lineSegments>

      {/* ── Spatial Reference Rings (Ground Horizon) ────────────────── */}
      <group position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {rings.map((radius) => (
          <mesh key={radius}>
            <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
            <meshBasicMaterial
              color="#1e293b"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default WorldEnvironment;
