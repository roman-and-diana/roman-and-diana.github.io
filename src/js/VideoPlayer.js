'use strict';

import { Utils } from './utils.js';
import { SVGS } from './svgs.js';

/**
 * VideoPlayer - Manages individual video player instance
 */
export class VideoPlayer {
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
