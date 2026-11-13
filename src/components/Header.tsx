import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { assets } from '../config/assets';
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
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileOpen);
    return () => document.body.classList.remove('nav-open');
  }, [mobileOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-[#05082F]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="UMJ Digital home">
          <img src={assets.branding.logoPrimarySvg} alt="UMJ Digital" className="h-10 w-auto" width="707" height="357" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onPointerEnter={() => prefetchPage(item.to)}
              onFocus={() => prefetchPage(item.to)}
              className={({ isActive }) =>
                `nav-link relative rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <motion.span layoutId="nav-indicator" className="nav-indicator" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/contact"
            onPointerEnter={() => prefetchPage('/contact')}
            onFocus={() => prefetchPage('/contact')}
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/70 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-900"
          >
            Book a Call
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            id="mobile-nav"
            className="max-h-[calc(100dvh-4.5rem)] overflow-x-hidden overflow-y-auto border-t border-white/10 bg-[#05082F] md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {navItems.map((item, index) => (
                <motion.div key={item.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.035 }}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onPointerEnter={() => prefetchPage(item.to)}
                    onFocus={() => prefetchPage(item.to)}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-cyan-300 text-slate-950' : 'text-slate-200 hover:bg-white/5'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-full border border-cyan-400/70 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-200"
              >
                Book a Call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
