import { Fragment, useLayoutEffect, useRef } from 'react';

type KineticTextProps = {
  text: string;
  className?: string;
  mode?: 'words' | 'characters';
};

export default function KineticText({ text, className = '', mode = 'words' }: KineticTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const finished = useRef(0);
  const words = text.split(' ');
  const step = mode === 'characters' ? 0.012 : 0;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    finished.current = 0;
    element.classList.remove('kinetic-on', 'kinetic-settled');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = () => element.classList.add('kinetic-on');

    if (reduced || !('IntersectionObserver' in window)) {
      show();
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= viewHeight * 0.85 && rect.bottom >= 0) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        onAnimationEnd={(event) => {
          if (event.animationName !== 'kinetic-rise') return;
          finished.current += 1;
          const total = event.currentTarget.querySelectorAll('.kinetic-piece').length;
          if (finished.current >= total) event.currentTarget.parentElement?.classList.add('kinetic-settled');
        }}
      >
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="kinetic-word">
            {(mode === 'characters' ? [...word] : [word]).map((part, partIndex) => {
              const delay = Math.min(wordIndex * 0.04 + partIndex * step, 0.36);
              return (
                <span key={`${part}-${partIndex}`} className="kinetic-mask">
                  <span className="kinetic-piece" style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}>
                    {part}
                  </span>
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
      </span>
    </span>
  );
}
