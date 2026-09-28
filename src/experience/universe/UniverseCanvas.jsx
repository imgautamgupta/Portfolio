/**
 * UniverseCanvas.jsx
 *
 * The outer Canvas wrapper for the interstellar universe.
 * This is the React component that creates the WebGL context.
 *
 * Responsibilities:
 *   - Create the Three.js renderer via R3F <Canvas>
 *   - Configure tone mapping, shadows, DPR cap (from performance tier)
 *   - Initialize InputSystem on mount / destroy on unmount
 *   - Pass quality props down to UniverseScene
 */

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import UniverseScene from './UniverseScene';
import inputSystem from './InputSystem';
import { getQualityPreset } from '../PerformanceManager';
import { getReducedMotion } from '../../animation/hooks/useReducedMotion';
import { isWebGLAvailable } from '../../utils/webgl';

const UniverseCanvas = ({ qualityTier, isMobile }) => {
  const preset = getQualityPreset();
  const reduced = getReducedMotion();

  useEffect(() => {
    inputSystem.init();
    return () => inputSystem.destroy();
  }, []);

  if (!isWebGLAvailable()) return null; // ExperienceRoot handles the fallback

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, preset.dprCap]}
      gl={{
        antialias: qualityTier !== 'LOW',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      camera={{ fov: 72, near: 0.1, far: 12000 }}
      shadows={false}
    >
      <UniverseScene
        qualityTier={qualityTier}
        isMobile={isMobile}
        reduced={reduced}
      />
    </Canvas>
  );
};

export default UniverseCanvas;
