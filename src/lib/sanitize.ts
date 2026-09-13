import DOMPurify from 'dompurify';

// Stored rich text may have been written before admin RLS was enforced.
export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html, {
  USE_PROFILES: { html: true },
});
