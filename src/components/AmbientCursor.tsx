import { useEffect, useRef, useState } from 'react';

/**
 * AmbientCursor inspired by Arktech Studios:
 * - Fluid lerped physics for zero-lag, silky-smooth tracking
 * - Soft cyan glowing ring with an elegant precision core
 * - Dynamic expansion & badge label over interactive cards/links (data-cursor="...")
 * - Completely inactive & zero-overhead on touch screens and prefers-reduced-motion
 */
export default function AmbientCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only fine-pointer desktop with motion allowed
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let frameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Check for custom cursor attributes or interactive targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
        if (cursorEl) {
          const label = cursorEl.getAttribute('data-cursor') || '';
          setCursorLabel(label);
          setIsInteractive(true);
        } else {
          const interactiveEl = target.closest('a, button, input, textarea, select, [role="button"]');
          if (interactiveEl) {
            setCursorLabel('');
            setIsInteractive(true);
          } else {
            setCursorLabel('');
            setIsInteractive(false);
          }
        }
      }
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
      setIsInteractive(false);
      setCursorLabel('');
    };

    const handlePointerDown = () => {
      if (ringRef.current) ringRef.current.style.transform += ' scale(0.85)';
    };

    const handlePointerUp = () => {
      if (ringRef.current) ringRef.current.style.transform = ringRef.current.style.transform.replace(' scale(0.85)', '');
    };

    const animate = () => {
      // Smooth lerp (0.22 for ring, direct/near-instant for precision core)
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isVisible]);

  return (
    <div
      aria-hidden="true"
      className={`ambient-cursor-root pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Precision Core Dot */}
      <div
        ref={coreRef}
        className="ambient-cursor-dot fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(69,234,244,0.9)] transition-transform duration-75"
        style={{ willChange: 'transform' }}
      />

      {/* Ambient Responsive Halo Ring */}
      <div
        ref={ringRef}
        className={`ambient-cursor-ring fixed top-0 left-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,margin] duration-300 ease-out ${
          isInteractive
            ? cursorLabel
              ? '-ml-8 -mt-8 h-16 w-16 border-cyan-300/80 bg-cyan-400/20 backdrop-blur-[2px] shadow-[0_0_24px_rgba(69,234,244,0.35)]'
              : '-ml-6 -mt-6 h-12 w-12 border-cyan-300/60 bg-cyan-400/15 shadow-[0_0_18px_rgba(69,234,244,0.25)]'
            : '-ml-3.5 -mt-3.5 h-7 w-7 border-cyan-400/35 bg-cyan-400/5 shadow-[0_0_12px_rgba(69,234,244,0.12)]'
        }`}
        style={{ willChange: 'transform' }}
      >
        {cursorLabel && (
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-100 select-none">
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  );
}
