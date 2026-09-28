/**
 * flightConfig.js
 *
 * Single source of truth for all spacecraft flight-model parameters.
 * Change values here to tune how the ship feels — nothing else needs editing.
 *
 * Tuned for: "cinematic exploration craft" — deliberate, weighty, elegant.
 * NOT tuned for: fast-paced arcade game. The ship should feel purposeful.
 *
 * ─── HOW TO READ THESE VALUES ────────────────────────────────────────────────
 *
 *  LINEAR (translation)
 *    THRUST_ACCEL    — How quickly the ship gains speed from engines
 *                      Higher = snappier acceleration
 *    MAX_SPEED       — Cruise speed ceiling (units/s)
 *    LINEAR_DRAG     — Passive drag: fraction of velocity retained per second
 *                      (exponential decay). 0.72 = 28% lost per second.
 *                      Lower = shorter drift. Values < 0.50 feel sticky.
 *    BRAKE_DRAG      — Drag when Shift is held (should be << LINEAR_DRAG)
 *
 *  BOOST
 *    BOOST_MULTIPLIER  — Acceleration multiplier during boost
 *    BOOST_MAX_SPEED   — Speed ceiling during boost
 *    BOOST_RAMP_IN     — How fast boost power ramps from 0→1 (s⁻¹ exp decay)
 *    BOOST_RAMP_OUT    — How fast boost power falls from 1→0 (s⁻¹ exp decay)
 *
 *  ANGULAR (rotation)
 *    YAW_ACCEL       — Turn rate buildup (rad/s²)
 *    YAW_MAX         — Maximum yaw angular velocity (rad/s)
 *    ROLL_ACCEL      — Roll rate buildup (rad/s²)
 *    ROLL_MAX        — Maximum roll angular velocity (rad/s)
 *    ANGULAR_DRAG    — Fraction of angular velocity retained per second
 *
 *  BANK (visual only)
 *    BANK_ANGLE      — Max Z-rotation lean when yawing (radians)
 *    BANK_SPEED      — How fast the bank lean tracks input (s⁻¹ exp decay)
 *
 *  CAMERA
 *    CAM_OFFSET      — Local-space offset behind/above the ship [x, y, z]
 *    CAM_LOOKAT      — Local-space point camera looks toward [x, y, z]
 *    CAM_POS_SPEED   — Position follow speed (s⁻¹). Higher = tighter.
 *    CAM_ROT_SPEED   — Orientation follow speed (s⁻¹). Higher = tighter.
 *    CAM_PARALLAX    — Pointer parallax displacement magnitude
 *
 *  BOUNDARY
 *    BOUNDARY_RADIUS     — Distance from origin where soft boundary activates
 *    BOUNDARY_FORCE      — Return force acceleration (units/s²)
 *    BOUNDARY_FOG_START  — Fraction of radius where atmospheric fog starts
 */

const flightConfig = Object.freeze({

  // ── Linear motion ────────────────────────────────────────────────────────
  THRUST_ACCEL:   48,      // units/s²  — deliberately moderate ramp
  MAX_SPEED:      85,      // units/s   — cruise ceiling
  LINEAR_DRAG:    0.72,    // fraction retained per second  (1 = no drag)
  BRAKE_DRAG:     0.20,    // fraction retained per second when Shift held

  // ── Boost ────────────────────────────────────────────────────────────────
  BOOST_MULTIPLIER: 2.6,   // thrust multiplier at peak boost
  BOOST_MAX_SPEED:  210,   // units/s ceiling during boost
  BOOST_RAMP_IN:    3.5,   // s⁻¹ — how fast boost power rises (exp rate)
  BOOST_RAMP_OUT:   2.0,   // s⁻¹ — how fast boost power falls (exp rate)

  // ── Angular motion ───────────────────────────────────────────────────────
  YAW_ACCEL:      1.05,    // rad/s²
  YAW_MAX:        1.20,    // rad/s  — max turn rate
  ROLL_ACCEL:     0.65,    // rad/s²
  ROLL_MAX:       0.90,    // rad/s
  ANGULAR_DRAG:   0.20,    // fraction retained per second

  // ── Visual bank lean ─────────────────────────────────────────────────────
  BANK_ANGLE:     0.28,    // radians — max lean
  BANK_SPEED:     3.5,     // s⁻¹ — exp-decay rate toward target

  // ── Camera rig ────────────────────────────────────────────────────────────
  CAM_OFFSET_X:   0,
  CAM_OFFSET_Y:   3.6,
  CAM_OFFSET_Z:  -13.5,    // local -Z: behind the ship
  CAM_LOOKAT_X:   0,
  CAM_LOOKAT_Y:   0.4,
  CAM_LOOKAT_Z:   30,      // local +Z: ahead of the ship (looking along forward vector)
  CAM_POS_SPEED:  3.2,     // s⁻¹ — position exp-follow
  CAM_ROT_SPEED:  4.5,     // s⁻¹ — orientation exp-follow (quaternion slerp rate)
  CAM_PARALLAX:   1.6,     // world-units pointer parallax

  // ── Soft world boundary ──────────────────────────────────────────────────
  BOUNDARY_RADIUS:    1600, // units from origin
  BOUNDARY_FORCE:     28,   // units/s² return acceleration
  BOUNDARY_FOG_START: 0.75, // 0-1 fraction where fog begins

  // ── Proximity detection ───────────────────────────────────────────────────
  PROXIMITY_CHECK_INTERVAL: 12,  // run check every N frames
  PROXIMITY_NEAR_THRESHOLD: 800, // beyond this no "nearest" is shown

});

export default flightConfig;
