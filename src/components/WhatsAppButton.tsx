import { WHATSAPP_LINK } from '../config/contact';

export default function WhatsAppButton() {
  return (
    <aside aria-label="WhatsApp quick chat" className="pointer-events-none fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with UMJ Digital on WhatsApp"
        className="group pointer-events-auto relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.7)] active:scale-95 sm:h-14 sm:w-14"
      >
        {/* Subtle breathing ambient halo */}
        <span
          className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/40 animate-ping opacity-75"
          style={{ animationDuration: '3s' }}
          aria-hidden="true"
        />

        {/* Official WhatsApp SVG Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-[30px] sm:w-[30px]"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.22-.16-.47-.29" />
        </svg>

        {/* Desktop Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md opacity-0 transition-all duration-200 group-hover:opacity-100 md:inline-block">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
}

