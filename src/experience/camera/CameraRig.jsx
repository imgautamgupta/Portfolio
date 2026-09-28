/**
 * CameraRig.jsx
 *
 * R3F Camera controller for the explorable digital world.
 *
 * Key features:
 *   - Drives camera interpolation through TransitionManager without React re-renders.
 *   - Blends subtle pointer/touch parallax for immersive spatial depth.
 *   - Adapts to mobile/desktop aspect ratios and reduced-motion settings.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import transitionManager from '../transitions/TransitionManager';
import InteractionManager from '../InteractionManager';
import { useWorldState } from '../WorldState';

const CameraRig = ({ isMobile }) => {
  const { camera } = useThree();
  const im = InteractionManager.getInstance();
  const worldState = useWorldState();

  // Pre-allocated vector for parallax calculation
  const parallaxRef = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const pointer = im.getNormalized();

    // In FREE exploration, pointer creates gentle spatial parallax
    const factorX = isMobile ? 0.4 : 1.2;
    const factorY = isMobile ? 0.3 : 0.8;

    if (worldState.explorationMode === 'FREE') {
      parallaxRef.current.x = THREE.MathUtils.lerp(
        parallaxRef.current.x,
        pointer.x * factorX,
        0.05
      );
      parallaxRef.current.y = THREE.MathUtils.lerp(
        parallaxRef.current.y,
        pointer.y * factorY,
        0.05
      );
    } else {
      // In INSPECTING or MAP mode, dampen user parallax
      parallaxRef.current.x = THREE.MathUtils.lerp(parallaxRef.current.x, 0, 0.08);
      parallaxRef.current.y = THREE.MathUtils.lerp(parallaxRef.current.y, 0, 0.08);
    }

    // Step camera position and lookAt via TransitionManager
    transitionManager.update(camera, delta, parallaxRef.current);
  });

  return null;
};

export default CameraRig;
