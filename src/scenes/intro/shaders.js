/**
 * shaders.js
 *
 * GLSL vertex and fragment shaders for the cinematic opening sequence:
 * VOID → AWAKENING → GRAVITY → SILENCE → IDENTITY → EXPLOSION → GALAXY → ENTRY
 *
 * Design constraints:
 *  - 100% GPU-computed motion — zero per-frame CPU allocations.
 *  - Strictly NO generic 3D objects (no spheres, cubes, meshes, globes).
 *  - Gravitational buildup uses curving orbital streamlines around an unseen center.
 *  - Radial explosion curves naturally into tangential spiral orbital motion.
 *  - Fully reversible and deterministic across the GSAP scroll timeline.
 */

export const vertexShader = /* glsl */`
  // Custom per-particle attributes
  attribute vec3  aPosVoid;       // Scattered starting position in the void
  attribute vec4  aSeed;          // (angleOffset, radiusVar, verticalWobble, speedFactor)
  attribute float aVoidOrder;     // Awaken threshold [0, 1]
  attribute vec4  aGalaxyData;    // (radius, armAngleOffset, armIndex, zThickness)
  attribute float aSize;          // Base point size
  attribute float aOpacity;       // Base opacity ceiling
  attribute vec3  aColor;         // Star color

  // Uniforms driven by GSAP timeline
  uniform float uTime;            // Elapsed time in seconds
  uniform float uPixelRatio;      // Device pixel ratio
  uniform float uVoidProgress;    // 0 = void, 1 = awakened
  uniform float uGravity;         // 0 = drifting, 1 = invisible gravity streams
  uniform float uFreeze;          // 0 = dynamic, 1 = silence & tension
  uniform float uNameReaction;    // 0 = none, 1 = framing/orbiting the name
  uniform float uExplosion;       // 0 = calm, 1 = radial explosion
  uniform float uGalaxy;          // 0 = exploded, 1 = curved into spiral galaxy
  uniform float uEnterGalaxy;     // 0 = distant, 1 = fly-through warp
  uniform float uGlobalFade;      // 1 = visible, 0 = fade out at exit

  varying float vOpacity;
  varying vec3  vColor;
  varying float vCoreBrightness;

  void main() {
    // ── 1. Awaken & Void Visibility ──────────────────────────────────────────
    // Only particles whose aVoidOrder is below uVoidProgress are visible.
    // Early on (uVoidProgress ~0.05), only ~15 isolated stars glimmer.
    float awaken = smoothstep(aVoidOrder, aVoidOrder + 0.07, uVoidProgress);
    if (awaken <= 0.001) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }

    // ── 2. Time progression with tension freeze ─────────────────────────────
    // When uFreeze approaches 1.0, motion drops by 94% (silence before identity)
    float timeSpeed = mix(1.0, 0.06, uFreeze);
    float activeTime = uTime * timeSpeed;

    // ── 3. Stage 1: Void Drift ──────────────────────────────────────────────
    vec3 posVoid = aPosVoid;
    posVoid.x += sin(activeTime * 0.20 + aSeed.x) * 0.35 * aSeed.y;
    posVoid.y += cos(activeTime * 0.16 + aSeed.z) * 0.28 * aSeed.y;
    posVoid.z += sin(activeTime * 0.14 + aSeed.x + aSeed.z) * 0.30;

    // ── 4. Stage 2: Invisible Gravity (Matter Gathering) ─────────────────────
    // Particles do NOT form a sphere or object. They accelerate inward along
    // curved orbital streamlines around the unseen center (Keplerian angular speed).
    float rVoid = length(posVoid.xy);
    float rTarget = 1.3 + aSeed.y * 3.6;
    float rGrav = mix(rVoid, rTarget, smoothstep(0.0, 1.0, uGravity));
    
    // Orbital angular velocity increases as matter gets closer to the core
    float orbitSpeed = (1.2 + 2.4 / (0.4 + rGrav * 0.5)) * uGravity;
    float gravAngle = aSeed.x + activeTime * orbitSpeed;

    vec3 posGravStream;
    posGravStream.x = cos(gravAngle) * rGrav;
    posGravStream.y = sin(gravAngle) * rGrav * 0.72 + aSeed.z * 0.75 * (1.0 - uGravity * 0.45);
    posGravStream.z = sin(gravAngle * 0.65 + aSeed.x) * rGrav * 0.50 + posVoid.z * (1.0 - uGravity * 0.75);

    vec3 posCurrent = mix(posVoid, posGravStream, smoothstep(0.0, 1.0, uGravity));

    // ── 5. Stage 3: Silence & Tension ───────────────────────────────────────
    // Center clears subtly to create visual anticipation pocket for the name
    if (uFreeze > 0.001) {
      float cDist = length(posCurrent.xy);
      if (cDist < 2.2) {
        vec2 pushAway = normalize(posCurrent.xy + vec2(0.001, 0.001));
        posCurrent.xy += pushAway * (2.2 - cDist) * 0.45 * uFreeze;
      }
    }

    // ── 6. Stage 4: Identity & Name Reaction ────────────────────────────────
    // Particles frame and orbit the perimeter of "GAUTAM GUPTA"
    if (uNameReaction > 0.001) {
      vec2 box = vec2(4.2, 1.6);
      vec2 d = abs(posCurrent.xy) - box;
      if (d.x < 1.2 && d.y < 1.2) {
        vec2 pushDir = normalize(posCurrent.xy + vec2(0.001, 0.001));
        float pushStrength = (1.2 - max(d.x, d.y)) * uNameReaction * 1.5;
        posCurrent.xy += pushDir * pushStrength;
      }
    }

    // ── 7. Stage 5: THE EXPLOSION ───────────────────────────────────────────
    // Radial outward burst with depth and individual particle velocities
    vec3 burstDir = normalize(posCurrent + vec3(sin(aSeed.x) * 0.35, cos(aSeed.y) * 0.35, aSeed.z * 0.45));
    float burstSpeed = 10.0 + aSeed.w * 16.0;
    vec3 posBurst = posCurrent + burstDir * (uExplosion * burstSpeed);

    // ── 8. Stage 6: Explosion Curves into 3D Spiral Galaxy ──────────────────
    // Procedural galaxy: logarithmic spiral arms + central bulge + disk warp
    float R = aGalaxyData.x;
    float armBase = aGalaxyData.y + aGalaxyData.z * 3.14159265;
    float spiralCurve = 2.6 * log(1.0 + R * 0.45);
    float galOrbitSpeed = (0.42 / (1.0 + R * 0.22));
    float galAngle = armBase + spiralCurve + activeTime * galOrbitSpeed;

    vec3 posGalaxy;
    posGalaxy.x = cos(galAngle) * R;
    posGalaxy.y = sin(galAngle) * R * 0.58; // tilted perspective
    float coreBulge = exp(-R * 0.55) * 1.6;
    float warp = sin(galAngle * 1.5 + R * 0.4) * 0.22 * (R / 6.0);
    posGalaxy.z = (aGalaxyData.w * (coreBulge + 0.35) + warp) * 1.3;

    // Transition from explosion into galaxy:
    // Radial burst curves into orbital spiral motion with an angular swirl
    float galBlend = smoothstep(0.0, 1.0, uGalaxy);
    float transitionSwirl = sin(galBlend * 3.14159265) * 1.8;
    float cosSw = cos(transitionSwirl);
    float sinSw = sin(transitionSwirl);
    vec3 posCurvedBurst = posBurst;
    posCurvedBurst.xy = mat2(cosSw, -sinSw, sinSw, cosSw) * posCurvedBurst.xy;

    vec3 posPreGalaxy = mix(posCurrent, posCurvedBurst, uExplosion);
    vec3 posFinal = mix(posPreGalaxy, posGalaxy, galBlend);

    // ── 9. Stage 7: Camera Enters Galaxy ────────────────────────────────────
    if (uEnterGalaxy > 0.001) {
      posFinal.z += uEnterGalaxy * 4.0 * aSeed.w;
    }

    // ── 10. Perspective Point Size & Varyings ───────────────────────────────
    vec4 mvPos = modelViewMatrix * vec4(posFinal, 1.0);
    float pSize = aSize * uPixelRatio * (28.0 / -mvPos.z);
    
    // Flare up during explosion and inside galaxy core
    pSize *= 1.0 + uExplosion * 0.4 + (1.0 - smoothstep(0.0, 2.5, R)) * 0.45 * uGalaxy;
    
    gl_PointSize = clamp(pSize, 1.0, 60.0);
    gl_Position = projectionMatrix * mvPos;

    vOpacity = aOpacity * awaken * uGlobalFade;
    vCoreBrightness = uExplosion * 0.85 * (1.0 - uGalaxy * 0.5);
    vColor = aColor;
  }
`;

export const fragmentShader = /* glsl */`
  varying float vOpacity;
  varying vec3  vColor;
  varying float vCoreBrightness;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Ethereal circular starlight particle with bright core and subtle halo
    float core = exp(-dist * dist * 38.0) * (1.0 + vCoreBrightness);
    float halo = exp(-dist * 6.5) * 0.35;
    float alpha = clamp(core + halo, 0.0, 1.0) * vOpacity;

    gl_FragColor = vec4(vColor, alpha);
  }
`;
