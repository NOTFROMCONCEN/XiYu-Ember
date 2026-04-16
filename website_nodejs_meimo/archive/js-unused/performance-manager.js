/**
 * 性能优化管理器
 * 负责管理整个网站的性能优化策略
 */
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupImageLazyLoading();
        this.setupResourcePreloading();
        this.optimizeAnimations();
        this.setupPerformanceMonitoring();
    }

    /**
     * 图片延迟加载优化
     */
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if (images.length > 0 && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');

                        img.onload = () => {
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        };
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * 资源预加载优化
     */
    setupResourcePreloading() {
        // 预加载关键资源
        const criticalResources = [
            '/css/styles.css',
            '/css/header.css',
            '/images/logo1.PNG'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' :
                resource.endsWith('.js') ? 'script' : 'image';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    /**
     * 动画性能优化
     */
    optimizeAnimations() {
        // 检测设备性能
        const isLowEndDevice = 'deviceMemory' in navigator && navigator.deviceMemory < 4;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isLowEndDevice || prefersReducedMotion) {
            document.body.classList.add('reduce-animations');
        }

        // 优化滚动相关动画
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 滚动处理优化
     */
    handleScroll() {
        const animatedElements = document.querySelectorAll('.animated');

        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                if (!element.classList.contains('animate-in')) {
                    element.classList.add('animate-in');
                }
            } else {
                if (element.classList.contains('animate-in')) {
                    element.classList.remove('animate-in');
                }
            }
        });
    }

    /**
     * 性能监控
     */
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // 监控长任务
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                        this.optimizeForLongTask();
                    }
                });
            });

            observer.observe({ entryTypes: ['longtask'] });

            // 监控布局偏移
            const layoutObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.value > 0.1) {
                        console.warn('Significant layout shift detected:', entry);
                    }
                });
            });

            layoutObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    /**
     * 长任务优化
     */
    optimizeForLongTask() {
        // 如果检测到性能问题，降级处理
        document.body.classList.add('performance-optimized');

        // 降低动画复杂度
        const complexAnimations = document.querySelectorAll('.complex-animation');
        complexAnimations.forEach(element => {
            element.classList.add('simplified');
        });
    }

    /**
     * 内存使用优化
     */
    optimizeMemoryUsage() {
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            const usedJSHeapSize = memoryInfo.usedJSHeapSize;
            const jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit;

            if (usedJSHeapSize / jsHeapSizeLimit > 0.8) {
                this.cleanupMemory();
            }
        }
    }

    /**
     * 内存清理
     */
    cleanupMemory() {
        // 清理不可见区域的大型资源
        const offscreenImages = document.querySelectorAll('img:not([data-visible="true"])');
        offscreenImages.forEach(img => {
            if (!this.isElementInViewport(img)) {
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                img.dataset.src = img.src;
            }
        });
    }

    /**
     * 检查元素是否在可视区域
     */
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// 初始化性能管理器
window.performanceManager = new PerformanceManager();
