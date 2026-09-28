/**
 * useGSAP — React-lifecycle-safe GSAP hook
 *
 * Wraps animations in gsap.context() so they are automatically
 * reverted and cleaned up when the component unmounts.
 *
 * Usage:
 *   const containerRef = useRef(null);
 *   useGSAP(() => {
 *     gsap.from('.my-element', { opacity: 0, y: 30 });
 *   }, { scope: containerRef, dependencies: [] });
 *
 * Options:
 *   scope        — ref to a container element; animations are scoped to it
 *   dependencies — array of values that trigger re-creation of the context
 *   revertOnUpdate — if true, reverts context on each dependency change (default: true)
 */

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '../gsap';

/**
 * @param {Function} animationFn   — function that creates GSAP animations
 * @param {{ scope?: React.RefObject, dependencies?: any[], revertOnUpdate?: boolean }} options
 */
export const useGSAP = (animationFn, options = {}) => {
  const {
    scope,
    dependencies = [],
    revertOnUpdate = true,
  } = options;

  // Stable ref to the animation function so it doesn't cause re-runs
  const animationFnRef = useRef(animationFn);
  animationFnRef.current = animationFn;

  const contextRef = useRef(null);

  const revert = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.revert();
      contextRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (revertOnUpdate) {
      revert();
    }

    const ctx = gsap.context(() => {
      animationFnRef.current();
    }, scope?.current ?? undefined);

    contextRef.current = ctx;

    return () => {
      ctx.revert();
      contextRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { revert };
};

export default useGSAP;
