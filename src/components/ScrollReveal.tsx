import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
};

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = () => element.classList.add('is-shown');

    if (reduced || !('IntersectionObserver' in window)) {
      reveal();
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= viewHeight * 0.95 && rect.bottom >= 0) {
        reveal();
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          reveal();
          observer.disconnect();
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
      );
      observer.observe(element);
      return () => observer.disconnect();
    }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal-${direction}${className ? ` ${className}` : ''}`}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
      onAnimationEnd={(event) => {
        if (event.animationName !== 'scroll-reveal-in' || event.target !== event.currentTarget) return;
        event.currentTarget.classList.add('is-settled');
      }}
    >
      {children}
    </div>
  );
}
