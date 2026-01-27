'use strict';

/**
 * PortfolioFilter - Handles category filtering for portfolio items
 */
export class PortfolioFilter {
    /**
     * @param {string} tabsSelector - CSS selector for tabs container
     * @param {string} itemsSelector - CSS selector for portfolio items
     * @param {Array} categories - Array of category objects
     */
    constructor(tabsSelector, itemsSelector, categories) {
        this.tabsContainer = document.querySelector(tabsSelector);
        this.items = document.querySelectorAll(itemsSelector);
        this.categories = categories;
        this.activeCategory = categories.find(c => c.active === 1) || categories[0];
        this.init();
    }

    init() {
        if (!this.tabsContainer) return;
        this.renderTabs();
        this.attachEventListeners();
        this.filterItems(this.activeCategory.filter);
    }

    renderTabs() {
        this.tabsContainer.innerHTML = this.categories
            .map(cat => `
                <button class="tab-btn ${cat.active === 1 ? 'active' : ''}"
                        data-filter="${cat.filter}"
                        aria-label="Фільтр ${cat.name}">
                    ${cat.name}
                </button>
            `)
            .join('');
    }

    attachEventListeners() {
        const tabBtns = this.tabsContainer.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleTabClick(btn, tabBtns));
        });
    }

    handleTabClick(btn, allBtns) {
        allBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');
        this.filterItems(filterValue);
    }

    filterItems(filterValue) {
        this.items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
                // Pause hidden videos
                const video = item.querySelector('video');
                if (video && !video.paused) {
                    video.pause();
                }
            }
        });
    }
}
