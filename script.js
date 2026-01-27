'use strict';

/* =========================================
   CONFIGURATION DATA
   ========================================= */
const CONFIG = {
    brands: [
        "Bogenia", "Fitoproduct", "White & White", "Gerdan Jewelry",
        "Neverti", "Genabelle", "Blacktouch", "2wenty5ive"
    ],

    categories: [
        { filter: 'all', name: 'Всі', active: 0 },
        { filter: 'ugc', name: 'UGC Реклама', active: 0 },
        { filter: 'beauty', name: 'Beauty & Care', active: 1 },
        { filter: 'fashion', name: 'Fashion & Style', active: 0 },
        { filter: 'jewelry', name: 'Jewelry', active: 0 },
        { filter: 'commercial', name: 'Commercial', active: 0 }
    ],

    portfolio: [
        {
            folder: 'bogenia_peel_gel',
            category: 'beauty',
            title: 'Огляд Peel Gel',
            brand: 'Bogenia'
        },
        {
            folder: 'bogenia_shampoo',
            category: 'beauty',
            title: 'Огляд шампуня',
            brand: 'Bogenia'
        },
        {
            folder: 'bogenia_spf',
            category: 'beauty',
            title: 'Огляд SPF крему',
            brand: 'Bogenia'
        },
        {
            folder: 'genabelle_3_in_1',
            category: 'beauty',
            title: 'Огляд Aquaporin лінійки',
            brand: 'Genabelle'
        },
        {
            folder: 'gerdan_robber',
            category: 'jewelry',
            title: 'Ювелірні прикраси',
            brand: 'Gerdan Jewelry'
        },
        {
            folder: 'lifestyle_clothes',
            category: 'fashion',
            title: 'Fashion Look',
            brand: 'Lifestyle'
        },
        {
            folder: 'losyny',
            category: 'fashion',
            title: 'Огляд лосинів',
            brand: 'Лосини'
        },
        {
            folder: 'neverti_pomady_1',
            category: 'beauty',
            title: 'Огляд помад 1',
            brand: 'Neverti'
        },
        {
            folder: 'neverti_pomady_2',
            category: 'beauty',
            title: 'Огляд помад 2',
            brand: 'Neverti'
        },
        {
            folder: 'whiteandwhite',
            category: 'commercial',
            title: 'Стоматологія',
            brand: 'White & White Lviv'
        }
    ],

    reviews: [
        {
            type: 'instagram',
            brand: 'Bogenia',
            platform: 'Instagram',
            logo: 'assets/logos/logo_bogenia.png',
            image: 'assets/reviews/review_bogenia.png'
        },
        {
            type: 'instagram',
            brand: 'Fitoproduct',
            platform: 'Instagram',
            logo: 'assets/logos/logo_fitoproduct.png',
            image: 'assets/reviews/review_fitoproduct.png'
        },
        {
            type: 'instagram',
            brand: 'White & White',
            platform: 'Instagram',
            logo: 'assets/logos/logo_whiteandwhite.png',
            image: 'assets/reviews/review_whiteandwhite.png'
        },
        {
            type: 'instagram',
            brand: 'Gerdan Jewelry',
            platform: 'Instagram',
            logo: 'assets/logos/logo_gerdan.png',
            image: 'assets/reviews/review_gerdan.png'
        },
        {
            type: 'instagram',
            brand: '2wenty5ive',
            platform: 'Instagram',
            logo: 'assets/logos/logo_2wenty5ive.png',
            image: 'assets/reviews/review_2wenty5ive.png'
        }
    ]
};


/* =========================================
   UTILITIES
   ========================================= */
const Utils = {
    // Debounce function for performance
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

    // Throttle for frequent events
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

    // Check if device prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Check if mobile device
    isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    },

    // Check if desktop
    isDesktop() {
        return window.matchMedia("(min-width: 769px)").matches;
    }
};

/* =========================================
   SVG ICONS
   ========================================= */
