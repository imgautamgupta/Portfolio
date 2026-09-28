/**
 * WorldCanvas.jsx
 *
 * Dedicated React Three Fiber canvas for the explorable digital world.
 *
 * Features:
 *   - Hosts WorldEnvironment, WorldRegions, and CameraRig.
 *   - Enforces device-aware DPR and antialias capabilities via PerformanceManager.
 *   - Runs on the single primary render loop.
 */

import { Canvas } from '@react-three/fiber';
import WorldEnvironment from '../environment/WorldEnvironment';
import WorldRegions from './WorldRegions';
import CameraRig from '../camera/CameraRig';
import { getQualityPreset, getQualityTier } from '../PerformanceManager';

const WorldCanvas = () => {
  const tier = getQualityTier();
  const preset = getQualityPreset();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
      }}
      camera={{
        position: [0, 5.5, 13.5],
        fov: isMobile ? 62 : 48,
        near: 0.1,
        far: 250,
      }}
      gl={{
        antialias: preset.antialias ?? (tier === 'HIGH'),
        powerPreference: 'high-performance',
        alpha: false,
        preserveDrawingBuffer: false,
      }}
      dpr={[1, preset.dprCap || 2]}
    >
      {/* Deep cosmic void background */}
      <color attach="background" args={['#030307']} />

      {/* Atmospheric Environment & Dust */}
      <WorldEnvironment tier={tier} isMobile={isMobile} />

      {/* Interactive 3D World Regions */}
      <WorldRegions />

      {/* Camera Rig & Orbit Interpolation */}
      <CameraRig isMobile={isMobile} />
    </Canvas>
  );
};

export default WorldCanvas;
