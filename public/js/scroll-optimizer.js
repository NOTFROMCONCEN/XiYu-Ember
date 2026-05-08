/**
 * 滚动性能优化模块
 * @author Huameitang
 */

class ScrollOptimizer {
    constructor() {
        // 节流延迟时间（毫秒）
        this.throttleDelay = 16; // 约60fps
        this.lastScrollTime = 0;
        this.scrollHandler = this.handleScroll.bind(this);
        this.isScrolling = false;
        this.scrollTimeout = null;

        // 初始化
        this.init();
    }

    init() {
        // 使用 passive 监听器来优化滚动性能
        window.addEventListener('scroll', this.scrollHandler, { passive: true });

        // 监听滚动开始和结束
        this.setupScrollListener();
    }

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            // 清除之前的定时器
            window.clearTimeout(this.scrollTimeout);

            if (!this.isScrolling) {
                this.isScrolling = true;
                document.body.classList.add('is-scrolling');
            }

            // 设置新的定时器
            this.scrollTimeout = window.setTimeout(() => {
                this.isScrolling = false;
                document.body.classList.remove('is-scrolling');
            }, 150);
        }, { passive: true });
    }

    handleScroll(event) {
        const now = Date.now();

        // 实现节流，防止过于频繁的处理
        if (now - this.lastScrollTime < this.throttleDelay) {
            return;
        }

        this.lastScrollTime = now;

        // 获取当前滚动位置
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // 使用 requestAnimationFrame 来优化渲染
        requestAnimationFrame(() => {
            this.updateDOMBasedOnScroll(scrollPosition);
        });
    }

    updateDOMBasedOnScroll(scrollPosition) {
        // 获取所有需要检查的元素
        const elements = document.querySelectorAll('.animated-element, .parallax-element, .party-section');

        elements.forEach(element => {
            // 获取元素位置信息
            const rect = element.getBoundingClientRect();

            // 检查元素是否在可视区域内
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // 元素在可视区域内，启用动画
                if (element.classList.contains('party-section')) {
                    // 对派对区域特殊处理
                    this.optimizePartySection(element);
                } else {
                    element.classList.add('visible');
                }
            } else {
                // 元素不在可视区域内，禁用动画
                element.classList.remove('visible');
            }
        });
    }

    optimizePartySection(element) {
        // 如果正在滚动，延迟一些高消耗的视觉效果
        if (this.isScrolling) {
            element.classList.add('scrolling-optimize');
        } else {
            element.classList.remove('scrolling-optimize');
        }

        // 使用 transform 而不是 top/left 来实现动画
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        element.style.transform = `translateY(${scrollProgress * 20}px)`;
    }

    destroy() {
        window.removeEventListener('scroll', this.scrollHandler);
        if (this.scrollTimeout) {
            window.clearTimeout(this.scrollTimeout);
        }
    }
}

// 导出实例
window.ScrollOptimizer = new ScrollOptimizer();
