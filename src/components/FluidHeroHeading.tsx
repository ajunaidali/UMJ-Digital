import { useEffect, useRef, useState } from 'react';

interface FluidHeroHeadingProps {
  text: string;
  className?: string;
}

interface CharData {
  element: HTMLElement | null;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  currentScaleX: number;
  currentScaleY: number;
  vsX: number;
  vsY: number;
  currentSkew: number;
  vSkew: number;
  glow: number;
  vGlow: number;
}

export default function FluidHeroHeading({ text, className = '' }: FluidHeroHeadingProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const charsRef = useRef<CharData[]>([]);
  const isHoveringRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Split text into words and characters while preserving whitespace and word wrapping
  const words = text.split(' ');

  // Entrance settle state
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // Settle initial entrance smoothly
    const timer = setTimeout(() => {
      setSettled(true);
      setIsReady(true);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    // Check if fine pointer (mouse) is available and user doesn't prefer reduced motion
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    // Collect character DOM nodes
    const charElements = Array.from(
      container.querySelectorAll<HTMLElement>('.fluid-char-inner'),
    );

    charsRef.current = charElements.map((el) => ({
      element: el,
      baseX: 0,
      baseY: 0,
      currentX: 0,
      currentY: 0,
      vx: 0,
      vy: 0,
      currentScaleX: 1,
      currentScaleY: 1,
      vsX: 0,
      vsY: 0,
      currentSkew: 0,
      vSkew: 0,
      glow: 0,
      vGlow: 0,
    }));

    // Measure character base positions relative to container
    const updateBaseCoordinates = () => {
      const containerRect = container.getBoundingClientRect();
      charsRef.current.forEach((char) => {
        if (!char.element) return;
        const rect = char.element.getBoundingClientRect();
        char.baseX = rect.left - containerRect.left + rect.width / 2;
        char.baseY = rect.top - containerRect.top + rect.height / 2;
      });
    };

    updateBaseCoordinates();
    window.addEventListener('resize', updateBaseCoordinates, { passive: true });

    // Physics constants for luxurious, fluid liquid feel
    const spring = 0.15;
    const damping = 0.8;
    const radius = 145; // Interaction influence radius
    const maxDisplaceX = 7.5;
    const maxDisplaceY = 6.0;

    let isRunning = false;

    const updatePhysics = () => {
      let isMoving = false;
      const mouse = mouseRef.current;
      const isHovering = isHoveringRef.current;

      charsRef.current.forEach((char) => {
        if (!char.element) return;

        let targetX = 0;
        let targetY = 0;
        let targetScaleX = 1;
        let targetScaleY = 1;
        let targetSkew = 0;
        let targetGlow = 0;

        if (isHovering) {
          const dx = mouse.x - char.baseX;
          const dy = mouse.y - char.baseY;
          const dist = Math.hypot(dx, dy);

          if (dist < radius) {
            // Smooth cubic falloff
            const norm = 1 - dist / radius;
            const factor = norm * norm * (3 - 2 * norm); // smoothstep
            const angle = Math.atan2(dy, dx);

            // Subtle fluid displacement away from cursor
            targetX = Math.cos(angle) * factor * maxDisplaceX;
            targetY = Math.sin(angle) * factor * maxDisplaceY;

            // Liquid stretch along direction of motion, squash across
            const stretch = factor * 0.1;
            targetScaleX = 1 + Math.abs(Math.sin(angle)) * stretch - Math.abs(Math.cos(angle)) * stretch * 0.4;
            targetScaleY = 1 + Math.abs(Math.cos(angle)) * stretch - Math.abs(Math.sin(angle)) * stretch * 0.4;

            // Subtle liquid shear
            targetSkew = -Math.cos(angle) * factor * 3.8;

            // Luminescent subtle fluid glow
            targetGlow = factor;
          }
        }

        // Spring integration
        char.vx = (char.vx + (targetX - char.currentX) * spring) * damping;
        char.currentX += char.vx;

        char.vy = (char.vy + (targetY - char.currentY) * spring) * damping;
        char.currentY += char.vy;

        char.vsX = (char.vsX + (targetScaleX - char.currentScaleX) * spring) * damping;
        char.currentScaleX += char.vsX;

        char.vsY = (char.vsY + (targetScaleY - char.currentScaleY) * spring) * damping;
        char.currentScaleY += char.vsY;

        char.vSkew = (char.vSkew + (targetSkew - char.currentSkew) * spring) * damping;
        char.currentSkew += char.vSkew;

        char.vGlow = (char.vGlow + (targetGlow - char.glow) * spring) * damping;
        char.glow += char.vGlow;

        // Check if movement is still occurring
        const activeDelta =
          Math.abs(char.currentX - targetX) +
          Math.abs(char.currentY - targetY) +
          Math.abs(char.vx) +
          Math.abs(char.vy) +
          Math.abs(char.currentScaleX - targetScaleX) +
          Math.abs(char.currentScaleY - targetScaleY);

        if (activeDelta > 0.003 || isHovering) {
          isMoving = true;
          char.element.style.transform = `translate3d(${char.currentX.toFixed(2)}px, ${char.currentY.toFixed(2)}px, 0) scale(${char.currentScaleX.toFixed(3)}, ${char.currentScaleY.toFixed(3)}) skewX(${char.currentSkew.toFixed(2)}deg)`;
          if (char.glow > 0.04) {
            char.element.style.textShadow = `0 0 ${(char.glow * 14).toFixed(1)}px rgba(69, 234, 244, ${(char.glow * 0.45).toFixed(2)})`;
            char.element.style.color = char.glow > 0.25 ? '#ebfbff' : '';
          } else {
            char.element.style.textShadow = '';
            char.element.style.color = '';
          }
        } else {
          // Reset to clean rest state to save GPU/CPU
          char.currentX = 0;
          char.currentY = 0;
          char.vx = 0;
          char.vy = 0;
          char.currentScaleX = 1;
          char.currentScaleY = 1;
          char.vsX = 0;
          char.vsY = 0;
          char.currentSkew = 0;
          char.vSkew = 0;
          char.glow = 0;
          char.vGlow = 0;
          char.element.style.transform = '';
          char.element.style.textShadow = '';
          char.element.style.color = '';
        }
      });

      if (isMoving) {
        animFrameRef.current = requestAnimationFrame(updatePhysics);
      } else {
        isRunning = false;
        animFrameRef.current = null;
      }
    };

    const startPhysics = () => {
      if (!isRunning) {
        isRunning = true;
        animFrameRef.current = requestAnimationFrame(updatePhysics);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const containerRect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - containerRect.left;
      mouseRef.current.y = e.clientY - containerRect.top;
      isHoveringRef.current = true;
      startPhysics();
    };

    const handlePointerEnter = (e: PointerEvent) => {
      updateBaseCoordinates();
      handlePointerMove(e);
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
      startPhysics();
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', updateBaseCoordinates);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isReady]);

  return (
    <h1
      ref={containerRef}
      className={`fluid-hero-heading select-none font-display ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Accessible screen reader representation */}
      <span className="sr-only">{text}</span>

      {/* Visual interactive characters */}
      <span aria-hidden="true" className="fluid-text-stage inline">
        {words.map((word, wordIndex) => {
          let charOffsetSoFar = 0;
          for (let i = 0; i < wordIndex; i++) {
            charOffsetSoFar += words[i].length + 1;
          }

          return (
            <span key={`${word}-${wordIndex}`} className="fluid-word inline-block whitespace-nowrap">
              {[...word].map((char, charIndex) => {
                const totalIndex = charOffsetSoFar + charIndex;
                const animDelay = Math.min(totalIndex * 0.015, 0.45);

                return (
                  <span
                    key={`${char}-${charIndex}`}
                    className="fluid-char inline-block overflow-visible"
                    style={{ verticalAlign: 'baseline' }}
                  >
                    <span
                      className={`fluid-char-inner inline-block transition-colors duration-150 will-change-transform ${
                        settled ? 'fluid-settled' : 'fluid-rising'
                      }`}
                      style={
                        settled
                          ? undefined
                          : {
                              animation: `kinetic-rise 0.72s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s both`,
                            }
                      }
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
              {wordIndex < words.length - 1 ? (
                <span className="fluid-space inline-block">&nbsp;</span>
              ) : null}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

