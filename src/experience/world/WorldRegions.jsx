/**
 * WorldRegions.jsx
 *
 * Interactive 3D Sector Beacons for the explorable digital world.
 *
 * Renders:
 *   - Central Hub
 *   - The Mind
 *   - The Journey
 *   - The Lab
 *   - Projects Sector
 *   - Comms Relay
 *
 * Each region is an interactive beacon with:
 *   - Luminous core and orbital indicator ring.
 *   - Hover feedback (spatial expansion and cursor hint).
 *   - Click to travel or open sector details.
 *   - Discovery status indication.
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { REGION_LIST } from './worldConfig';
import { worldState, useWorldState } from '../WorldState';

/**
 * Individual Interactive Region Landmark
 */
const RegionBeacon = ({ region, isCurrent, isDiscovered }) => {
  const meshRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Animate beacon breathing and rotation
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.position.y = region.position[1] + Math.sin(t * 1.5 + region.position[0]) * 0.25;
      meshRef.current.rotation.y += delta * 0.4;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
      const targetScale = hovered ? 1.3 : isCurrent ? 1.15 : 1.0;
      ringRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      // If already at region, open the content inspector
      worldState.inspectSector(region.id);
    } else {
      // Travel to the region
      worldState.travelTo(region.id);
    }
  };

  return (
    <group position={region.position}>
      {/* ── Core Beacon Landmark ───────────────────────────────────── */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[hovered ? 0.95 : 0.75, 0]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : region.color}
          emissive={region.color}
          emissiveIntensity={hovered ? 0.9 : 0.45}
          roughness={0.2}
          metalness={0.8}
          wireframe={!isDiscovered}
        />
      </mesh>

      {/* ── Orbital Beacon Halo Ring ───────────────────────────────── */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ringGeometry args={[1.3, 1.45, 32]} />
        <meshBasicMaterial
          color={region.color}
          transparent
          opacity={hovered ? 0.85 : isCurrent ? 0.6 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Subtle Region Beacon Light ─────────────────────────────── */}
      <pointLight
        color={region.color}
        intensity={hovered ? 1.5 : isCurrent ? 1.0 : 0.4}
        distance={12}
        position={[0, 1, 0]}
      />

      {/* ── Spatial World Label (Drei HTML) ────────────────────────── */}
      <Html
        position={[0, 1.8, 0]}
        center
        distanceFactor={22}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'all 0.3s ease-out',
          transform: `scale(${hovered ? 1.08 : 1.0})`,
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className={`px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-semibold border backdrop-blur-md whitespace-nowrap transition-all duration-300 ${
              isCurrent
                ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                : hovered
                ? 'bg-neutral-900/90 border-neutral-400 text-white'
                : 'bg-neutral-950/60 border-neutral-700/60 text-neutral-400'
            }`}
          >
            {region.label}
          </div>
          <span className="text-[8px] text-neutral-500 tracking-widest uppercase mt-1">
            {isCurrent ? '[ACTIVE SECTOR]' : isDiscovered ? 'DISCOVERED' : 'UNEXPLORED'}
          </span>
        </div>
      </Html>
    </group>
  );
};

/**
 * WorldRegions Container
 */
const WorldRegions = () => {
  const currentWorldState = useWorldState();
  const { currentLocation, discoveredLocations } = currentWorldState;
  const discoveredSet = new Set(discoveredLocations);

  return (
    <group>
      {REGION_LIST.map((region) => (
        <RegionBeacon
          key={region.id}
          region={region}
          isCurrent={currentLocation === region.id}
          isDiscovered={discoveredSet.has(region.id)}
        />
      ))}
    </group>
  );
};

export default WorldRegions;
