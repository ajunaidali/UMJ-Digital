import { ArrowUpRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticLink from './MagneticLink';
import { assets } from '../config/assets';
import { contactDeliveryConfig } from '../config/contact';

export default function Footer() {
  return (
      <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#04081d]">
        <div className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-80 w-[36rem] rounded-full bg-cyan-400/[0.07] blur-[120px]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
            <div>
              <img src={assets.branding.logoPrimarySvg} alt="UMJ Digital" className="h-12 w-auto transition-transform duration-300 hover:scale-105" width="707" height="357" />
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                Turning ideas into digital experiences with strategy, design, development and growth systems built for modern businesses.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">Explore</h3>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li><Link to="/" className="transition-colors hover:text-cyan-200">Home</Link></li>
                <li><Link to="/services" className="transition-colors hover:text-cyan-200">Services</Link></li>
                <li><Link to="/portfolio" className="transition-colors hover:text-cyan-200">Portfolio</Link></li>
                <li><Link to="/contact" className="transition-colors hover:text-cyan-200">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">Company</h3>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li><Link to="/faqs" className="transition-colors hover:text-cyan-200">FAQ</Link></li>
                <li><Link to="/contact" className="transition-colors hover:text-cyan-200">Get in touch</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-200">Connect</h3>
              <div className="mt-6 flex flex-col items-start gap-4">
                {contactDeliveryConfig.email && (
                  <a href={`mailto:${contactDeliveryConfig.email}`} className="inline-flex min-w-0 items-center gap-2 break-all text-sm text-slate-300 transition hover:text-cyan-200">
                    <Mail size={16} /> {contactDeliveryConfig.email}
                  </a>
                )}
                  <MagneticLink to="/contact" cursorLabel="start" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-100">
                    Start Your Project <ArrowUpRight size={16} />
              </MagneticLink>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UMJ Digital. All rights reserved.</p>
          <p>Turning Ideas Into Digital Experiences.</p>
        </div>
      </div>
    </footer>
  );
}
