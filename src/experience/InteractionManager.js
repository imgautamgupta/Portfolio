/**
 * InteractionManager
 *
 * Centralized pointer/touch state manager for the cinematic experience.
 *
 * Currently a lightweight stub that provides a clean API surface.
 * Future tasks will expand this to feed pointer data into:
 *   - Three.js raycasting
 *   - GSAP magnetic effects
 *   - Custom cursor deformation
 *   - Scene camera tilt
 *
 * Design principles:
 *   - ONE global pointer listener, not per-component listeners
 *   - Normalized coordinates in [-1, 1] range (standard for Three.js)
 *   - Passive event listeners to avoid blocking the main thread
 *   - Proper cleanup on destroy()
 *
 * Usage:
 *   import { InteractionManager } from '../experience/InteractionManager';
 *   const im = InteractionManager.getInstance();
 *   const { x, y } = im.getNormalized(); // [-1, 1]
 */

class InteractionManagerClass {
  constructor() {
    /** Raw client coordinates */
    this.client = { x: 0, y: 0 };
    /** Normalized coordinates [-1, 1] (standard Three.js NDC) */
    this.normalized = { x: 0, y: 0 };
    /** Whether a pointer button is currently pressed */
    this.isPressed = false;
    /** Whether the pointer is inside the viewport */
    this.isInViewport = false;

    this._initialized = false;
    this._handlers = {};
  }

  /**
   * Initialise global event listeners.
   * Call once at application startup.
   */
  init() {
    if (this._initialized || typeof window === 'undefined') return;
    this._initialized = true;

    this._handlers.pointermove = this._onPointerMove.bind(this);
    this._handlers.pointerdown = this._onPointerDown.bind(this);
    this._handlers.pointerup = this._onPointerUp.bind(this);
    this._handlers.pointerenter = this._onPointerEnter.bind(this);
    this._handlers.pointerleave = this._onPointerLeave.bind(this);

    window.addEventListener('pointermove', this._handlers.pointermove, { passive: true });
    window.addEventListener('pointerdown', this._handlers.pointerdown, { passive: true });
    window.addEventListener('pointerup', this._handlers.pointerup, { passive: true });
    document.addEventListener('pointerenter', this._handlers.pointerenter, { passive: true });
    document.addEventListener('pointerleave', this._handlers.pointerleave, { passive: true });
  }

  /**
   * Remove all event listeners.
   * Call on application teardown or HMR dispose.
   */
  destroy() {
    if (!this._initialized) return;

    window.removeEventListener('pointermove', this._handlers.pointermove);
    window.removeEventListener('pointerdown', this._handlers.pointerdown);
    window.removeEventListener('pointerup', this._handlers.pointerup);
    document.removeEventListener('pointerenter', this._handlers.pointerenter);
    document.removeEventListener('pointerleave', this._handlers.pointerleave);

    this._handlers = {};
    this._initialized = false;
  }

  /**
   * Get normalized pointer coordinates [-1, 1].
   * x: -1 = left, 1 = right
   * y: -1 = bottom, 1 = top  (inverted — matches Three.js/WebGL convention)
   *
   * @returns {{ x: number, y: number }}
   */
  getNormalized() {
    return { ...this.normalized };
  }

  /**
   * Get raw client coordinates.
   * @returns {{ x: number, y: number }}
   */
  getClient() {
    return { ...this.client };
  }

  _onPointerMove(e) {
    this.client.x = e.clientX;
    this.client.y = e.clientY;

    const w = window.innerWidth;
    const h = window.innerHeight;

    this.normalized.x = (e.clientX / w) * 2 - 1;
    this.normalized.y = -((e.clientY / h) * 2 - 1);
  }

  _onPointerDown() {
    this.isPressed = true;
  }

  _onPointerUp() {
    this.isPressed = false;
  }

  _onPointerEnter() {
    this.isInViewport = true;
  }

  _onPointerLeave() {
    this.isInViewport = false;
  }
}

// Singleton — one manager for the entire application
let _instance = null;

export const InteractionManager = {
  getInstance() {
    if (!_instance) {
      _instance = new InteractionManagerClass();
    }
    return _instance;
  },
  destroy() {
    if (_instance) {
      _instance.destroy();
      _instance = null;
    }
  },
};

export default InteractionManager;
