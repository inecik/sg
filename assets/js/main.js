/**
 * Şenol Güneş - Presentation JavaScript
 * Professional presentation website for Turkish football legend
 *
 * @author Site Author
 * @version 1.0.0
 */

(function() {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                     || window.innerWidth < 768;

    const CONFIG = {
        DESIGN_WIDTH: 1920,
        DESIGN_HEIGHT: 1080,
        PARTICLE_COUNT: isMobile ? 20 : 80,  // Reduced for mobile
        SWIPE_THRESHOLD: 50,
        TRANSITION_DELAY: isMobile ? 150 : 250  // Faster on mobile
    };

    // ==========================================================================
    // DOM Elements
    // ==========================================================================

    const DOM = {
        aspectRatioBox: document.querySelector('.aspect-ratio-box'),
        slides: document.querySelectorAll('.slide'),
        progressBar: document.getElementById('progressBar'),
        currentSlideEl: document.getElementById('currentSlide'),
        totalSlidesEl: document.getElementById('totalSlides'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        fullscreenIcon: document.getElementById('fullscreenIcon'),
        particlesContainer: document.getElementById('particles')
    };

    // ==========================================================================
    // State
    // ==========================================================================

    const state = {
        currentSlide: 0,
        totalSlides: DOM.slides.length,
        touchStartX: 0,
        touchEndX: 0,
        isTransitioning: false,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    };

    // ==========================================================================
    // Scaling System
    // ==========================================================================

    let scaleTimeout;
    function updateScale() {
        // Debounce on mobile for better performance
        if (isMobile && scaleTimeout) {
            clearTimeout(scaleTimeout);
        }

        const doScale = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const scaleX = viewportWidth / CONFIG.DESIGN_WIDTH;
            const scaleY = viewportHeight / CONFIG.DESIGN_HEIGHT;
            const scale = Math.min(scaleX, scaleY);
            DOM.aspectRatioBox.style.transform = `scale(${scale})`;
        };

        if (isMobile) {
            scaleTimeout = setTimeout(doScale, 100);
        } else {
            doScale();
        }
    }

    // ==========================================================================
    // Progress & UI Updates
    // ==========================================================================

    function updateProgress() {
        const progress = ((state.currentSlide + 1) / state.totalSlides) * 100;
        DOM.progressBar.style.width = progress + '%';
        DOM.currentSlideEl.textContent = state.currentSlide + 1;
    }

    // ==========================================================================
    // Slide Navigation (Optimized for Mobile)
    // ==========================================================================

    function goToSlide(index, updateHash = true) {
        if (index < 0 || index >= state.totalSlides) return;
        if (state.isTransitioning) return;  // Prevent rapid transitions
        if (index === state.currentSlide) return;  // Already on this slide

        state.isTransitioning = true;

        const currentSlideEl = DOM.slides[state.currentSlide];
        const nextSlideEl = DOM.slides[index];

        // Simple, performant transition
        currentSlideEl.classList.remove('active');
        currentSlideEl.classList.add('exit');

        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
            setTimeout(() => {
                currentSlideEl.classList.remove('exit');
                state.currentSlide = index;
                nextSlideEl.classList.add('active');
                updateProgress();

                // Update URL hash for bookmarking/refresh support
                if (updateHash) {
                    updateURLHash(index);
                }

                state.isTransitioning = false;
            }, CONFIG.TRANSITION_DELAY);
        });
    }

    // ==========================================================================
    // URL Hash Management
    // ==========================================================================

    function updateURLHash(slideIndex) {
        const slideNumber = slideIndex + 1;
        const newHash = `#slide-${slideNumber}`;
        if (window.location.hash !== newHash) {
            history.pushState(null, '', newHash);
        }
    }

    function getSlideFromHash() {
        const hash = window.location.hash;
        if (!hash) return 0;

        // Support formats: #slide-5, #5, #slide5
        const match = hash.match(/^#(?:slide-?)?(\d+)$/);
        if (match) {
            const slideNumber = parseInt(match[1], 10);
            // Convert to 0-based index and clamp to valid range
            return Math.max(0, Math.min(slideNumber - 1, state.totalSlides - 1));
        }
        return 0;
    }

    function handleHashChange() {
        const slideIndex = getSlideFromHash();
        if (slideIndex !== state.currentSlide) {
            goToSlide(slideIndex, false);  // Don't update hash again
        }
    }

    function nextSlide() {
        if (state.currentSlide < state.totalSlides - 1) {
            goToSlide(state.currentSlide + 1);
        }
    }

    function prevSlide() {
        if (state.currentSlide > 0) {
            goToSlide(state.currentSlide - 1);
        }
    }

    // ==========================================================================
    // Fullscreen
    // ==========================================================================

    const FULLSCREEN_ICONS = {
        enter: '<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>',
        exit: '<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>'
    };

    function toggleFullscreen() {
        if (state.isIOS) {
            toggleIOSFullscreen();
        } else {
            toggleStandardFullscreen();
        }
    }

    function toggleIOSFullscreen() {
        window.scrollTo(0, 1);

        if (!document.body.classList.contains('ios-fullscreen')) {
            document.body.classList.add('ios-fullscreen');
            DOM.fullscreenIcon.innerHTML = FULLSCREEN_ICONS.exit;
        } else {
            document.body.classList.remove('ios-fullscreen');
            DOM.fullscreenIcon.innerHTML = FULLSCREEN_ICONS.enter;
        }

        setTimeout(updateScale, 100);
    }

    function toggleStandardFullscreen() {
        const elem = document.querySelector('.aspect-ratio-container');

        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.log('Fullscreen error:', err);
                });
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    function updateFullscreenIcon() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            DOM.fullscreenIcon.innerHTML = FULLSCREEN_ICONS.exit;
        } else {
            DOM.fullscreenIcon.innerHTML = FULLSCREEN_ICONS.enter;
        }
        setTimeout(updateScale, 100);
    }

    // ==========================================================================
    // Touch/Swipe Support (Optimized)
    // ==========================================================================

    let touchStartY = 0;

    function handleTouchStart(e) {
        state.touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        state.touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        const diffX = state.touchStartX - state.touchEndX;
        const diffY = touchStartY - touchEndY;

        // Only trigger if horizontal swipe is more prominent than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > CONFIG.SWIPE_THRESHOLD) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // ==========================================================================
    // Particle System (Lightweight for Mobile)
    // ==========================================================================

    function createParticles() {
        // Skip particles entirely on very small screens
        if (window.innerWidth < 480) {
            return;
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 8}s;
                animation-duration: ${6 + Math.random() * 4}s;
            `;
            fragment.appendChild(particle);
        }

        DOM.particlesContainer.appendChild(fragment);
    }

    // ==========================================================================
    // Event Listeners
    // ==========================================================================

    function initEventListeners() {
        // Resize with passive listener
        window.addEventListener('resize', updateScale, { passive: true });
        window.addEventListener('orientationchange', () => {
            setTimeout(updateScale, 150);
        }, { passive: true });

        // Navigation buttons
        DOM.nextBtn.addEventListener('click', nextSlide);
        DOM.prevBtn.addEventListener('click', prevSlide);
        DOM.fullscreenBtn.addEventListener('click', toggleFullscreen);

        // Fullscreen change
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);

        // URL hash change (browser back/forward)
        window.addEventListener('popstate', handleHashChange);

        // Keyboard
        document.addEventListener('keydown', handleKeyboard);

        // Touch - with passive listeners for better scroll performance
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // iOS specific
        if (state.isIOS) {
            window.addEventListener('resize', () => {
                document.body.style.height = window.innerHeight + 'px';
                updateScale();
            }, { passive: true });
            document.body.style.height = window.innerHeight + 'px';
        }
    }

    function handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
                prevSlide();
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
            default:
                // Number keys 1-9 for quick navigation
                if (e.key >= '1' && e.key <= '9') {
                    goToSlide(parseInt(e.key) - 1);
                }
        }
    }

    // ==========================================================================
    // Mobile Performance Optimizations
    // ==========================================================================

    function applyMobileOptimizations() {
        if (!isMobile) return;

        // Add mobile class for CSS optimizations
        document.body.classList.add('is-mobile');

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
        }
    }

    // ==========================================================================
    // Initialization
    // ==========================================================================

    function init() {
        // Apply mobile optimizations first
        applyMobileOptimizations();

        // Set total slides count
        DOM.totalSlidesEl.textContent = state.totalSlides;

        // Check URL hash for initial slide
        const initialSlide = getSlideFromHash();
        if (initialSlide > 0) {
            // Navigate to the slide from URL hash (without animation)
            DOM.slides[0].classList.remove('active');
            DOM.slides[initialSlide].classList.add('active');
            state.currentSlide = initialSlide;
        } else if (!window.location.hash) {
            // Set initial hash if none exists
            history.replaceState(null, '', '#slide-1');
        }

        // Initialize systems
        updateScale();
        updateProgress();
        initEventListeners();

        // Delay particle creation slightly for faster initial load
        if (!isMobile || window.innerWidth >= 480) {
            setTimeout(createParticles, 500);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
