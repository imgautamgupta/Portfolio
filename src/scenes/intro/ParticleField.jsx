/**
 * ParticleField.jsx
 *
 * Single-geometry GPU particle system for the cinematic opening sequence.
 *
 * Architecture:
 *  - ONE BufferGeometry with typed Float32Arrays — zero per-frame CPU allocations.
 *  - Procedural 3D Galaxy, gravitational streams, and void positions are computed once.
 *  - All dynamic motion (Void → Awakening → Gravity → Freeze → Identity → Explosion → Galaxy → Entry)
 *    is calculated purely on the GPU inside the vertex shader.
 *  - Uniforms are updated via uniformsRef by SceneUpdater inside useFrame.
 */

import { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

const ParticleField = ({ config, uniformsRef }) => {
  const { geometry, material } = useMemo(() => {
    const N = config.particleCount;
    const { voidBounds, galaxyRadius } = config;

    // Allocate typed arrays once
    const posVoid     = new Float32Array(N * 3);
    const seeds       = new Float32Array(N * 4);
    const voidOrders  = new Float32Array(N);
    const galaxyData  = new Float32Array(N * 4);
    const sizes       = new Float32Array(N);
    const opacities   = new Float32Array(N);
    const colors      = new Float32Array(N * 3);

    // Starlight palette: pure warm white, celestial blue, and muted cosmic slate
    const cWhite   = new THREE.Color(0.96, 0.98, 1.00);
    const cDiamond = new THREE.Color(1.00, 1.00, 1.00);
    const cBlue    = new THREE.Color(0.78, 0.84, 0.96);
    const cSlate   = new THREE.Color(0.55, 0.60, 0.74);

    const [sMin, sMax] = config.sizeRange;

    for (let i = 0; i < N; i++) {
      // ── 1. Void Position: Scattered across deep 3D space ──────────────────
      posVoid[i * 3]     = (Math.random() - 0.5) * voidBounds.x * 2;
      posVoid[i * 3 + 1] = (Math.random() - 0.5) * voidBounds.y * 2;
      // Deep Z spread — some near, some far
      posVoid[i * 3 + 2] = voidBounds.zNear + Math.random() * (voidBounds.zFar - voidBounds.zNear);

      // ── 2. Void Order: The first ~15 particles wake up first in Scene 02 ──
      if (i < 15) {
        voidOrders[i] = (i / 15) * 0.035; // awaken early during "The First Particles"
      } else {
        voidOrders[i] = 0.04 + Math.random() * 0.96;
      }

      // ── 3. Seed: Per-particle random variations ──────────────────────────
      seeds[i * 4]     = Math.random() * Math.PI * 2;              // angle offset
      seeds[i * 4 + 1] = 0.5 + Math.random() * 1.0;                // radius scale
      seeds[i * 4 + 2] = (Math.random() - 0.5) * 2.0;              // inclination / wobble
      seeds[i * 4 + 3] = 0.7 + Math.random() * 0.7;                // explosion speed factor

      // ── 4. Galaxy Data: Procedural 3D spiral galaxy structure ────────────
      // Density distributed: higher concentration toward galactic nucleus
      const rRatio = Math.pow(Math.random(), 1.6);
      const r = 0.4 + (galaxyRadius - 0.4) * rRatio;

      // 2 major spiral arms (index 0 and 1) with angular spread
      const armIndex = Math.random() < 0.5 ? 0.0 : 1.0;
      const armSpread = (Math.random() - 0.5) * 0.45;

      // Galactic disk vertical thickness
      const zThickness = (Math.random() - 0.5) * 2.0;

      galaxyData[i * 4]     = r;
      galaxyData[i * 4 + 1] = armSpread;
      galaxyData[i * 4 + 2] = armIndex;
      galaxyData[i * 4 + 3] = zThickness;

      // ── 5. Size ──────────────────────────────────────────────────────────
      sizes[i] = sMin + Math.random() * (sMax - sMin);
      // ~4% prominent bright anchor stars
      if (Math.random() < 0.04) sizes[i] *= 2.2;

      // ── 6. Opacity ───────────────────────────────────────────────────────
      opacities[i] = 0.45 + Math.random() * 0.55;

      // ── 7. Color Distribution ────────────────────────────────────────────
      const rnd = Math.random();
      const col = rnd < 0.08 ? cDiamond : rnd < 0.48 ? cWhite : rnd < 0.80 ? cBlue : cSlate;
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    // Single BufferGeometry
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',    new THREE.BufferAttribute(posVoid, 3));
    geo.setAttribute('aPosVoid',    new THREE.BufferAttribute(posVoid, 3));
    geo.setAttribute('aSeed',       new THREE.BufferAttribute(seeds, 4));
    geo.setAttribute('aVoidOrder',  new THREE.BufferAttribute(voidOrders, 1));
    geo.setAttribute('aGalaxyData', new THREE.BufferAttribute(galaxyData, 4));
    geo.setAttribute('aSize',       new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aOpacity',    new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute('aColor',      new THREE.BufferAttribute(colors, 3));

    // Material Uniforms
    const uniforms = {
      uTime:         { value: 0.0 },
      uPixelRatio:   { value: Math.min(window.devicePixelRatio || 1, 2) },
      uVoidProgress: { value: 0.0 },
      uGravity:      { value: 0.0 },
      uFreeze:       { value: 0.0 },
      uNameReaction: { value: 0.0 },
      uExplosion:    { value: 0.0 },
      uGalaxy:       { value: 0.0 },
      uEnterGalaxy:  { value: 0.0 },
      uGlobalFade:   { value: 1.0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [config]);

  // Expose uniforms to parent updater
  useEffect(() => {
    if (uniformsRef) uniformsRef.current = material.uniforms;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, uniformsRef]);

  // Advance time on each RAF frame
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry} material={material} />
  );
};

export default ParticleField;
