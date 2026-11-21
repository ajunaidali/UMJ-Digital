import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SmoothScroll integrates Lenis smooth scrolling for desktop fine-pointer devices,
 * providing weighted, luxurious, inertial scrolling with full accessibility
 * (respects prefers-reduced-motion) and clean route transitions.
 *
 * On mobile and touch devices, native 120Hz hardware momentum scrolling is preserved
 * to guarantee zero input latency and avoid modal / nav scroll-lock freezes.
 */
export default function SmoothScroll() {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Only enable on desktop fine-pointer (mouse / trackpad) devices
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!isFinePointer) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Attach instance to window for interop
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // On page navigation, instantly reset scroll position cleanly
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
