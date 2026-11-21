import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, LoaderCircle, Mail, MessageSquareText, Send } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import SpotlightCard from '../components/SpotlightCard';
import { contactDeliveryConfig, SOCIAL_LINKS } from '../config/contact';
import { services } from '../data/siteData';

type FormState = {
  fullName: string;
  email: string;
  companyName: string;
  service: string;
  budget: string;
  projectDescription: string;
};

const initialState: FormState = {
  fullName: '',
  email: '',
  companyName: '',
  service: 'Web Development',
  budget: '',
  projectDescription: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.projectDescription.trim() || !form.service.trim()) {
      setStatus('error');
      setMessage('Please complete the required fields before submitting.');
      return;
    }

    setStatus('idle');
    setMessage('');

    if (contactDeliveryConfig.endpoint) {
      setIsLoading(true);
      try {
        const response = await fetch(contactDeliveryConfig.endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}.`);
        setStatus('success');
        setMessage('Thanks for reaching out. Your project inquiry has been sent.');
        setForm(initialState);
      } catch (error) {
        console.error('Unable to deliver the project inquiry.', error);
        setStatus('error');
        setMessage(`We could not send your inquiry. Please try again${contactDeliveryConfig.email ? ' or email us directly.' : '.'}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (contactDeliveryConfig.email) {
      const subject = encodeURIComponent(`Project inquiry: ${form.service}`);
      const body = encodeURIComponent([
        `Name: ${form.fullName}`,
        `Email: ${form.email}`,
        `Company: ${form.companyName || 'Not provided'}`,
        `Service: ${form.service}`,
        `Budget: ${form.budget || 'Not provided'}`,
        '',
        form.projectDescription,
      ].join('\n'));
      window.location.assign(`mailto:${contactDeliveryConfig.email}?subject=${subject}&body=${body}`);
      setStatus('success');
      setMessage('Your email draft is ready. Review it in your mail app and send it to deliver your inquiry.');
      return;
    }

    setStatus('error');
    setMessage('Form delivery is not configured yet. Please ask the site owner to set VITE_FORMSPREE_ENDPOINT or VITE_CONTACT_EMAIL.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <SectionTitle
        headingLevel={1}
        eyebrow="Contact"
        title="Tell us about your next digital project."
        description="Share a few details and we will review your goals, scope and the best next steps for your project."
      />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <SpotlightCard className="rounded-[2rem]" maxTilt={1.5}>
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 md:p-8">
                  <h3 className="text-2xl font-semibold text-white">Start a conversation</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">Tell us what you are building, what you need, and how to reach you.</p>
                  <div className="mt-8 space-y-5 text-sm text-slate-300">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1127] p-3 transition-colors hover:border-cyan-400/40">
                      <Mail className="text-cyan-300" size={18} />
                      {contactDeliveryConfig.email
                        ? <a href={`mailto:${contactDeliveryConfig.email}`} className="break-all transition-colors hover:text-cyan-200">{contactDeliveryConfig.email}</a>
                        : <span>Direct email is not configured. You can enable it with VITE_CONTACT_EMAIL.</span>}
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1127] p-3">
                      <MessageSquareText className="text-cyan-300" size={18} />
                      <span>{contactDeliveryConfig.endpoint ? 'Online form delivery is connected.' : contactDeliveryConfig.email ? 'Email draft delivery is available.' : 'Online form delivery is not connected yet.'}</span>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-white/10 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Connect directly</p>
                    <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                      <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0b1127] p-2.5 text-xs text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200 active:scale-95"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400 shrink-0">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                        <span>Instagram</span>
                      </a>

                      <a
                        href={SOCIAL_LINKS.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0b1127] p-2.5 text-xs text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200 active:scale-95"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-blue-400 shrink-0">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                      </a>

                      <a
                        href={SOCIAL_LINKS.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0b1127] p-2.5 text-xs text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200 active:scale-95"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-cyan-300 shrink-0">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 6.27 6.27 0 0 0 1.91-4.42V8.78a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.95-.21z"/>
                        </svg>
                        <span>TikTok</span>
                      </a>

                      <a
                        href={SOCIAL_LINKS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl border border-emerald-400/30 bg-[#0b1127] p-2.5 text-xs text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-200 active:scale-95"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-emerald-400 shrink-0">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.22-.16-.47-.29" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                    <div className="mt-8 rounded-[1.4rem] border border-cyan-400/25 bg-cyan-400/6 p-4 text-sm leading-7 text-cyan-100 shadow-[inset_0_0_20px_rgba(69,234,244,0.06)]">
                      <p className="font-medium">Delivery setup</p>
                      <p className="mt-2">{contactDeliveryConfig.guidance}</p>
                      <div className="mt-4 space-y-1">
                        {Object.entries(contactDeliveryConfig.envKeys).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
                            <span className="min-w-0 break-all text-xs uppercase tracking-[0.18em] text-slate-300">{key}</span>
                            <span className="shrink-0 text-xs text-cyan-200">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </SpotlightCard>

                  <SpotlightCard className="rounded-[2rem]" maxTilt={1.5}>
                    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 md:p-8">
                      <div className="grid gap-5 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-200">
                          <span>Full name *</span>
                          <input required autoComplete="name" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b1127] px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(69,234,244,0.18)]" placeholder="Your name" />
                        </label>

                        <label className="space-y-2 text-sm text-slate-200">
                          <span>Email *</span>
                          <input required autoComplete="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} type="email" className="w-full rounded-xl border border-white/10 bg-[#0b1127] px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(69,234,244,0.18)]" placeholder="you@example.com" />
                        </label>

                        <label className="space-y-2 text-sm text-slate-200">
                          <span>Company name</span>
                          <input value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b1127] px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(69,234,244,0.18)]" placeholder="Business name" />
                        </label>

                        <label className="space-y-2 text-sm text-slate-200">
                          <span>Service *</span>
                          <select value={form.service} onChange={(e) => handleChange('service', e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b1127] px-4 py-3 text-white outline-none transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(69,234,244,0.18)]">
                            {services.map(({ title }) => <option key={title} className="bg-[#0b1127] text-white">{title}</option>)}
                          </select>
                        </label>

                        <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
                          <span>Project budget</span>
                          <input value={form.budget} onChange={(e) => handleChange('budget', e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b1127] px-4 py-3 text-white outline-none placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(69,234,244,0.18)]" placeholder="Optional budget range" />
                        </label>

                          <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
                            <span>Project description *</span>
                            <textarea required value={form.projectDescription} onChange={(e) => handleChange('projectDescription', e.target.value)} className="min-h-[150px] w-full rounded-xl border border-white/10 bg-[#0b1127] px-4 py-3 text-white outline-none placeholder:text-slate-500 transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(69,234,244,0.18)]" placeholder="Tell us about your goals, timeline and what you need from the project." />
                          </label>
                        </div>

                    {message && (
                      <div role="status" aria-live="polite" className={`mt-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${status === 'success' ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/35 bg-rose-400/10 text-rose-200'}`}>
                        {status === 'success' ? <Check size={16} /> : <span className="text-base">!</span>}
                        <span>{message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 font-medium text-slate-950 shadow-[0_0_20px_rgba(69,234,244,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(69,234,244,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? <><LoaderCircle className="animate-spin" size={18} /> Sending</> : <><Send size={18} /> Send inquiry</>}
                    </button>
                  </form>
                </SpotlightCard>
            </div>
          </div>
          );
}
