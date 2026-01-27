'use strict';

import { MarqueeComponent } from './MarqueeComponent.js';
import { PortfolioRenderer } from './PortfolioRenderer.js';
import { PortfolioFilter } from './PortfolioFilter.js';
import { VideoPlayer } from './VideoPlayer.js';
import { ReviewsComponent } from './ReviewsComponent.js';
import { ReviewsSlider } from './ReviewsSlider.js';

/**
 * Main application initialization
 */
class PortfolioApp {
    constructor() {
        this.config = null;
        this.portfolio = null;
        this.reviews = null;
    }

    /**
     * Load JSON data files
     */
    async loadData() {
        try {
            const [configRes, portfolioRes, reviewsRes] = await Promise.all([
                fetch('src/data/config.json'),
                fetch('src/data/portfolio.json'),
                fetch('src/data/reviews.json')
            ]);

            this.config = await configRes.json();
            this.portfolio = await portfolioRes.json();
            this.reviews = await reviewsRes.json();

            return true;
        } catch (error) {
            console.error('Failed to load data:', error);
            return false;
        }
    }

    /**
     * Initialize all components
     */
    initComponents() {
        // Initialize marquee
        new MarqueeComponent('.marquee-content', this.config.brands);

        // Render portfolio items
        new PortfolioRenderer('.video-grid', this.portfolio);

        // Initialize portfolio filter (must be after rendering)
        new PortfolioFilter('.portfolio-tabs', '.portfolio-item', this.config.categories);

        // Initialize video players (must be after portfolio rendering)
        VideoPlayer.initAll('.phone-mockup');

        // Render and initialize reviews
        new ReviewsComponent('.reviews-slider', this.reviews);
        new ReviewsSlider('.reviews-slider', '.prev-arrow', '.next-arrow');
    }

    /**
     * Start the application
     */
    async init() {
        const dataLoaded = await this.loadData();

        if (!dataLoaded) {
            console.error('Failed to initialize application: data loading error');
            return;
        }

        this.initComponents();

        // Log success
        if (console && console.info) {
            console.info('✅ Portfolio website initialized successfully');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});
