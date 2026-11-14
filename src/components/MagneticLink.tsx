import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

type MagneticLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  cursorLabel?: string;
};

function useMagneticEnabled() {
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const pointer = window.matchMedia('(pointer: fine)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(pointer.matches && !motionPreference.matches);
    pointer.addEventListener('change', update);
    motionPreference.addEventListener('change', update);
    return () => {
      pointer.removeEventListener('change', update);
      motionPreference.removeEventListener('change', update);
    };
  }, []);

  return enabled;
}

function MagneticAnchor({ to, children, className = '', cursorLabel }: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const x = useSpring(xValue, { stiffness: 280, damping: 20, mass: 0.35 });
  const y = useSpring(yValue, { stiffness: 280, damping: 20, mass: 0.35 });

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    // Smooth magnetic pull
    const pullX = (event.clientX - centerX) * 0.22;
    const pullY = (event.clientY - centerY) * 0.22;
    xValue.set(Math.max(-10, Math.min(10, pullX)));
    yValue.set(Math.max(-8, Math.min(8, pullY)));

    // Internal button glow coordinate
    const target = event.currentTarget;
    target.style.setProperty('--btn-x', `${event.clientX - bounds.left}px`);
    target.style.setProperty('--btn-y', `${event.clientY - bounds.top}px`);
  };

  const reset = () => {
    xValue.set(0);
    yValue.set(0);
  };

  return (
    <MotionLink
      ref={linkRef}
      to={to}
      className={`magnetic-link btn-interactive ${className}`}
      data-cursor={cursorLabel}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      <span className="btn-glow-layer" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </MotionLink>
  );
}

export default function MagneticLink(props: MagneticLinkProps) {
  const enabled = useMagneticEnabled();
  if (!enabled) {
    return (
      <Link to={props.to} className={`magnetic-link ${props.className || ''}`} data-cursor={props.cursorLabel}>
        {props.children}
      </Link>
    );
  }
  return <MagneticAnchor {...props} />;
}
