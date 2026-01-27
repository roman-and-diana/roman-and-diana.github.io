'use strict';

import { SVGS } from './svgs.js';

/**
 * ReviewsComponent - Renders customer reviews
 */
export class ReviewsComponent {
    /**
     * @param {string} sliderSelector - CSS selector for reviews slider
     * @param {Array} reviewsData - Array of review objects
     */
    constructor(sliderSelector, reviewsData) {
        this.slider = document.querySelector(sliderSelector);
        this.reviewsData = reviewsData;
        this.init();
    }

    init() {
        if (!this.slider) return;
        this.render();
    }

    getPlatformIcon(type) {
        const icons = {
            instagram: SVGS.instagram,
            telegram: SVGS.telegram,
            tiktok: SVGS.tiktok
        };
        return icons[type] || SVGS.instagram;
    }

    render() {
        this.slider.innerHTML = this.reviewsData
            .map(review => `
                <div class="review-card ${review.type}">
                    <div class="card-header">
                        <div class="brand-info">
                            <img src="${review.logo}"
                                 alt="${review.brand} логотип"
                                 class="brand-logo"
                                 loading="lazy">
                            <div class="brand-text">
                                <span class="brand-name">${review.brand}</span>
                                <span class="platform-name">${review.platform}</span>
                            </div>
                        </div>
                        ${this.getPlatformIcon(review.type)}
                    </div>
                    <div class="review-image-container">
                        <img src="${review.image}"
                             alt="Відгук від ${review.brand}"
                             class="review-img"
                             loading="lazy">
                    </div>
                </div>
            `)
            .join('');
    }
}
