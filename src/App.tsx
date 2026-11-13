import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AmbientCursor from './components/AmbientCursor';
import Footer from './components/Footer';
import Header from './components/Header';
import { assets } from './config/assets';

const HomePage = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/Services'));
const FaqsPage = lazy(() => import('./pages/Faqs'));
const PortfolioPage = lazy(() => import('./pages/Portfolio'));
const ContactPage = lazy(() => import('./pages/Contact'));

function PageMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Suspense fallback={<div className="min-h-[50vh]" />}>{children}</Suspense>
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="site-content min-h-screen text-white">
      <div
        className="site-backdrop"
        style={{ '--site-bg': `url("${assets.backgrounds.site}")` } as CSSProperties}
      />
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
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
