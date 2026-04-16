/**
 * 动画优化管理器
 * 用于优化和管理页面所有动画效果
 * @author Huameitang
 */
class AnimationOptimizer {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isLowPowerMode = navigator.deviceMemory < 4;
        this.isScrolling = false;
        this.animatedElements = new Set();
        this.lastFrameTime = 0;
        this.init();
    }

    init() {
        // 初始化动画优化
        this.setupIntersectionObserver();
        this.setupScrollListener();
        this.setupResizeListener();
        this.setupReducedMotionListener();
        this.optimizeExistingAnimations();
    }

    setupIntersectionObserver() {
        // 创建交叉观察器来优化可见区域的动画
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    element.classList.add('visible');
                    this.animatedElements.add(element);
                } else {
                    // 对于离开视口的元素，可选择是否重置动画
                    if (!element.hasAttribute('data-persist-animation')) {
                        element.classList.remove('visible');
                        this.animatedElements.delete(element);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // 观察所有带动画的元素
        document.querySelectorAll('.animated-element, .fade-in, .stagger-animation')
            .forEach(element => this.observer.observe(element));
    }

    setupScrollListener() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                document.body.classList.add('is-scrolling');
                this.isScrolling = true;
            }

            // 清除之前的定时器
            clearTimeout(scrollTimeout);

            // 设置新的定时器
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
                this.isScrolling = false;
                this.resumeAnimations();
            }, 150);

            // 滚动时暂停不必要的动画
            if (this.isScrolling) {
                this.pauseNonEssentialAnimations();
            }
        }, { passive: true });
    }

    setupResizeListener() {
        // 使用 ResizeObserver 优化调整大小时的动画
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                if (this.isReducedMotion) return;

                entries.forEach(entry => {
                    const element = entry.target;
                    if (element.classList.contains('animated-element')) {
                        this.optimizeAnimation(element);
                    }
                });
            });

            document.querySelectorAll('.animated-element')
                .forEach(element => resizeObserver.observe(element));
        }
    }

    setupReducedMotionListener() {
        // 监听系统减少动画设置的变化
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionMediaQuery.addEventListener('change', () => {
            this.isReducedMotion = motionMediaQuery.matches;
            this.updateAnimationSettings();
        });
    }

    optimizeExistingAnimations() {
        // 优化现有的动画元素
        document.querySelectorAll('.animated-element').forEach(element => {
            // 添加硬件加速
            element.classList.add('hardware-accelerated');

            // 优化动画持续时间
            const duration = this.isLowPowerMode ? '0.3s' : '0.6s';
            element.style.transitionDuration = duration;
        });
    }

    pauseNonEssentialAnimations() {
        // 滚动时暂停非必要动画
        document.querySelectorAll('.animated-element:not(.essential-animation)')
            .forEach(element => {
                element.classList.add('animation-paused');
            });
    }

    resumeAnimations() {
        // 恢复所有动画
        document.querySelectorAll('.animation-paused')
            .forEach(element => {
                element.classList.remove('animation-paused');
            });
    }

    optimizeAnimation(element) {
        // 根据元素大小和位置优化动画
        const rect = element.getBoundingClientRect();
        const area = rect.width * rect.height;
        const viewportArea = window.innerWidth * window.innerHeight;

        if (area > viewportArea * 0.3) {
            // 大元素使用更简单的动画
            element.style.transitionDuration = '0.3s';
            element.classList.add('simple-animation');
        }
    }

    updateAnimationSettings() {
        // 更新动画设置
        document.body.classList.toggle('reduced-motion', this.isReducedMotion);
        document.body.classList.toggle('low-power', this.isLowPowerMode);

        // 更新所有动画元素的设置
        this.animatedElements.forEach(element => {
            this.optimizeAnimation(element);
        });
    }

    // 公共方法：添加新的动画元素
    addAnimatedElement(element) {
        if (element && !this.animatedElements.has(element)) {
            element.classList.add('animated-element', 'hardware-accelerated');
            this.observer.observe(element);
            this.optimizeAnimation(element);
        }
    }

    // 公共方法：移除动画元素
    removeAnimatedElement(element) {
        if (element && this.animatedElements.has(element)) {
            this.observer.unobserve(element);
            this.animatedElements.delete(element);
        }
    }
}

// 创建全局实例
window.AnimationOptimizer = new AnimationOptimizer();
