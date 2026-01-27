'use strict';

/**
 * ReviewsSlider - Handles reviews slider navigation
 */
export class ReviewsSlider {
    /**
     * @param {string} sliderSelector - CSS selector for slider
     * @param {string} prevBtnSelector - CSS selector for previous button
     * @param {string} nextBtnSelector - CSS selector for next button
     */
    constructor(sliderSelector, prevBtnSelector, nextBtnSelector) {
        this.slider = document.querySelector(sliderSelector);
        this.prevBtn = document.querySelector(prevBtnSelector);
        this.nextBtn = document.querySelector(nextBtnSelector);
        this.scrollAmount = 420;
        this.init();
    }

    init() {
        if (!this.slider || !this.prevBtn || !this.nextBtn) return;

        this.nextBtn.addEventListener('click', () => {
            this.slider.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
        });

        this.prevBtn.addEventListener('click', () => {
            this.slider.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
        });

        // Add keyboard navigation for accessibility
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                this.nextBtn.click();
            }
        });
    }
}
