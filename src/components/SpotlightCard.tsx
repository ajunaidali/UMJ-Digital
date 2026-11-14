import { useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  enableTilt?: boolean;
  maxTilt?: number;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  enableTilt = true,
  maxTilt = 3.5,
  spotlightColor,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--spotlight-opacity', '1');

      if (enableTilt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const percentX = x / rect.width - 0.5;
        const percentY = y / rect.height - 0.5;
        const tiltX = (percentY * -maxTilt).toFixed(2);
        const tiltY = (percentX * maxTilt).toFixed(2);
        card.style.setProperty('--tilt-x', `${tiltX}deg`);
        card.style.setProperty('--tilt-y', `${tiltY}deg`);
      }
    });
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    card.style.setProperty('--spotlight-opacity', '0');
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={spotlightColor ? ({ '--spotlight-glow-color': spotlightColor } as React.CSSProperties) : undefined}
      {...props}
    >
      <div className="spotlight-border" aria-hidden="true" />
      <div className="spotlight-glow" aria-hidden="true" />
      <div className="spotlight-content relative z-10 h-full">{children}</div>
    </div>
  );
}

