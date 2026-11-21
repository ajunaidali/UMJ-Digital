import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowRight, BadgeCheck, ChevronRight, MoveUpRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FluidHeroHeading from '../components/FluidHeroHeading';
import HeroSideArt from '../components/HeroSideArt';
import KineticText from '../components/KineticText';
import MagneticLink from '../components/MagneticLink';
import Marquee from '../components/Marquee';
import ScrollReveal from '../components/ScrollReveal';
import SpotlightCard from '../components/SpotlightCard';
import { assets } from '../config/assets';
import { featuredProjects, founders, processSteps, services, trustStats, whyChooseUs } from '../data/siteData';

function StorySection() {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const disableScrollAnim = reduceMotion || isMobile;

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [1.2, -1.2]);

  return (
    <section ref={storyRef} className="story-section mx-auto mt-14 sm:mt-24 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="lg:sticky lg:top-32">
          <ScrollReveal>
            <p className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">A digital partner</p>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold leading-[1.08] tracking-[-0.04em] text-white">
              <KineticText text="Make a little more possible." mode="characters" />
            </h2>
            <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-300 md:text-lg">
              Strategy finds the signal. Design gives it form. Technology takes it further. We bring all three together to build brands with momentum.
            </p>
            <MagneticLink to="/services" cursorLabel="view" className="magnetic-link mt-5 sm:mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
              How we can help <MoveUpRight size={16} />
            </MagneticLink>
          </ScrollReveal>
        </div>
        <motion.div
          className="story-art relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-cyan-100/20 shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(69,234,244,0.1)]"
          style={{ y: disableScrollAnim ? 0 : imageY, rotate: disableScrollAnim ? 0 : imageRotate }}
        >
          <img
            src={assets.hero.object2}
            alt="Abstract visual representing digital ideas taking shape"
            className="h-[280px] sm:h-[420px] w-full object-cover md:h-[580px]"
            loading="lazy" decoding="async"
            width="1300"
            height="708"
          />
          <div className="story-art-collage" aria-hidden="true">
            <img src={assets.hero.object1} alt="" width="1296" height="705" loading="lazy" decoding="async" />
            <img src={assets.animations.featureMotion} alt="" width="1200" height="700" loading="lazy" decoding="async" />
            <img src={assets.hero.object3} alt="" width="1392" height="720" loading="lazy" decoding="async" />
          </div>
          <div className="story-art-overlay" />
          <div className="absolute inset-x-4 bottom-4 z-10 flex flex-col items-start gap-2 sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:inset-x-10 md:bottom-10">
            <p className="max-w-sm text-base sm:text-2xl font-medium leading-tight tracking-tight text-white md:text-4xl">Different disciplines.<br />One connected vision.</p>
            <span className="shrink-0 text-[10px] sm:text-xs uppercase tracking-[0.24em] text-cyan-200">UMJ / DIGITAL</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <div className="home-page pb-16 sm:pb-20">
      <section className="hero-section relative overflow-hidden pt-5 sm:pt-12 md:pt-16">
        <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
        <div className="hero-ambient hero-ambient-two" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
            <div className="relative z-10 min-w-0 pb-4 sm:pb-8">
              <ScrollReveal direction="left">
                <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] sm:tracking-[0.3em] text-cyan-100 shadow-[0_0_15px_rgba(69,234,244,0.12)]">
                  <Sparkles size={13} className="text-cyan-300 animate-pulse shrink-0" /> Independent digital studio
                </div>
              </ScrollReveal>
              <FluidHeroHeading
                text="We Create Digital Experiences That Move Businesses Forward."
                className="max-w-3xl text-[clamp(1.85rem,7.2vw,5.25rem)] font-semibold leading-[1.09] tracking-[-0.035em] text-white sm:leading-[1.04] sm:tracking-[-0.04em]"
              />

              {/* Mobile Hero Animation - Displayed on mobile screens in place of the paragraph text as requested */}
              <div className="my-5 w-full max-w-[500px] mx-auto lg:hidden">
                {!isDesktop && <HeroSideArt />}
              </div>

              <ScrollReveal delay={0.28} direction="left">
                {/* Desktop paragraph text - Shown on desktop (>=1024px), replaced by animation on mobile */}
                <p className="hidden lg:block mt-4 sm:mt-6 max-w-xl text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-300 md:text-lg">
                  From powerful websites and mobile applications to creative branding and digital marketing, we help businesses transform ideas into meaningful digital experiences.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <MagneticLink
                    to="/portfolio"
                    cursorLabel="view"
                    className="magnetic-link inline-flex min-h-[46px] sm:min-h-[48px] items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-[#071025] shadow-[0_0_20px_rgba(69,234,244,0.3)] transition hover:bg-white hover:shadow-[0_0_35px_rgba(69,234,244,0.6)] active:scale-[0.98]"
                  >
                    Explore Our Work <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </MagneticLink>
                  <MagneticLink
                    to="/contact"
                    cursorLabel="chat"
                    className="magnetic-link inline-flex min-h-[46px] sm:min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-cyan-200 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(69,234,244,0.2)] active:scale-[0.98]"
                  >
                    Let&apos;s Talk <MoveUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </MagneticLink>
                </div>
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-3.5 sm:gap-x-5 gap-y-2 text-[10.5px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.12em] text-slate-300">
                  {['Web development', 'Mobile apps', 'UI/UX design', 'Brand & content', 'Digital marketing'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 sm:gap-2 transition-colors hover:text-cyan-100">
                      <BadgeCheck size={14} className="text-cyan-300 shrink-0" />
                      {item}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            {/* Desktop Hero Side Animation */}
            <div className="relative hidden w-full items-center justify-center lg:flex">
              {isDesktop && <HeroSideArt />}
            </div>
          </div>
          <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 py-3.5 sm:py-5 text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:tracking-[0.3em]">
            <span>Strategy / Design / Development</span>
            <span className="hidden items-center gap-2 sm:inline-flex"><ArrowDownRight size={14} className="text-cyan-300 animate-bounce" /> Scroll to explore</span>
            <span>01 — {String(services.length).padStart(2, '0')}</span>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="mx-auto mt-10 sm:mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {trustStats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.06}>
              <div className="stat-block group border-l-2 border-cyan-300/35 py-2 pl-3 sm:pl-5 transition-all duration-300 hover:border-cyan-200 hover:pl-6">
                <div className="text-xl sm:text-2xl font-medium tracking-tight text-white transition-colors group-hover:text-cyan-100 md:text-3xl">{stat.value}</div>
                <div className="mt-1 sm:mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.24em] text-slate-400">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <StorySection />

      <section className="mx-auto mt-14 sm:mt-24 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-6 sm:gap-8 md:grid-cols-[1fr_0.7fr]">
          <ScrollReveal>
            <p className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">What we do</p>
            <h2 className="max-w-3xl text-2xl sm:text-4xl md:text-6xl font-semibold leading-[1.06] tracking-[-0.04em] text-white">
              <KineticText text="Ideas deserve a good build." />
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.12} direction="right">
            <p className="max-w-lg pb-1 text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-300">
              Six focused disciplines. Each has its own craft, and every one connects back to the same bigger picture: a better digital experience.
            </p>
          </ScrollReveal>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map(({ title, summary, image, icon: Icon }, index) => (
            <ScrollReveal key={title} delay={index * 0.045}>
              <SpotlightCard className="h-full rounded-2xl" maxTilt={3}>
                <Link
                  to="/services"
                  data-cursor="explore"
                  className="service-tile group block h-full overflow-hidden rounded-2xl border border-white/10 bg-[#071126] transition duration-500 hover:-translate-y-1 hover:border-cyan-200/50"
                >
                  <div className="service-tile-image relative">
                    <img src={image} alt="" className={`h-40 sm:h-44 w-full transition duration-700 group-hover:scale-105 ${title === 'App Development' ? 'bg-[#08152d] object-contain p-3' : 'object-cover'}`} loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071126] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#05082F]/70 text-cyan-200 backdrop-blur shadow-[0_0_12px_rgba(69,234,244,0.2)]"><Icon size={16} /></span>
                    <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.2em] text-slate-300 transition-colors group-hover:text-cyan-300">0{index + 1}</span>
                  </div>
                  <div className="p-4 sm:p-5 pt-1">
                    <h3 className="text-base sm:text-lg font-medium leading-snug text-white transition-colors group-hover:text-cyan-100">{title}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-400">{summary}</p>
                  </div>
                </Link>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 sm:mt-24 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-5">
          <ScrollReveal>
            <p className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">Selected work</p>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold tracking-[-0.04em] text-white"><KineticText text="Built to make an impression." /></h2>
          </ScrollReveal>
          <Link to="/portfolio" cursor-label="view" className="magnetic-link hidden shrink-0 items-center gap-2 pb-2 text-sm text-cyan-200 transition hover:text-white md:inline-flex">All projects <ChevronRight size={16} /></Link>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-x-5 gap-y-6 sm:gap-y-10 md:grid-cols-2">
          {featuredProjects.slice(0, 3).map((project, index) => (
            <ScrollReveal key={project.title} delay={index * 0.07} direction={index % 2 ? 'right' : 'left'} className={index === 0 ? 'md:col-span-2' : ''}>
              <SpotlightCard className={`h-full rounded-2xl ${index === 0 ? 'md:col-span-2' : ''}`} maxTilt={2.5}>
                <Link
                  to="/portfolio"
                  data-cursor="view"
                  className={`project-card group block h-full overflow-hidden rounded-2xl ${index === 0 ? 'grid items-end gap-6 md:grid-cols-[1.35fr_0.65fr]' : ''}`}
                >
                  <div className="project-preview overflow-hidden rounded-xl border border-white/10 bg-[#0a1430] transition duration-500 group-hover:border-cyan-300/40">
                    <img src={project.image} alt={project.title} className={`h-full w-full transition duration-700 group-hover:scale-[1.035] ${project.title === 'Mobile Application Design' ? 'bg-[#08152d] object-contain p-4 sm:p-5' : 'object-cover'} ${index === 0 ? 'aspect-[1.8/1]' : 'aspect-[1.2/1]'}`} loading="lazy" decoding="async" />
                    <span className="project-preview-arrow"><MoveUpRight size={18} /></span>
                  </div>
                  <div className="project-caption flex items-start justify-between gap-4 pt-3.5 sm:pt-4 md:pt-5">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">{project.tag} / {project.category}</span>
                      <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-medium text-white transition-colors group-hover:text-cyan-100 md:text-2xl">{project.title}</h3>
                    </div>
                    <span className="mt-1.5 sm:mt-2 text-xs text-slate-400">0{index + 1}</span>
                  </div>
                </Link>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            to="/portfolio"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 transition active:scale-95 hover:bg-cyan-300 hover:text-slate-950"
          >
            All projects <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      <Marquee reverse />

      <section className="mx-auto mt-14 sm:mt-20 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 bg-[linear-gradient(115deg,rgba(9,19,44,0.94),rgba(7,11,30,0.82))] p-5 sm:p-7 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <p className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">Why UMJ Digital</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold leading-[1.06] tracking-[-0.04em] text-white">
              <KineticText text="Clear thinking. Careful making." />
            </h2>
            <p className="mt-3.5 sm:mt-5 max-w-md text-sm leading-relaxed sm:leading-7 text-slate-300">
              From the first conversation through final delivery, we make the complicated feel clear and the important feel intentional.
            </p>
          </ScrollReveal>
          <div className="grid gap-0">
            {whyChooseUs.map((item, index) => (
              <ScrollReveal key={item} delay={index * 0.06}>
                <div className="why-row group flex items-start gap-3.5 sm:gap-5 border-t border-white/10 py-3.5 sm:py-5">
                  <span className="pt-0.5 text-xs tracking-[0.18em] text-cyan-300 transition-colors group-hover:text-cyan-200">0{index + 1}</span>
                  <p className="min-w-0 flex-1 text-sm sm:text-base leading-relaxed sm:leading-7 text-slate-200 transition group-hover:text-white">{item}</p>
                  <MoveUpRight size={16} className="ml-auto mt-0.5 shrink-0 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 sm:mt-24 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ScrollReveal>
              <p className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">The process</p>
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold leading-[1.06] tracking-[-0.04em] text-white">
                <KineticText text="From first thought to final form." />
              </h2>
              <p className="mt-3.5 sm:mt-5 max-w-md text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-300">Good work happens through clear decisions, shared momentum and attention to the details that matter.</p>
            </ScrollReveal>
          </div>
          <div className="process-list">
            {processSteps.map(({ step, title, text }, index) => (
              <ScrollReveal key={step} delay={index * 0.05}>
                <div className="process-step group grid grid-cols-[38px_1fr] sm:grid-cols-[56px_1fr] md:grid-cols-[78px_1fr] gap-3 sm:gap-4 md:gap-6 border-t border-white/15 py-4 sm:py-7 md:py-9">
                  <span className="text-xs sm:text-sm tracking-[0.2em] text-cyan-300 transition-colors group-hover:text-cyan-200">{step}</span>
                  <div>
                    <h3 className="flex items-center justify-between gap-3 text-lg sm:text-2xl md:text-3xl font-medium text-white transition-colors group-hover:text-cyan-100">{title}<MoveUpRight size={18} className="shrink-0 text-slate-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-200" /></h3>
                    <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm leading-relaxed sm:leading-7 text-slate-300">{text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 sm:mt-24 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">The people behind the work</p>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold tracking-[-0.04em] text-white">
              <KineticText text="Meet The Minds Behind UMJ Digital" />
            </h2>
            <p className="mx-auto mt-3.5 sm:mt-5 max-w-2xl text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-300">
              Three co-founders. Different expertise. One shared vision — building meaningful digital experiences for businesses.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {founders.map(({ name, role, bio, image }, index) => (
            <ScrollReveal key={name} delay={index * 0.08}>
              <SpotlightCard className="h-full rounded-2xl" maxTilt={3}>
                <article data-cursor="team" className="founder-card group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                  <div className="founder-image-wrap overflow-hidden">
                    <img src={image} alt={`${name}, ${role}`} className="h-[280px] sm:h-[380px] md:h-[430px] w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" decoding="async" />
                    <span className="founder-number">0{index + 1}</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-medium text-white transition-colors group-hover:text-cyan-100">{name}</h3>
                    <p className="mt-1.5 sm:mt-2 text-[10px] uppercase leading-5 tracking-[0.18em] text-cyan-200">{role}</p>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed sm:leading-7 text-slate-300">{bio}</p>
                  </div>
                </article>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 sm:mt-24 md:mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="contact-cta relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-cyan-100/25 px-5 py-7 sm:px-7 sm:py-12 md:px-12 md:py-16 shadow-[0_0_60px_rgba(69,234,244,0.12)]">
            <div className="contact-cta-orbit" aria-hidden="true" />
            <div className="relative z-10 flex flex-col gap-5 sm:gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-200">The next move is yours</p>
                <h2 className="mt-2.5 sm:mt-4 text-2xl sm:text-4xl md:text-6xl font-semibold leading-[1.06] tracking-[-0.04em] text-white">
                  <KineticText text="Have a Project in Mind? Let's Build Something Great." />
                </h2>
              </div>
              <MagneticLink
                to="/contact"
                cursorLabel="start"
                className="magnetic-link inline-flex min-h-[46px] sm:min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition active:scale-[0.98] hover:bg-cyan-200 hover:shadow-[0_0_30px_rgba(69,234,244,0.6)]"
              >
                Start a Conversation <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticLink>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
