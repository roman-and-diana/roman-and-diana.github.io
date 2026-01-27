'use strict';

import { SVGS } from './svgs.js';

/**
 * PortfolioRenderer - Renders portfolio video items
 */
export class PortfolioRenderer {
    /**
     * @param {string} selector - CSS selector for portfolio container
     * @param {Array} portfolioData - Array of portfolio items
     */
    constructor(selector, portfolioData) {
        this.container = document.querySelector(selector);
        this.portfolioData = portfolioData;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.render();
    }

    render() {
        this.container.innerHTML = this.portfolioData
            .map(item => `
                <div class="portfolio-item" data-category="${item.category}">
                    <div class="phone-mockup" role="region" aria-label="Відео ${item.title}">
                        <video class="video-element"
                               src="assets/video/${item.folder}/video.mp4"
                               poster="assets/video/${item.folder}/poster.png"
                               preload="none"
                               loop
                               playsinline
                               muted
                               aria-label="${item.title}"></video>

                        <div class="video-controls">
                            <button class="center-play-btn paused" aria-label="Відтворити відео">
                                <span class="play-icon">${SVGS.play}</span>
                            </button>
                            <div class="bottom-controls">
                                <div class="control-row">
                                    <span style="font-size: 0.8rem; color: white; opacity: 0.8;"></span>
                                    <div class="volume-container">
                                        <button class="mute-btn" aria-label="Увімкнути звук">${SVGS.soundOff}</button>
                                        <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1" aria-label="Регулятор гучності">
                                    </div>
                                </div>
                                <input type="range" class="seek-bar" value="0" min="0" max="100" step="0.1" aria-label="Прогрес відео">
                            </div>
                        </div>
                    </div>
                    <div class="video-info">
                        <h4>${item.title}</h4>
                        <span class="client-tag">${item.brand}</span>
                    </div>
                </div>
            `)
            .join('');
    }
}
