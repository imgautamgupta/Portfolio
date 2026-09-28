/**
 * physicsState.js
 *
 * Shared mutable physics state readable outside the R3F Canvas tree.
 * Written by SpacecraftController every frame.
 * Read by DebugOverlay (DOM component, outside Canvas) via setInterval.
 *
 * Uses a module-level singleton so no React context or prop drilling needed.
 * This is safe because there is exactly one spacecraft in the world.
 */

import * as THREE from 'three';

const physicsState = {
  speed:    0,
  pos:      new THREE.Vector3(),
  boostPwr: 0,
  angYaw:   0,
  fps:      60,
};

export default physicsState;
