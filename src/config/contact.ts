const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim() ?? '';
const envEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? '';

/**
 * =========================================================================
 * WHATSAPP CONFIGURATION
 * =========================================================================
 * Replace this placeholder with your WhatsApp phone number in international
 * format without '+' or dashes (e.g. '923001234567').
 */
export const WHATSAPP_NUMBER = '92XXXXXXXXXX';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * =========================================================================
 * SOCIAL MEDIA & CONTACT CONFIGURATION
 * =========================================================================
 */
export const SOCIAL_LINKS = {
  email: 'digitalumj@gmail.com',
  instagram: 'https://www.instagram.com/umj.digital/',
  facebook: 'https://www.facebook.com/share/19YyX2ASzt/',
  tiktok: 'https://www.tiktok.com/@umjdigital?lang=en',
  whatsapp: WHATSAPP_LINK,
} as const;

export const contactDeliveryConfig = {
  endpoint,
  email: envEmail || SOCIAL_LINKS.email,
  envKeys: {
    VITE_FORMSPREE_ENDPOINT: endpoint ? 'Connected' : 'Not configured',
    VITE_CONTACT_EMAIL: envEmail ? 'Connected' : 'Using default (digitalumj@gmail.com)',
  },
  guidance: endpoint
    ? 'Project inquiries are delivered securely through your configured form endpoint.'
    : 'Submitting the form opens a pre-filled email draft to digitalumj@gmail.com.',
};
