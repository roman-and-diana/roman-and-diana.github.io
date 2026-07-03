'use strict';

/**
 * Analytics - tracks contact/CTA button clicks as GA4 events.
 * Safe no-op if gtag (Google Analytics) is not loaded.
 */
export function initAnalytics() {
    const selector = '.btn-cta, .floating-cta, .service-btn, .social-btn';

    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('click', () => {
            const label =
                el.dataset.cta ||
                el.getAttribute('aria-label') ||
                (el.textContent || '').trim() ||
                el.getAttribute('href') ||
                'unknown';
            trackEvent('contact_click', label);
        });
    });
}

function trackEvent(action, label) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: 'engagement',
            event_label: label
        });
    }
}
