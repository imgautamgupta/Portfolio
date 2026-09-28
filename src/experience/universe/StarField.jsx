/**
 * StarField.jsx
 *
 * Deep space star field rendered as a single Points geometry.
 * No individual React components per star.
 * No excessive particle density.
 *
 * Design principles:
 *   - Stars distributed across two layers (far/near) for parallax depth
 *   - Subtle size variation for visual richness without artificiality
 *   - Additive blending for authentic star appearance
 *   - Minimal motion — the stars should feel fixed in deep space
 *   - GPU-computed shimmer via vertex shader time offset
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_VERTEX = /* glsl */`
  attribute float aSize;
  attribute float aFlicker;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    // Subtle shimmer per star, offset by flicker seed
    float shimmer = 0.82 + 0.18 * sin(uTime * 1.4 + aFlicker * 6.28318);
    vAlpha = shimmer;

    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (340.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const STAR_FRAGMENT = /* glsl */`
  varying float vAlpha;

  void main() {
    vec2 uv   = gl_PointCoord - 0.5;
    float d   = length(uv);
    if (d > 0.5) discard;

    float core = exp(-d * d * 22.0);
    float halo = exp(-d * 7.0) * 0.25;
    float alpha = (core + halo) * vAlpha;

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

const StarField = ({ count = 3200, tier = 'HIGH' }) => {
  const materialRef = useRef(null);
  const actualCount = tier === 'LOW' ? Math.floor(count * 0.4) : tier === 'MEDIUM' ? Math.floor(count * 0.7) : count;

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3);
    const sizes     = new Float32Array(actualCount);
    const flickers  = new Float32Array(actualCount);

    for (let i = 0; i < actualCount; i++) {
      // Large sphere distribution at great distances
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2200 + Math.random() * 2800;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Most stars are tiny; a few are slightly larger
      sizes[i]    = Math.random() < 0.04 ? 2.2 + Math.random() * 1.2 : 0.9 + Math.random() * 0.8;
      flickers[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aFlicker', new THREE.BufferAttribute(flickers, 1));

    const u = { uTime: { value: 0 } };

    return { geometry: geo, uniforms: u };
  }, [actualCount]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={STAR_VERTEX}
        fragmentShader={STAR_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default StarField;
