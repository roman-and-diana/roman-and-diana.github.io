'use strict';

/**
 * ContactCTA - On mobile, open the Instagram APP directly (profile)
 * instead of the in-app browser. Falls back to the web profile if the
 * app is not installed. On desktop the default web link is used.
 */
export class ContactCTA {
    /**
     * @param {string} selector - CSS selector for the CTA link(s)
     * @param {string} username - Instagram username (without @)
     */
    constructor(selector, username) {
        this.links = document.querySelectorAll(selector);
        this.username = username;
        this.appUrl = `instagram://user?username=${username}`;
        this.webUrl = `https://www.instagram.com/${username}`;
        this.init();
    }

    isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    }

    init() {
        if (!this.links.length || !this.isMobile()) return;

        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.openApp(e));
        });
    }

    openApp(e) {
        e.preventDefault();

        const start = Date.now();

        // Fallback to the web profile if the app did not take over the page.
        // If the app opens, the tab is backgrounded and this timer is throttled,
        // so the elapsed time will exceed the threshold and we skip the fallback.
        const fallback = setTimeout(() => {
            if (Date.now() - start < 1500) {
                window.location.href = this.webUrl;
            }
        }, 1000);

        // Cancel fallback when the page is hidden (app successfully opened).
        const onHide = () => {
            if (document.visibilityState === 'hidden') {
                clearTimeout(fallback);
                document.removeEventListener('visibilitychange', onHide);
            }
        };
        document.addEventListener('visibilitychange', onHide);

        // Attempt to launch the Instagram app.
        window.location.href = this.appUrl;
    }
}
