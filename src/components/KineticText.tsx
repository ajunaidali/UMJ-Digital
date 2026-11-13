import { motion, useReducedMotion } from 'framer-motion';
import { Fragment } from 'react';

type KineticTextProps = {
  text: string;
  className?: string;
  mode?: 'words' | 'characters';
};

export default function KineticText({ text, className = '', mode = 'words' }: KineticTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');
  const step = mode === 'characters' ? 0.018 : 0;

  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <motion.span
      aria-label={text}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.45 }}
      variants={{ hidden: {}, show: {} }}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="kinetic-word">
            {(mode === 'characters' ? [...word] : [word]).map((part, partIndex) => (
              <span key={`${part}-${partIndex}`} className="kinetic-mask" aria-hidden="true">
                <motion.span
                  className="kinetic-piece"
                  variants={{
                    hidden: { y: '110%', rotate: 3, opacity: 0 },
                    show: {
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.68,
                        delay: wordIndex * 0.055 + partIndex * step,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                >
                  {part}
                </motion.span>
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
