document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ТАБИ (ПОРТФОЛІО) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                    // Пауза, якщо ми сховали відео фільтром
                    const hiddenVideo = item.querySelector('video');
                    if(hiddenVideo) hiddenVideo.pause();
                }
            });
        });
    });

    // --- 2. ВІДЕО ПЛЕЄР ---
    const allMockups = document.querySelectorAll('.phone-mockup');

    // SVG Іконки (Всі вектором!)
    const iconSoundOn = `<svg viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>`;
    const iconSoundOff = `<svg viewBox="0 0 24 24"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" /></svg>`;

    // Іконки Play/Pause
    const iconPlay = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>`;
    const iconPause = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>`;


    function muteAllExcept(currentVideo) {
        allMockups.forEach(mockup => {
            const video = mockup.querySelector('video');
            const muteBtn = mockup.querySelector('.mute-btn');
            const volumeSlider = mockup.querySelector('.volume-slider');

            if (video !== currentVideo) {
                video.muted = true;
                video.volume = 0;
                video.pause();

                if(muteBtn) muteBtn.innerHTML = iconSoundOff;
                if(volumeSlider) volumeSlider.value = 0;

                // Скидаємо іконку на Play
                const playIcon = mockup.querySelector('.play-icon');
                const playBtnBlock = mockup.querySelector('.center-play-btn');
                if(playIcon) {
                    playIcon.innerHTML = iconPlay;
                    playBtnBlock.classList.remove('paused');
                }
                mockup.classList.remove('is-playing');
            }
        });
    }

    allMockups.forEach(mockup => {
        const video = mockup.querySelector('video');
        const playBtnBlock = mockup.querySelector('.center-play-btn');
        const playIcon = mockup.querySelector('.play-icon');
        const muteBtn = mockup.querySelector('.mute-btn');
        const volumeSlider = mockup.querySelector('.volume-slider');
        const seekBar = mockup.querySelector('.seek-bar');

        let isManuallyMuted = true;
        let isHoveringControls = false;
        let returnToPosterTimeout;

        // --- UI UPDATE ---
        function updateUI() {
            // Play/Pause
            if (video.paused) {
                playIcon.innerHTML = iconPlay;
                playBtnBlock.classList.remove('paused');
                mockup.classList.remove('is-playing');
            } else {
                playIcon.innerHTML = iconPause;
                playBtnBlock.classList.add('paused');
                mockup.classList.add('is-playing');
            }

            // Sound
            if (video.muted || video.volume < 0.05) {
                muteBtn.innerHTML = iconSoundOff;
            } else {
                muteBtn.innerHTML = iconSoundOn;
            }
        }

        // Старт
        video.muted = true;
        video.volume = 0;
        muteBtn.innerHTML = iconSoundOff;
        if(volumeSlider) volumeSlider.value = 0;
        updateUI();

        // --- Control Hover Logic ---
        const controls = [muteBtn, volumeSlider, playBtnBlock];
        controls.forEach(el => {
            if(!el) return;
            el.addEventListener('mouseenter', () => { isHoveringControls = true; });
            el.addEventListener('mouseleave', () => { isHoveringControls = false; });
        });

        // 1. Desktop Hover
        mockup.addEventListener('mouseenter', () => {
            if (window.matchMedia("(min-width: 769px)").matches) {
                if (isHoveringControls) return;

                clearTimeout(returnToPosterTimeout);

                muteAllExcept(video);
                if (isManuallyMuted === false || video.paused) {
                    video.muted = false;
                    video.volume = 1;
                    if(volumeSlider) volumeSlider.value = 1;
                    isManuallyMuted = false;
                }
                if(video.paused) video.play().catch(e=>{});
                updateUI();
            }
        });

        mockup.addEventListener('mouseleave', () => {
            if (window.matchMedia("(min-width: 769px)").matches) {
                video.muted = true;
                updateUI();
            }
        });

        // 2. Mute Button
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();

            const hasSound = !video.muted && video.volume > 0.1;

            if (!hasSound) {
                clearTimeout(returnToPosterTimeout);
                muteAllExcept(video);
                video.muted = false;
                video.volume = 1;
                if(volumeSlider) volumeSlider.value = 1;
                isManuallyMuted = false;
                if(video.paused) video.play();
            } else {
                video.muted = true;
                video.volume = 0;
                if(volumeSlider) volumeSlider.value = 0;
                isManuallyMuted = true;
            }
            updateUI();
        });

        // 3. Slider
        if(volumeSlider) {
            ['mousedown', 'click', 'touchstart'].forEach(evt =>
                volumeSlider.addEventListener(evt, e => e.stopPropagation())
            );
            volumeSlider.addEventListener('input', (e) => {
                clearTimeout(returnToPosterTimeout);
                const val = parseFloat(e.target.value);
                video.volume = val;
                if(val > 0) {
                    video.muted = false;
                    muteAllExcept(video);
                    isManuallyMuted = false;
                } else {
                    video.muted = true;
                    isManuallyMuted = true;
                }
                updateUI();
            });
        }

        // 4. Phone Click (ФОН - PLAY/PAUSE)
        mockup.addEventListener('click', (e) => {
            if (muteBtn.contains(e.target) || (volumeSlider && volumeSlider.contains(e.target))) return;

            if (!e.target.closest('.bottom-controls')) {
                clearTimeout(returnToPosterTimeout);

                if (video.paused) {
                    muteAllExcept(video);
                    video.muted = false;
                    video.volume = 1;
                    if(volumeSlider) volumeSlider.value = 1;
                    isManuallyMuted = false;
                    video.play();
                } else {
                    video.pause();
                }
                updateUI();
            }
        });

        // 5. Seek Bar
        let isDragging = false;
        video.addEventListener('timeupdate', () => {
            if (!isDragging) {
                const value = (video.currentTime / video.duration) * 100;
                if(Number.isFinite(value)) seekBar.value = value;
            }
        });
        seekBar.addEventListener('input', () => {
            isDragging = true;
            clearTimeout(returnToPosterTimeout);
            video.pause();
            const time = (seekBar.value / 100) * video.duration;
            video.currentTime = time;
        });
        seekBar.addEventListener('change', () => {
            isDragging = false;
            video.play();
            updateUI();
        });

        // --- ЛОГІКА ПОВЕРНЕННЯ ДО ПОСТЕРА (5 секунд) ---
        video.addEventListener('pause', () => {
            if (!isDragging) {
                clearTimeout(returnToPosterTimeout);
                returnToPosterTimeout = setTimeout(() => {
                    video.load();
                    updateUI();
                }, 5000);
            }
        });
        video.addEventListener('play', () => {
            clearTimeout(returnToPosterTimeout);
        });

        // --- Interface Auto-Hide ---
        let hideControlsTimeout;
        function showControls() {
            mockup.classList.remove('interface-hidden');
            clearTimeout(hideControlsTimeout);
        }
        function startHideTimer() {
            clearTimeout(hideControlsTimeout);
            if (!video.paused) {
                hideControlsTimeout = setTimeout(() => {
                    mockup.classList.add('interface-hidden');
                }, 2000);
            }
        }
        video.addEventListener('play', startHideTimer);
        video.addEventListener('pause', showControls);
        ['mousemove', 'touchstart', 'click', 'input'].forEach(event => {
            mockup.addEventListener(event, () => {
                showControls();
                startHideTimer();
            });
        });
    });

    // --- 3. SCROLL PAUSE ---
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                const video = entry.target.querySelector('video');
                if (video) {
                    video.pause();
                    video.muted = true;

                    const mockup = entry.target;
                    const playIcon = mockup.querySelector('.play-icon');
                    const playBtnBlock = mockup.querySelector('.center-play-btn');
                    const muteBtn = mockup.querySelector('.mute-btn');
                    const volumeSlider = mockup.querySelector('.volume-slider');

                    if(playIcon) playIcon.innerHTML = iconPlay;
                    if(playBtnBlock) playBtnBlock.classList.remove('paused');
                    mockup.classList.remove('is-playing');

                    if(muteBtn) muteBtn.innerHTML = iconSoundOff;
                    if(volumeSlider) volumeSlider.value = 0;
                }
            }
        });
    }, { threshold: 0.6 });

    allMockups.forEach(mockup => observer.observe(mockup));


    // --- 4. REVIEWS NAVIGATION (Стрілки) ---
    const reviewsSlider = document.querySelector('.reviews-slider');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    if (reviewsSlider && prevArrow && nextArrow) {
        // Ширина картки + відступ (щоб гортати по одній)
        // 320px ширина картки + 20px gap = 340px
        const scrollAmount = 340;

        nextArrow.addEventListener('click', () => {
            reviewsSlider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevArrow.addEventListener('click', () => {
            reviewsSlider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

});