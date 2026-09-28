/**
 * IntroCanvas.jsx
 *
 * React Three Fiber canvas for the cinematic opening sequence.
 *
 * Pattern:
 *   - SceneUpdater runs inside useFrame (R3F's RAF) and reads from worldStateRef.
 *   - worldStateRef is mutated externally by the GSAP ScrollTrigger timeline.
 *   - Mouse parallax from InteractionManager provides subtle depth response.
 *   - The camera is smoothly lerped toward the target position every frame.
 *   - No React state is used for continuously-changing values.
 */

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import InteractionManager from '../../experience/InteractionManager';

// Pre-allocated Vector3 used for camera lerp to avoid garbage collection
const _target = new THREE.Vector3();

/**
 * SceneUpdater
 * Runs every R3F frame. Applies worldState to uniforms and lerps camera.
 */
const SceneUpdater = ({ worldStateRef, uniformsRef, config }) => {
  const { camera } = useThree();
  const im = InteractionManager.getInstance();

  useFrame(() => {
    const ws       = worldStateRef.current;
    const uniforms = uniformsRef.current;

    // ── Apply shader uniforms ──────────────────────────────────────────────
    if (uniforms) {
      uniforms.uVoidProgress.value = ws.voidProgress;
      uniforms.uGravity.value      = ws.gravity;
      uniforms.uFreeze.value       = ws.freeze;
      uniforms.uNameReaction.value = ws.nameReaction;
      uniforms.uExplosion.value    = ws.explosion;
      uniforms.uGalaxy.value       = ws.galaxy;
      uniforms.uEnterGalaxy.value  = ws.enterGalaxy;
      uniforms.uGlobalFade.value   = ws.globalFade;
    }

    // ── Subtle pointer parallax ───────────────────────────────────────────
    const pointer = im.getNormalized();
    const px = pointer.x * (config.isMobile ? 0.08 : 0.35);
    const py = pointer.y * (config.isMobile ? 0.06 : 0.25);

    // ── Smooth camera toward GSAP target with cinematic inertia ───────────
    _target.set(ws.cameraX + px, ws.cameraY + py, ws.cameraZ);
    camera.position.lerp(_target, config.cameraLerp);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const IntroCanvas = ({ config, worldStateRef, uniformsRef }) => {
  const { camera } = config;

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{
        position: [camera.start.x, camera.start.y, camera.start.z],
        fov:  config.cameraFov,
        near: 0.1,
        far:  200,
      }}
      gl={{
        antialias:             config.antialias,
        powerPreference:       'high-performance',
        alpha:                 false,
        preserveDrawingBuffer: false,
      }}
      dpr={config.dpr}
    >
      {/* Deep cosmic void background */}
      <color attach="background" args={['#030305']} />

      <ParticleField
        config={config}
        uniformsRef={uniformsRef}
      />

      <SceneUpdater
        worldStateRef={worldStateRef}
        uniformsRef={uniformsRef}
        config={config}
      />
    </Canvas>
  );
};

export default IntroCanvas;
