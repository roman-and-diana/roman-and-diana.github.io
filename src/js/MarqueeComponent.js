'use strict';

/**
 * MarqueeComponent - Handles the scrolling brand marquee
 */
export class MarqueeComponent {
    /**
     * @param {string} selector - CSS selector for marquee container
     * @param {string[]} brands - Array of brand names
     */
    constructor(selector, brands) {
        this.container = document.querySelector(selector);
        this.brands = brands;
        this.init();
    }

    init() {
        if (!this.container) return;

        // Repeat brands 3 times for seamless scrolling
        const repeatedBrands = [...this.brands, ...this.brands, ...this.brands];
        this.container.innerHTML = repeatedBrands
            .map(brand => `<span>${brand}</span> • `)
            .join('');
    }
}
