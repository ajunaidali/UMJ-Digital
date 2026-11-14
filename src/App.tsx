import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AmbientCursor from './components/AmbientCursor';
import Footer from './components/Footer';
import Header from './components/Header';
import SmoothScroll from './components/SmoothScroll';
import { assets } from './config/assets';
import HomePage from './pages/Home';

const ServicesPage = lazy(() => import('./pages/Services'));
const FaqsPage = lazy(() => import('./pages/Faqs'));
const PortfolioPage = lazy(() => import('./pages/Portfolio'));
const ContactPage = lazy(() => import('./pages/Contact'));

function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">404</p>
      <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">This page is not on the map.</h1>
      <p className="mt-5 max-w-md text-base leading-8 text-slate-300">The link may be out of date. Head back to the studio homepage.</p>
        <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-[#071025] transition hover:bg-white shadow-[0_0_20px_rgba(69,234,244,0.3)] hover:shadow-[0_0_30px_rgba(69,234,244,0.5)]">
          Back home
        </Link>
    </div>
  );
}

function PageMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Suspense fallback={<div className="min-h-[50vh]" />}>{children}</Suspense>
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const warmRoutes = () => {
      void import('./pages/Services');
      void import('./pages/Faqs');
      void import('./pages/Portfolio');
      void import('./pages/Contact');
    };
    const idleId = window.requestIdleCallback?.(warmRoutes, { timeout: 2200 });
    if (idleId !== undefined) return () => window.cancelIdleCallback(idleId);
    const timeoutId = window.setTimeout(warmRoutes, 1600);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="site-content min-h-screen text-white">
      <SmoothScroll />
      <div
        className="site-backdrop"
        style={{ '--site-bg': `url("${assets.backgrounds.site}")` } as CSSProperties}
      />
      <div className="site-grid-texture" aria-hidden="true" />
      <AmbientCursor />
      <Header />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageMotion><HomePage /></PageMotion>} />
            <Route path="/services" element={<PageMotion><ServicesPage /></PageMotion>} />
            <Route path="/faqs" element={<PageMotion><FaqsPage /></PageMotion>} />
            <Route path="/portfolio" element={<PageMotion><PortfolioPage /></PageMotion>} />
            <Route path="/contact" element={<PageMotion><ContactPage /></PageMotion>} />
            <Route path="*" element={<PageMotion><NotFoundPage /></PageMotion>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
