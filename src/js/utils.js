'use strict';

/**
 * Utility functions for the portfolio website
 */
export const Utils = {
    /**
     * Debounce function - delays execution until after wait time has passed
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function - limits execution to once per limit period
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if user prefers reduced motion
     * @returns {boolean}
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Check if device is mobile
     * @returns {boolean}
     */
    isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    },

    /**
     * Check if device is desktop
     * @returns {boolean}
     */
    isDesktop() {
        return window.matchMedia("(min-width: 769px)").matches;
    }
};
