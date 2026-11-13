import { useEffect, useRef, useState } from 'react';

const phrases = [
  'DIGITAL INNOVATION',
  'CREATIVE THINKING',
  'WEB DEVELOPMENT',
  'MOBILE EXPERIENCES',
  'DESIGN MEETS TECHNOLOGY',
  'UMJ DIGITAL',
];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { rootMargin: '120px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`motion-marquee ${reverse ? 'motion-marquee-reverse' : ''} ${paused ? 'is-paused' : ''}`} aria-label={phrases.join(' · ')}>
      <div className="motion-marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="motion-marquee-group" key={copy}>
            {phrases.map((phrase) => (
              <span className="motion-marquee-item" key={`${copy}-${phrase}`}>
                <span>{phrase}</span>
                <i />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
