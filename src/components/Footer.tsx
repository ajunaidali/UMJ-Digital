import { ArrowUpRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticLink from './MagneticLink';
import { assets } from '../config/assets';
import { SOCIAL_LINKS } from '../config/contact';

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#04081d]">
      <div className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-80 w-[36rem] rounded-full bg-cyan-400/[0.07] blur-[120px]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.3fr]">
          <div>
            <Link to="/" className="inline-block" aria-label="UMJ Digital home">
              <img
                src={assets.branding.logoPrimarySvg}
                alt="UMJ Digital"
                className="h-10 w-auto transition-transform duration-300 hover:scale-105 sm:h-12"
                width="707"
                height="357"
              />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Turning ideas into digital experiences with strategy, design, development and growth systems built for modern businesses.
            </p>
            {/* Social Icons on Brand column */}
            <div className="mt-6 flex items-center gap-3">
              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UMJ Digital on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-all duration-200 hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 hover:scale-105 active:scale-95"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-all duration-200 hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 hover:scale-105 active:scale-95"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="UMJ Digital on TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-all duration-200 hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-200 hover:scale-105 active:scale-95"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 6.27 6.27 0 0 0 1.91-4.42V8.78a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.95-.21z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 transition-all duration-200 hover:border-emerald-400/70 hover:bg-emerald-500/20 hover:text-emerald-200 hover:scale-105 active:scale-95"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.22-.16-.47-.29" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">Explore</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
              <li><Link to="/" className="transition-colors hover:text-cyan-200">Home</Link></li>
              <li><Link to="/services" className="transition-colors hover:text-cyan-200">Services</Link></li>
              <li><Link to="/portfolio" className="transition-colors hover:text-cyan-200">Portfolio</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-cyan-200">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">Company</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
              <li><Link to="/faqs" className="transition-colors hover:text-cyan-200">FAQ</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-cyan-200">Get in touch</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">Connect</h3>
            <div className="mt-5 flex flex-col items-start gap-4">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="inline-flex min-w-0 items-center gap-2 break-all text-sm text-slate-300 transition hover:text-cyan-200"
              >
                <Mail size={16} className="text-cyan-300 shrink-0" /> {SOCIAL_LINKS.email}
              </a>
              <MagneticLink
                to="/contact"
                cursorLabel="start"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-100"
              >
                Start Your Project <ArrowUpRight size={16} />
              </MagneticLink>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UMJ Digital. All rights reserved.</p>
          <p>Turning Ideas Into Digital Experiences.</p>
        </div>
      </div>
    </footer>
  );
}
