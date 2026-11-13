import { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';
import { assets } from '../config/assets';

type HeroAnimationProps = {
  active: boolean;
  motionAllowed: boolean;
  fit?: 'slice' | 'meet';
  onError?: () => void;
};

export default function HeroAnimation({ active, motionAllowed, fit = 'slice', onError }: HeroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const activeRef = useRef(active);
  const motionAllowedRef = useRef(motionAllowed);
  const onErrorRef = useRef(onError);

  activeRef.current = active;
  motionAllowedRef.current = motionAllowed;
  onErrorRef.current = onError;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let animation: AnimationItem | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const handleLoaded = () => {
      if (!motionAllowedRef.current) animation?.goToAndStop(0, true);
      else if (activeRef.current) animation?.play();
    };
    const handleFailure = () => {
      if (!cancelled) onErrorRef.current?.();
    };

    void import('lottie-web').then(({ default: lottie }) => {
      if (cancelled) return;

      animation = lottie.loadAnimation({
        container,
        renderer: 'canvas',
        loop: true,
        autoplay: false,
        path: assets.animations.heroLottieJson,
        rendererSettings: {
          preserveAspectRatio: fit === 'slice' ? 'xMidYMid slice' : 'xMidYMid meet',
          progressiveLoad: true,
          clearCanvas: true,
          dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        },
      });
      animation.setSubframe(false);
      animationRef.current = animation;
      animation.addEventListener('DOMLoaded', handleLoaded);
      animation.addEventListener('data_failed', handleFailure);
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => {
          if (!animation?.isLoaded) return;
          try {
            animation.resize();
          } catch {
            /* Canvas renderer is not ready yet. */
          }
        });
        resizeObserver.observe(container);
      }
    }).catch(() => {
      if (!cancelled) onErrorRef.current?.();
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      animation?.removeEventListener('DOMLoaded', handleLoaded);
      animation?.removeEventListener('data_failed', handleFailure);
      animation?.destroy();
      if (animationRef.current === animation) animationRef.current = null;
    };
  }, [fit]);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation || !animation.isLoaded) return;

    if (!motionAllowed) animation.goToAndStop(0, true);
    else if (active) animation.play();
    else animation.pause();
  }, [active, motionAllowed]);

  return <div ref={containerRef} className="hero-lottie" aria-hidden="true" />;
}
