import { useEffect, useRef, useState } from 'react';

/**
 * AmbientCursor:
 * - Single unified sleek cursor pointer (no dual/split pointers)
 * - Buttery-smooth lerped physics with dampening for silky-smooth tracking
 * - Smooth expansion and badge label over interactive cards/links (data-cursor="...")
 * - Tactile press scaling on click
 * - Completely inactive on touch screens and prefers-reduced-motion
 */
export default function AmbientCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const [isDown, setIsDown] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only fine-pointer desktop with motion allowed
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    setEnabled(true);

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

    const handlePointerDown = () => setIsDown(true);
    const handlePointerUp = () => setIsDown(false);

    const animate = () => {
      // Single smooth lerp (0.18) for ultra-fluid, zero-jitter cursor tracking
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
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

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`ambient-cursor-root pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1 Single Unified Smooth Custom Cursor Pointer */}
      <div
        ref={cursorRef}
        className={`ambient-cursor-single fixed top-0 left-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,margin,transform] duration-200 ease-out ${
          isDown ? 'scale-90' : 'scale-100'
        } ${
          isInteractive
            ? cursorLabel
              ? '-ml-8 -mt-8 h-16 w-16 border border-cyan-300/90 bg-cyan-400/25 backdrop-blur-[2px] shadow-[0_0_24px_rgba(69,234,244,0.4)]'
              : '-ml-5 -mt-5 h-10 w-10 border border-cyan-300/70 bg-cyan-400/20 shadow-[0_0_18px_rgba(69,234,244,0.3)]'
            : '-ml-2.5 -mt-2.5 h-5 w-5 border border-cyan-300/80 bg-cyan-400/25 shadow-[0_0_14px_rgba(69,234,244,0.5)]'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Luminous core that moves strictly as part of the single pointer */}
        <span
          className={`rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(69,234,244,0.9)] transition-all duration-150 ${
            cursorLabel
              ? 'hidden'
              : isInteractive
              ? 'h-1.5 w-1.5 opacity-90'
              : 'h-1.5 w-1.5 opacity-100'
          }`}
        />
        {cursorLabel && (
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-100 select-none">
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  );
}
