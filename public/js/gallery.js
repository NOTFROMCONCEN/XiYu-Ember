/**
 * 栖屿碎片 - V2 轮播画廊脚本 (诊断模式)
 * @author Huameitang
 * 增加了详细的日志记录和错误捕获，用于定位初始化失败的问题。
 */

export class Gallery {
    constructor() {
        this.images = [
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3c5dbdef.png',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3c62df7e.png',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3c6b35e5.png',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3c78897b.png',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3ca30028.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3ca38292.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3ca56671.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cb77d26.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cb7a303.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cbdcab3.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cccd40c.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cd0e09b.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cd7c608.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3ce2dfea.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3ce41612.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cf61286.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3cfbebda.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3d0deabe.jpg',
            'https://lsky.xn--p8z.icu/i/2025/08/21/68a6d3d22eec7.jpg'
        ];

        this.currentIndex = 0;
        // The init() call is now deferred to the initializer script
    }

    init() {
        console.log('[Gallery] Initializing...');
        try {
            this.cacheDOMElements();

            if (!this.track || !this.paginationContainer || !this.nextButton || !this.prevButton) {
                console.error('[Gallery] Initialization failed: One or more core carousel elements are missing from the DOM.');
                return; // Stop execution if essential elements are missing
            }

            console.log('[Gallery] Building slides...');
            this.buildSlides();
            
            console.log('[Gallery] Building pagination...');
            this.buildPagination();
            
            console.log('[Gallery] Updating carousel view...');
            this.updateCarousel();
            
            console.log('[Gallery] Setting up event listeners...');
            this.setupEventListeners();
            
            console.log('[Gallery] Setting up lazy loading...');
            this.setupLazyLoading();
            
            console.log('%c[Gallery] Initialization successful!', 'color: #2ecc71; font-weight: bold;');
        } catch (error) {
            console.error('%c[Gallery] An error occurred during initialization:', 'color: #e74c3c; font-weight: bold;', error);
        }
    }

    cacheDOMElements() {
        console.log('[Gallery] Caching DOM elements...');
        this.track = document.querySelector('.carousel-track');
        console.log('[Gallery] .carousel-track found:', this.track);

        this.paginationContainer = document.querySelector('.carousel-pagination');
        console.log('[Gallery] .carousel-pagination found:', this.paginationContainer);

        this.nextButton = document.querySelector('.carousel-button.next');
        console.log('[Gallery] .carousel-button.next found:', this.nextButton);

        this.prevButton = document.querySelector('.carousel-button.prev');
        console.log('[Gallery] .carousel-button.prev found:', this.prevButton);

        this.lightbox = document.getElementById('gallery-lightbox');
        console.log('[Gallery] #gallery-lightbox found:', this.lightbox);

        if (this.lightbox) {
            this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
            this.lightboxClose = this.lightbox.querySelector('.lightbox-close');
            this.lightboxDownload = this.lightbox.querySelector('.lightbox-download');
        } else {
            console.error('[Gallery] Lightbox container not found!');
        }
    }

    buildSlides() {
        this.track.innerHTML = ''; // Clear previous content
        this.images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.className = 'carousel-image lazy';
            img.dataset.src = src; // For lazy loading
            img.alt = `Gallery image ${index + 1}`;
            slide.appendChild(img);
            this.track.appendChild(slide);
        });
    }

    buildPagination() {
        this.paginationContainer.innerHTML = ''; // Clear previous content
        this.images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot';
            dot.dataset.index = index;
            this.paginationContainer.appendChild(dot);
        });
        this.dots = this.paginationContainer.querySelectorAll('.pagination-dot');
    }

    updateCarousel() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        if (this.dots && this.dots.length > 0) {
            this.dots.forEach(dot => dot.classList.remove('active'));
            this.dots[this.currentIndex].classList.add('active');
        }
    }

    setupEventListeners() {
        this.nextButton.addEventListener('click', () => this.moveToSlide(this.currentIndex + 1));
        this.prevButton.addEventListener('click', () => this.moveToSlide(this.currentIndex - 1));

        this.paginationContainer.addEventListener('click', e => {
            if (e.target.matches('.pagination-dot')) {
                const index = parseInt(e.target.dataset.index, 10);
                this.moveToSlide(index);
            }
        });

        this.track.addEventListener('click', e => {
            if (e.target.matches('.carousel-image') && !e.target.classList.contains('lazy')) {
                this.openLightbox(e.target.src);
            }
        });

        if (this.lightbox) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
            this.lightbox.addEventListener('click', e => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }
    }

    moveToSlide(index) {
        if (index < 0) {
            this.currentIndex = this.images.length - 1;
        } else if (index >= this.images.length) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }
        this.updateCarousel();
    }

    setupLazyLoading() {
        const lazyImages = this.track.querySelectorAll('.lazy');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.onload = () => {
                        img.style.filter = 'none'; // Ensure blur is removed
                    };
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '0px 0px 200px 0px' });

        lazyImages.forEach(img => observer.observe(img));
    }

    openLightbox(src) {
        if (!this.lightbox) return;
        this.lightboxImage.src = src;
        this.lightboxDownload.href = src;
        this.lightbox.classList.add('visible');
    }

    closeLightbox() {
        if (!this.lightbox) return;
        this.lightbox.classList.remove('visible');
    }
}