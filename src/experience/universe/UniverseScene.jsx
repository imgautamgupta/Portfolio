/**
 * UniverseScene.jsx
 *
 * R3F scene root — lives inside <Canvas>.
 * All per-frame state is owned by refs inside SpacecraftController.
 * No React state changes occur during the render loop.
 */

import { useRef } from 'react';

import Spacecraft           from './Spacecraft';
import SpacecraftController from './SpacecraftController';
import CinematicCamera      from './CinematicCamera';
import StarField            from './StarField';
import CelestialBody        from './CelestialBody';
import DestinationBeacon    from './DestinationBeacon';
import { DESTINATION_LIST } from './universeConfig';

const UniverseScene = ({ qualityTier, isMobile, reduced }) => {
  // The spacecraft group is the shared physics object.
  // All systems read this same ref — no data copying.
  const spacecraftRef = useRef(null);

  return (
    <>
      {/* ── Global Lights ─────────────────────────────────────────── */}
      <ambientLight color="#141824" intensity={0.55} />

      <directionalLight
        position={[0, 80, -350]}
        color="#ffe8a0"
        intensity={3.2}
        castShadow={false}
      />

      <hemisphereLight
        skyColor="#1a2860"
        groundColor="#040610"
        intensity={0.40}
      />

      <directionalLight
        position={[100, -20, 300]}
        color="#203060"
        intensity={0.5}
      />

      {/* ── Star Field ────────────────────────────────────────────── */}
      <StarField count={3500} tier={qualityTier} />

      {/* ── Celestial Bodies ──────────────────────────────────────── */}
      {DESTINATION_LIST.map((dest) => (
        <CelestialBody
          key={dest.id}
          destination={dest}
          reduced={reduced}
        />
      ))}

      {/* ── Destination Beacons ───────────────────────────────────── */}
      {DESTINATION_LIST.map((dest) => (
        <DestinationBeacon
          key={dest.id}
          destination={dest}
          spacecraftRef={spacecraftRef}
        />
      ))}

      {/* ── Spacecraft mesh ───────────────────────────────────────── */}
      <Spacecraft spacecraftRef={spacecraftRef} reduced={reduced} />

      {/* ── Physics engine (writes to physicsState singleton) ─────── */}
      <SpacecraftController
        spacecraftRef={spacecraftRef}
        reduced={reduced}
      />

      {/* ── Cinematic camera ──────────────────────────────────────── */}
      <CinematicCamera
        spacecraftRef={spacecraftRef}
        isMobile={isMobile}
        reduced={reduced}
      />
    </>
  );
};

export default UniverseScene;