const SVGS = {
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>`,
    pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>`,
    soundOn: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>`,
    soundOff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" /></svg>`,
    instagram: `<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>`,
    telegram: `<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z" /></svg>`,
    tiktok: `<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`
};

/* =========================================
   MARQUEE COMPONENT
   ========================================= */
class MarqueeComponent {
    constructor(selector, brands) {
        this.container = document.querySelector(selector);
        this.brands = brands;
        this.init();
    }

    init() {
        if (!this.container) return;
        const repeatedBrands = [...this.brands, ...this.brands, ...this.brands];
        this.container.innerHTML = repeatedBrands.map(brand => `<span>${brand}</span> • `).join('');
    }
}

/* =========================================
   PORTFOLIO FILTER COMPONENT
   ========================================= */
class PortfolioFilter {
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
        this.tabsContainer.innerHTML = this.categories.map(cat =>
            `<button class="tab-btn ${cat.active === 1 ? 'active' : ''}"
                     data-filter="${cat.filter}"
                     aria-label="Фільтр ${cat.name}">
                ${cat.name}
            </button>`
        ).join('');
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
                const video = item.querySelector('video');
                if (video && !video.paused) {
                    video.pause();
                }
            }
        });
    }
}

/* =========================================
   PORTFOLIO RENDERER
   ========================================= */
class PortfolioRenderer {
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
        this.container.innerHTML = this.portfolioData.map(item => `
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
        `).join('');
    }
}

/* =========================================
   REVIEWS COMPONENT
   ========================================= */
class ReviewsComponent {
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
        this.slider.innerHTML = this.reviewsData.map(review => `
            <div class="review-card ${review.type}">
                <div class="card-header">
                    <div class="brand-info">
                        <img src="${review.logo}" alt="${review.brand} логотип" class="brand-logo" loading="lazy">
                        <div class="brand-text">
                            <span class="brand-name">${review.brand}</span>
                            <span class="platform-name">${review.platform}</span>
                        </div>
                    </div>
                    ${this.getPlatformIcon(review.type)}
                </div>
                <div class="review-image-container">
                    <img src="${review.image}" alt="Відгук від ${review.brand}" class="review-img" loading="lazy">
                </div>
            </div>
        `).join('');
    }
}


/* =========================================
   VIDEO PLAYER CLASS
   ========================================= */
class VideoPlayer {
    constructor(mockupElement) {
        this.mockup = mockupElement;
        this.video = mockupElement.querySelector('video');
        this.playBtnBlock = mockupElement.querySelector('.center-play-btn');
        this.playIcon = mockupElement.querySelector('.play-icon');
        this.muteBtn = mockupElement.querySelector('.mute-btn');
        this.volumeSlider = mockupElement.querySelector('.volume-slider');
        this.seekBar = mockupElement.querySelector('.seek-bar');

        this.isManuallyMuted = true;
        this.isHoveringControls = false;
        this.returnToPosterTimeout = null;
        this.hideControlsTimeout = null;
        this.isDragging = false;

        this.init();
    }

