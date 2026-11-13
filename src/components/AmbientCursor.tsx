import { useEffect, useRef } from 'react';

export default function AmbientCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pointer = window.matchMedia('(pointer: fine)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointer.matches || motionPreference.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let frame = 0;
    let x = -100;
    let y = -100;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        cursor.classList.add('is-on');
        frame = 0;
      });
    };
    const hide = () => cursor.classList.remove('is-on');

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={cursorRef} className="ambient-cursor" aria-hidden="true" />;
}
