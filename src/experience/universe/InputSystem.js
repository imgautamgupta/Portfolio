/**
 * InputSystem.js
 *
 * Abstracted input layer for the spacecraft movement system.
 * Decouples movement physics from specific input devices.
 *
 * Currently supports:
 *   - Keyboard (WASD + Arrows + Space + Shift)
 *
 * Future support hooks (stubs):
 *   - Gamepad (via Gamepad API)
 *   - Touch / virtual joystick
 *   - Mouse orbit
 *
 * The movement system reads from InputSystem.getState() each frame.
 * No React state involved. Zero per-frame allocations.
 *
 * Controls:
 *   W / ↑         Forward thrust
 *   S / ↓         Brake / reverse thrust
 *   A / ←         Yaw left
 *   D / →         Yaw right
 *   Q             Roll left
 *   E             Roll right
 *   Space         Boost
 *   Shift         Stabilize (rapid deceleration)
 */

class InputSystemClass {
  constructor() {
    // Normalized input axes [-1, +1]
    this._state = {
      thrust:    0, // -1 = brake/reverse, +1 = forward
      yaw:       0, // -1 = left, +1 = right
      pitch:     0, // -1 = down, +1 = up
      roll:      0, // -1 = CCW, +1 = CW
      boost:     false,
      stabilize: false,
    };

    // Raw key set
    this._keys = new Set();

    this._initialized = false;
    this._handlers = {};
  }

  init() {
    if (this._initialized || typeof window === 'undefined') return;
    this._initialized = true;

    this._handlers.keydown = (e) => {
      // Ignore when typing in input fields
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      this._keys.add(e.code);
    };
    this._handlers.keyup = (e) => this._keys.delete(e.code);
    this._handlers.blur = () => this._keys.clear();

    window.addEventListener('keydown', this._handlers.keydown);
    window.addEventListener('keyup', this._handlers.keyup);
    window.addEventListener('blur', this._handlers.blur);
  }

  destroy() {
    if (!this._initialized) return;
    window.removeEventListener('keydown', this._handlers.keydown);
    window.removeEventListener('keyup', this._handlers.keyup);
    window.removeEventListener('blur', this._handlers.blur);
    this._keys.clear();
    this._handlers = {};
    this._initialized = false;
  }

  /**
   * Called once per frame to compute the normalized input state.
   * Returns the current state reference (not a new object — zero GC).
   */
  update() {
    const k = this._keys;

    const forward = (k.has('KeyW') || k.has('ArrowUp'))    ? 1 : 0;
    const back    = (k.has('KeyS') || k.has('ArrowDown'))  ? 1 : 0;
    const left    = (k.has('KeyA') || k.has('ArrowLeft'))  ? 1 : 0;
    const right   = (k.has('KeyD') || k.has('ArrowRight')) ? 1 : 0;

    this._state.thrust    = forward - back;
    this._state.yaw       = right - left;
    this._state.pitch     = 0; // reserved for mouse/gamepad
    this._state.roll      = (k.has('KeyE') ? 1 : 0) - (k.has('KeyQ') ? 1 : 0);
    this._state.boost     = k.has('Space');
    this._state.stabilize = k.has('ShiftLeft') || k.has('ShiftRight');

    return this._state;
  }

  /**
   * Returns a copy of the last computed state.
   * Call update() first each frame.
   */
  getState() {
    return this._state;
  }

  /** Check if any movement key is pressed */
  isAnyMovementActive() {
    const s = this._state;
    return s.thrust !== 0 || s.yaw !== 0 || s.roll !== 0 || s.boost || s.stabilize;
  }
}

// Singleton — one input system for the entire application
export const inputSystem = new InputSystemClass();
export default inputSystem;
