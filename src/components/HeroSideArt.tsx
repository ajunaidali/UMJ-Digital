import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const HeroAnimation = lazy(() => import('./HeroAnimation'));

function connectionBlocked() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(connection?.saveData || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g');
}

function SideFallback() {
  return (
    <div className="hero-graphic-fallback" aria-hidden="true">
      <div className="hero-fallback-orbit hero-fallback-orbit-one" />
      <div className="hero-fallback-orbit hero-fallback-orbit-two" />
      <div className="hero-fallback-core"><span>UMJ</span></div>
      <div className="hero-fallback-shard hero-fallback-shard-one" />
      <div className="hero-fallback-shard hero-fallback-shard-two" />
    </div>
  );
}

export default function HeroSideArt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const reduceMotion = prefersReduced ?? (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [active, setActive] = useState(true);
  const [armLottie, setArmLottie] = useState(false);
  const [lottieFailed, setLottieFailed] = useState(false);
  const blocked = connectionBlocked();
  const playLottie = !reduceMotion && !blocked && !lottieFailed;

  useEffect(() => {
    if (!playLottie) return;
    const arm = () => setArmLottie(true);
    const idleId = window.requestIdleCallback?.(arm, { timeout: 900 });
    if (idleId !== undefined) return () => window.cancelIdleCallback(idleId);
    const timeoutId = window.setTimeout(arm, 280);
    return () => window.clearTimeout(timeoutId);
  }, [playLottie]);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const sync = (visible: boolean) => setActive(visible && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(
      ([entry]) => sync(entry.isIntersecting),
      { rootMargin: '120px 0px', threshold: 0.05 },
    );
    observer.observe(element);
    const onVisibility = () => {
      const rect = element.getBoundingClientRect();
      sync(rect.bottom > 0 && rect.top < window.innerHeight);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // 3D Parallax & Tilt tracking on desktop
  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduceMotion || !isFinePointer) return;

    const container = containerRef.current;
    if (!container) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    let frameId: number;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Restrict max tilt to subtle 5.5 degrees for premium refinement
      targetRotX = -relY * 6;
      targetRotY = relX * 7.5;
      targetParallaxX = relX * 14;
      targetParallaxY = relY * 14;
    };

    const handlePointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetParallaxX = 0;
      targetParallaxY = 0;
    };

    const render = () => {
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.1;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.1;

      if (frameRef.current) {
        frameRef.current.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
        frameRef.current.style.setProperty('--hero-parallax-x', `${currentParallaxX.toFixed(1)}px`);
        frameRef.current.style.setProperty('--hero-parallax-y', `${currentParallaxY.toFixed(1)}px`);
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [reduceMotion]);

  return (
    <div ref={containerRef} className="hero-side" aria-hidden="true">
      {/* Ambient soft glow aura behind the stage */}
      <div className="hero-side-aura" />

      <div ref={frameRef} className="hero-side-frame">
        <span className="hero-side-orbit" />
        <span className="hero-side-orbit hero-side-orbit-inner" />
        <div className="hero-side-stage">
          {/* Subtle physical glass sheen sweep */}
          <div className="hero-side-glass-sheen" />

          {playLottie && armLottie ? (
            <Suspense fallback={null}>
              <HeroAnimation
                active={active}
                motionAllowed
                fit="meet"
                onError={() => setLottieFailed(true)}
              />
            </Suspense>
          ) : (
            <SideFallback />
          )}
          <span className="hero-side-corner hero-side-corner-tl" />
          <span className="hero-side-corner hero-side-corner-tr" />
          <span className="hero-side-corner hero-side-corner-bl" />
          <span className="hero-side-corner hero-side-corner-br" />
        </div>
        <span className="hero-side-tile hero-side-tile-a" />
        <span className="hero-side-tile hero-side-tile-b" />
        <span className="hero-side-tile hero-side-tile-c" />
      </div>
      <span className="hero-side-label">Fig. 01 — Ideas in motion</span>
    </div>
  );
}
