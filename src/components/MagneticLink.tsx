import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

type MagneticLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

function useMagneticEnabled() {
  const [enabled, setEnabled] = useState(
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
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

function MagneticAnchor({ to, children, className = '' }: MagneticLinkProps) {
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  const x = useSpring(xValue, { stiffness: 220, damping: 22, mass: 0.4 });
  const y = useSpring(yValue, { stiffness: 220, damping: 22, mass: 0.4 });

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    xValue.set(Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) * 0.12)));
    yValue.set(Math.max(-5, Math.min(5, (event.clientY - bounds.top - bounds.height / 2) * 0.12)));
  };

  const reset = () => {
    xValue.set(0);
    yValue.set(0);
  };

  return (
    <MotionLink
      to={to}
      className={className}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </MotionLink>
  );
}

export default function MagneticLink(props: MagneticLinkProps) {
  const enabled = useMagneticEnabled();
  if (!enabled) return <Link to={props.to} className={props.className}>{props.children}</Link>;
  return <MagneticAnchor {...props} />;
}
