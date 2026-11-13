import { Fragment, useEffect, useRef, useState } from 'react';

type KineticTextProps = {
  text: string;
  className?: string;
  mode?: 'words' | 'characters';
};

export default function KineticText({ text, className = '', mode = 'words' }: KineticTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const words = text.split(' ');
  const step = mode === 'characters' ? 0.012 : 0;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= viewHeight * 0.85 && rect.bottom >= 0) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} aria-label={text} className={`${className}${shown ? ' kinetic-on' : ''}`}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="kinetic-word">
            {(mode === 'characters' ? [...word] : [word]).map((part, partIndex) => {
              const delay = Math.min(wordIndex * 0.04 + partIndex * step, 0.36);
              return (
                <span key={`${part}-${partIndex}`} className="kinetic-mask" aria-hidden="true">
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
  );
}