    init() {
        if (!this.video) return;

        // Set initial state
        this.video.muted = true;
        this.video.volume = 0;
        if (this.volumeSlider) this.volumeSlider.value = 0;

        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Hover detection for controls
        [this.muteBtn, this.volumeSlider, this.playBtnBlock].forEach(el => {
            if (!el) return;
            el.addEventListener('mouseenter', () => { this.isHoveringControls = true; });
            el.addEventListener('mouseleave', () => { this.isHoveringControls = false; });
        });

        // Desktop hover
        if (Utils.isDesktop()) {
            this.mockup.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.mockup.addEventListener('mouseleave', () => this.handleMouseLeave());
        }

        // Mute button
        this.muteBtn?.addEventListener('click', (e) => this.handleMuteClick(e));

        // Volume slider
        if (this.volumeSlider) {
            ['mousedown', 'click', 'touchstart'].forEach(evt =>
                this.volumeSlider.addEventListener(evt, e => e.stopPropagation())
            );
            this.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e));
        }

        // Click to play/pause
        this.mockup.addEventListener('click', (e) => this.handleMockupClick(e));

        // Seek bar
        this.video.addEventListener('timeupdate', () => this.updateSeekBar());
        this.seekBar?.addEventListener('input', () => this.handleSeekStart());
        this.seekBar?.addEventListener('change', () => this.handleSeekEnd());

        // Pause timeout
        this.video.addEventListener('pause', () => this.handleVideoPause());
        this.video.addEventListener('play', () => this.handleVideoPlay());

        // Hide controls timeout
        this.video.addEventListener('play', () => this.startHideTimer());
        this.video.addEventListener('pause', () => this.showControls());

        // Throttled mousemove for better performance
        const throttledShowControls = Utils.throttle(() => {
            this.showControls();
            this.startHideTimer();
        }, 100);

        ['mousemove', 'touchstart', 'click', 'input'].forEach(event => {
            this.mockup.addEventListener(event, throttledShowControls);
        });
    }

    updateUI() {
        if (!this.video || !this.playIcon || !this.muteBtn) return;

        if (this.video.paused) {
            this.playIcon.innerHTML = SVGS.play;
            this.playBtnBlock?.classList.remove('paused');
            this.mockup.classList.remove('is-playing');
        } else {
            this.playIcon.innerHTML = SVGS.pause;
            this.playBtnBlock?.classList.add('paused');
            this.mockup.classList.add('is-playing');
        }

        if (this.video.muted || this.video.volume < 0.05) {
            this.muteBtn.innerHTML = SVGS.soundOff;
            this.muteBtn.setAttribute('aria-label', 'Увімкнути звук');
        } else {
            this.muteBtn.innerHTML = SVGS.soundOn;
            this.muteBtn.setAttribute('aria-label', 'Вимкнути звук');
        }
    }

    handleMouseEnter() {
        if (this.isHoveringControls) return;
        clearTimeout(this.returnToPosterTimeout);
        VideoPlayer.muteAllExcept(this.video);

        if (this.isManuallyMuted === false || this.video.paused) {
            this.video.muted = false;
            this.video.volume = 1;
            if (this.volumeSlider) this.volumeSlider.value = 1;
            this.isManuallyMuted = false;
        }

        if (this.video.paused) {
            this.video.play().catch(err => console.warn('Video play failed:', err));
        }
        this.updateUI();
    }

    handleMouseLeave() {
        this.video.muted = true;
        this.updateUI();
    }

    handleMuteClick(e) {
        e.stopPropagation();
        const hasSound = !this.video.muted && this.video.volume > 0.1;

        if (!hasSound) {
            clearTimeout(this.returnToPosterTimeout);
            VideoPlayer.muteAllExcept(this.video);
            this.video.muted = false;
            this.video.volume = 1;
            if (this.volumeSlider) this.volumeSlider.value = 1;
            this.isManuallyMuted = false;
            if (this.video.paused) {
                this.video.play().catch(err => console.warn('Video play failed:', err));
            }
        } else {
            this.video.muted = true;
            this.video.volume = 0;
            if (this.volumeSlider) this.volumeSlider.value = 0;
            this.isManuallyMuted = true;
        }
        this.updateUI();
    }

    handleVolumeChange(e) {
        clearTimeout(this.returnToPosterTimeout);
        const val = parseFloat(e.target.value);
        this.video.volume = val;

        if (val > 0) {
            this.video.muted = false;
            VideoPlayer.muteAllExcept(this.video);
            this.isManuallyMuted = false;
        } else {
            this.video.muted = true;
            this.isManuallyMuted = true;
        }
        this.updateUI();
    }

    handleMockupClick(e) {
        if (this.muteBtn?.contains(e.target) || this.volumeSlider?.contains(e.target)) return;
        if (e.target.closest('.bottom-controls')) return;

        clearTimeout(this.returnToPosterTimeout);

        if (this.video.paused) {
            VideoPlayer.muteAllExcept(this.video);
            this.video.muted = false;
            this.video.volume = 1;
            if (this.volumeSlider) this.volumeSlider.value = 1;
            this.isManuallyMuted = false;
            this.video.play().catch(err => console.warn('Video play failed:', err));
        } else {
            this.video.pause();
        }
        this.updateUI();
    }

    updateSeekBar() {
        if (!this.isDragging && this.seekBar) {
            const value = (this.video.currentTime / this.video.duration) * 100;
            if (Number.isFinite(value)) this.seekBar.value = value;
        }
    }

    handleSeekStart() {
        this.isDragging = true;
        clearTimeout(this.returnToPosterTimeout);
        this.video.pause();
        const time = (this.seekBar.value / 100) * this.video.duration;
        this.video.currentTime = time;
    }

    handleSeekEnd() {
        this.isDragging = false;
        this.video.play().catch(err => console.warn('Video play failed:', err));
        this.updateUI();
    }

    handleVideoPause() {
        if (!this.isDragging) {
            clearTimeout(this.returnToPosterTimeout);
            this.returnToPosterTimeout = setTimeout(() => {
                this.video.load();
                this.updateUI();
            }, 3000);
        }
    }

    handleVideoPlay() {
        clearTimeout(this.returnToPosterTimeout);
    }

    showControls() {
        this.mockup.classList.remove('interface-hidden');
        clearTimeout(this.hideControlsTimeout);
    }

    startHideTimer() {
        clearTimeout(this.hideControlsTimeout);
        if (!this.video.paused) {
            this.hideControlsTimeout = setTimeout(() => {
                this.mockup.classList.add('interface-hidden');
            }, 2000);
        }
    }

    pause() {
        if (!this.video.paused) {
            this.video.pause();
        }
        this.video.muted = true;
        if (this.playIcon) this.playIcon.innerHTML = SVGS.play;
        if (this.playBtnBlock) this.playBtnBlock.classList.remove('paused');
        this.mockup.classList.remove('is-playing');
        if (this.muteBtn) this.muteBtn.innerHTML = SVGS.soundOff;
        if (this.volumeSlider) this.volumeSlider.value = 0;
    }

    static muteAllExcept(currentVideo) {
        if (!VideoPlayer.allPlayers) return;
        VideoPlayer.allPlayers.forEach(player => {
            if (player.video !== currentVideo) {
                player.pause();
            }
        });
    }

    static initAll(selector) {
        const mockups = document.querySelectorAll(selector);
        VideoPlayer.allPlayers = Array.from(mockups).map(mockup => new VideoPlayer(mockup));

        // Setup intersection observer for lazy loading and pause on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const player = VideoPlayer.allPlayers.find(p => p.mockup === entry.target);
                if (player && !entry.isIntersecting) {
                    player.pause();
                }
            });
        }, { threshold: 0.6 });

        VideoPlayer.allPlayers.forEach(player => observer.observe(player.mockup));
    }
}

/* =========================================
   REVIEWS SLIDER NAVIGATION
   ========================================= */
class ReviewsSlider {
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

        // Add keyboard navigation
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                this.nextBtn.click();
            }
        });
    }
}

/* =========================================
   APPLICATION INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize marquee
    new MarqueeComponent('.marquee-content', CONFIG.brands);

    // Render portfolio items
    new PortfolioRenderer('.video-grid', CONFIG.portfolio);

    // Initialize portfolio filter (must be after rendering)
    new PortfolioFilter('.portfolio-tabs', '.portfolio-item', CONFIG.categories);

    // Initialize video players (must be after portfolio rendering)
    VideoPlayer.initAll('.phone-mockup');

    // Render and initialize reviews
    new ReviewsComponent('.reviews-slider', CONFIG.reviews);
    new ReviewsSlider('.reviews-slider', '.prev-arrow', '.next-arrow');

    // Log initialization
    if (console && console.info) {
        console.info('Portfolio website initialized successfully');
    }
});