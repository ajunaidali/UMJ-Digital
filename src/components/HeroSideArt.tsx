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
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const reduceMotion = prefersReduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

return (
  <div className="hero-side" aria-hidden="true">
    <div ref={frameRef} className="hero-side-frame">
      <span className="hero-side-orbit" />
      <span className="hero-side-orbit hero-side-orbit-inner" />
      <div className="hero-side-stage">
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
