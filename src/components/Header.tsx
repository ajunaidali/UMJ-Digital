import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MagneticLink from './MagneticLink';
import { assets } from '../config/assets';
import { SOCIAL_LINKS } from '../config/contact';
import { navItems } from '../data/siteData';

const pageLoaders: Record<string, () => Promise<unknown>> = {
  '/services': () => import('../pages/Services'),
  '/faqs': () => import('../pages/Faqs'),
  '/portfolio': () => import('../pages/Portfolio'),
  '/contact': () => import('../pages/Contact'),
};

function prefetchPage(to: string) {
  void pageLoaders[to]?.();
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollYRef = useRef(0);
  const { pathname } = useLocation();

  // Throttled scroll listener to avoid layout thrashing and redundant re-renders
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 15;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer immediately on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Robust background scroll lock without touch freeze
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;

    if (mobileOpen) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;
      lenis?.stop();

      document.body.classList.add('nav-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const savedY = scrollYRef.current;
      document.body.classList.remove('nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      if (savedY > 0) {
        window.scrollTo(0, savedY);
      }
      lenis?.start();
    }

    return () => {
      const savedY = scrollYRef.current;
      document.body.classList.remove('nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (savedY > 0) {
        window.scrollTo(0, savedY);
      }
      lenis?.start();
    };
  }, [mobileOpen]);

  // Auto-close on desktop resize
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`site-header sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-cyan-300/20 bg-[#05082F]/92 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'border-white/10 bg-[#05082F]/80 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="UMJ Digital home">
            <img
              src={assets.branding.logoPrimarySvg}
              alt="UMJ Digital"
              className="h-8.5 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-10"
              width="707"
              height="357"
            />
          </Link>

          <nav className="hidden min-w-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 md:flex shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onPointerEnter={() => prefetchPage(item.to)}
                onFocus={() => prefetchPage(item.to)}
                className={({ isActive }) =>
                  `nav-link relative rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                    isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="nav-indicator"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 md:block">
            <MagneticLink
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-cyan-400/70 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-200 shadow-[0_0_15px_rgba(69,234,244,0.12)] transition duration-300 hover:bg-cyan-400 hover:text-slate-900 hover:shadow-[0_0_24px_rgba(69,234,244,0.45)]"
            >
              Book a Call
            </MagneticLink>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition active:scale-95 hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={20} className="transition-transform duration-200" /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Render Mobile Navigation via Portal directly to body to eliminate sticky-parent layout thrash */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <div className="fixed inset-0 top-[57px] sm:top-[65px] z-[999] md:hidden">
                {/* Backdrop for outside tap */}
                <motion.div
                  key="mobile-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                  aria-hidden="true"
                  onClick={() => setMobileOpen(false)}
                />

                {/* Dropdown Menu Container */}
                <motion.div
                  key="mobile-drawer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  id="mobile-nav"
                  className="relative z-10 max-h-[calc(100dvh-4.25rem)] overscroll-contain overflow-x-hidden overflow-y-auto border-b border-cyan-400/20 bg-[#05082F]/98 shadow-[0_24px_60px_rgba(0,0,0,0.95)]"
                >
                  <div className="mx-auto flex max-w-lg flex-col gap-2 px-4 py-5">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                      >
                        <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          onPointerEnter={() => prefetchPage(item.to)}
                          onFocus={() => prefetchPage(item.to)}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `flex min-h-[46px] items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition active:scale-[0.99] ${
                              isActive
                                ? 'border border-cyan-300/40 bg-cyan-300/15 font-semibold text-cyan-200 shadow-[0_0_20px_rgba(69,234,244,0.15)]'
                                : 'text-slate-200 hover:bg-white/5 hover:text-white'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span>{item.label}</span>
                              {isActive && (
                                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(69,234,244,0.8)]" />
                              )}
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}

                    <div className="mt-3 border-t border-white/10 pt-3 flex flex-col gap-3">
                      <Link
                        to="/contact"
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-[#071025] shadow-[0_0_20px_rgba(69,234,244,0.35)] transition active:scale-[0.98] hover:bg-white"
                      >
                        Book a Call
                      </Link>

                      <div className="flex items-center justify-center gap-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Available for new projects
                      </div>

                      {/* Mobile Drawer Social Links & Email */}
                      <div className="mt-2 border-t border-white/10 pt-3">
                        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-2.5">
                          Connect with us
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          {/* Instagram */}
                          <a
                            href={SOCIAL_LINKS.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="UMJ Digital on Instagram"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 active:scale-95"
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                            </svg>
                          </a>

                          {/* Facebook */}
                          <a
                            href={SOCIAL_LINKS.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="UMJ Digital on Facebook"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 active:scale-95"
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>

                          {/* TikTok */}
                          <a
                            href={SOCIAL_LINKS.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="UMJ Digital on TikTok"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 active:scale-95"
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 6.27 6.27 0 0 0 1.91-4.42V8.78a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.95-.21z"/>
                            </svg>
                          </a>

                          {/* Email */}
                          <a
                            href={`mailto:${SOCIAL_LINKS.email}`}
                            aria-label={`Email ${SOCIAL_LINKS.email}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 active:scale-95"
                          >
                            <Mail size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
