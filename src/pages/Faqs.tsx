import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, Plus } from 'lucide-react';
import { useState } from 'react';
import KineticText from '../components/KineticText';
import MagneticLink from '../components/MagneticLink';
import ScrollReveal from '../components/ScrollReveal';
import { faqs } from '../data/siteData';

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="faq-page mx-auto max-w-7xl px-4 pb-16 sm:pb-20 pt-8 sm:pt-12 md:pt-16 sm:px-6 lg:px-8">
      <section className="grid items-end gap-6 sm:gap-8 pb-8 sm:pb-12 md:grid-cols-[1fr_0.7fr]">
        <ScrollReveal direction="left">
          <p className="mb-3 sm:mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">A few good questions</p>
          <h1 className="max-w-4xl text-3xl sm:text-5xl md:text-7xl font-semibold leading-[1.06] tracking-[-0.04em] text-white">
            <KineticText text="Clear answers make good work." mode="characters" />
          </h1>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.12}>
          <p className="max-w-xl pb-1 text-sm sm:text-base leading-7 sm:leading-8 text-slate-300 md:text-lg">
            A quick guide to how we work, what to expect and where to start when you have a project in mind.
          </p>
        </ScrollReveal>
      </section>

      <div className="grid gap-8 sm:gap-12 border-t border-white/10 pt-8 sm:pt-10 lg:grid-cols-[0.5fr_1.5fr]">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <ScrollReveal>
            <span className="text-[10px] uppercase tracking-[0.26em] text-cyan-200">FAQ / 01—08</span>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">Still have a question? We&apos;re happy to talk through the details and figure out the right next step.</p>
            <MagneticLink
              to="/contact"
              cursorLabel="chat"
              className="magnetic-link mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-cyan-200"
            >
              Contact the studio <ArrowDownRight size={16} className="transition-transform duration-300 group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
            </MagneticLink>
          </ScrollReveal>
        </aside>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex;
            const answerId = `faq-answer-${index}`;

            return (
              <ScrollReveal key={faq.question} delay={index * 0.025}>
                <article className={`faq-item group transition-colors duration-300 ${isOpen ? 'faq-item-open bg-white/[0.015]' : 'hover:bg-white/[0.01]'}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="faq-trigger flex w-full items-center gap-3 sm:gap-5 py-4 sm:py-5 md:py-7 text-left transition"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="w-7 sm:w-8 shrink-0 text-[10px] tracking-[0.16em] text-cyan-300 transition-colors group-hover:text-cyan-200">0{index + 1}</span>
                    <span className="flex-1 text-base sm:text-lg md:text-2xl font-medium text-white transition-colors group-hover:text-cyan-100">{faq.question}</span>
                    <span className={`faq-plus flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all duration-300 ${isOpen ? 'rotate-45 border-cyan-300/60 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(69,234,244,0.3)]' : 'group-hover:border-cyan-300/40 group-hover:text-cyan-200'}`}>
                      <Plus size={16} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={answerId}
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-5 sm:pb-6 md:pb-8 pl-7 sm:pl-12 text-sm leading-7 text-slate-300 md:text-base">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
