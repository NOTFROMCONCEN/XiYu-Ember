/**
 * 交互功能模块
 * @author Huameitang
 * 这个模块负责处理网站的用户交互功能
 * 包括平滑滚动、表单提交、FAQ交互等
 * 采用事件驱动的设计模式，提供良好的用户体验
 * 遵循DRY原则，避免代码重复
 */

/**
 * 初始化所有交互功能
 * 这个函数是交互模块的入口点，负责启动所有交互功能
 * 采用统一的初始化方式，便于管理和控制
 * 集成性能优化，根据设备性能调整交互效果
 * @author Huameitang
 */
let interactionsInitialized = false;

function initializeInteractions() {
    if (interactionsInitialized) {
        return;
    }
    interactionsInitialized = true;

    initMenuToggle();
    // 获取性能配置
    const performanceConfig = window.PerformanceConfig ?
        window.PerformanceConfig.getPerformanceConfig() : null;

    initSmoothScrolling(performanceConfig);
    initFormSubmission();
    initFAQInteractions();
    initScrollOptimizations(performanceConfig);
}

/**
 * 初始化模态对话框功能
 * @author Huameitang
 * 这个函数负责为悬浮按钮和关闭按钮添加点击事件监听器，
 * 并处理点击对话框外部区域时关闭对话框的逻辑。
 * 它被设计为在悬浮按钮组件加载后调用。
 */
window.initModal = function () {
    const modal = document.getElementById('info-modal');
    const btn = document.getElementById('more-info-btn');
    const span = document.getElementsByClassName('close-btn')[0];

    if (btn) {
        btn.onclick = function () {
            if (modal) modal.style.display = 'block';
        }
    }

    if (span) {
        span.onclick = function () {
            if (modal) modal.style.display = 'none';
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
};

/**
 * 初始化平滑滚动功能
 * 为所有锚点链接添加平滑滚动效果
 * 提升页面导航的用户体验
 * 根据性能配置调整滚动行为
 * @param {Object} performanceConfig - 性能配置对象
 * @author Huameitang
 */
function initSmoothScrolling(performanceConfig) {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    // 根据性能配置决定滚动行为
    const scrollBehavior = (performanceConfig === window.PerformanceConfig?.PERFORMANCE_CONFIG.LOW) ?
        'auto' : 'smooth';

    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: scrollBehavior,
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 初始化表单提交功能
 * 处理预约表单的提交事件
 * 提供用户反馈和表单验证
 * @author Huameitang
 */
function initFormSubmission() {
    const bookingForm = document.querySelector('.booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(this);
            const formObject = {};

            // 转换FormData为普通对象
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            // 简单的表单验证
            if (validateForm(formObject)) {
                // 模拟表单提交
                submitForm(formObject);
            }
        });
    }
}

/**
 * 表单验证函数
 * 验证表单数据的完整性和有效性
 * 确保用户输入的数据符合要求
 * @param {Object} formData - 表单数据对象
 * @returns {boolean} 验证结果
 * @author Huameitang
 */
function validateForm(formData) {
    const requiredFields = ['name', 'phone', 'date'];

    for (let field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            alert(`请填写${getFieldLabel(field)}`);
            return false;
        }
    }

    return true;
}

/**
 * 获取字段标签
 * 将字段名转换为用户友好的标签
 * 提供更好的错误提示信息
 * @param {string} fieldName - 字段名
 * @returns {string} 字段标签
 * @author Huameitang
 */
function getFieldLabel(fieldName) {
    const labels = {
        'name': '昵称',
        'phone': '联系方式',
        'date': '期望时间',
        'experience': '派对类型',
        'message': '特殊要求'
    };

    return labels[fieldName] || fieldName;
}

/**
 * 提交表单数据
 * 处理表单数据的提交逻辑
 * 提供用户反馈和后续处理
 * @param {Object} formData - 表单数据对象
 * @author Huameitang
 */
function submitForm(formData) {
    // 这里可以添加实际的表单提交逻辑
    // 比如发送AJAX请求到服务器

    console.log('表单数据:', formData);

    // 显示成功消息
    showSuccessMessage();

    // 重置表单
    const form = document.querySelector('.booking-form');
    if (form) {
        form.reset();
    }
}

/**
 * 显示成功消息
 * 向用户显示表单提交成功的反馈
 * 提供良好的用户体验
 * @author Huameitang
 */
function showSuccessMessage() {
    alert('派对预约已提交！我们将尽快与您联系确认派对时间和详细安排。');
}

/**
 * 初始化FAQ交互功能
 * 为FAQ问题添加展开/收起功能
 * 提供动态的内容展示
 * @author Huameitang
 */
function initFAQInteractions() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (!answer || !icon) return;

            // 切换答案显示状态
            if (answer.style.display === 'none' || answer.style.display === '') {
                answer.style.display = 'block';
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.style.display = 'none';
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

/**
/**
 * 初始化移动端菜单切换功能
 * @author Huameitang
 * 这个函数为汉堡菜单按钮添加点击事件监听器，
 * 用于在移动端切换导航菜单的显示和隐藏。
 * 它通过切换CSS类来控制菜单的可见性，
 * 从而实现响应式的导航效果。
 */
function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
}

/**
 * 初始化滚动优化
 * 在低性能模式下优化滚动性能
 * 新增智能滚动检测和动态优化
 * @param {Object} performanceConfig - 性能配置对象
 * @author Huameitang
 */
function initScrollOptimizations(performanceConfig) {
    let isScrolling = false;
    let scrollVelocity = 0;
    let lastScrollTop = 0;
    let scrollDirection = 'down';

    // 创建滚动性能监控
    const scrollPerformanceMonitor = {
        frameCount: 0,
        lastTime: performance.now(),
        fps: 60,

        update() {
            this.frameCount++;
            const now = performance.now();
            if (now - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
                this.frameCount = 0;
                this.lastTime = now;

                // 如果FPS过低，启用更激进的优化
                if (this.fps < 30) {
                    document.body.classList.add('low-fps-mode');
                } else if (this.fps > 45) {
                    document.body.classList.remove('low-fps-mode');
                }
            }
        }
    };

    // 智能滚动处理器
    const smartScrollHandler = window.PerformanceConfig?.throttle(() => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollVelocity = Math.abs(currentScrollTop - lastScrollTop);
        scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = currentScrollTop;

        // 更新性能监控
        scrollPerformanceMonitor.update();

        // 根据滚动速度动态调整优化级别
        if (scrollVelocity > 50) {
            // 快速滚动时的激进优化
            document.body.classList.add('fast-scrolling');

            // 隐藏复杂视觉效果
            const complexElements = document.querySelectorAll('.vhs-overlay, .distortion, .noise, .particle-effect');
            complexElements.forEach(el => {
                el.style.visibility = 'hidden';
                el.style.pointerEvents = 'none';
            });

            // 暂停动画
            if (window.Effects?.pauseAllAnimations) {
                window.Effects.pauseAllAnimations();
            }
        } else if (scrollVelocity > 20) {
            // 中等速度滚动的适度优化
            document.body.classList.add('medium-scrolling');
            document.body.classList.remove('fast-scrolling');
        } else {
            // 慢速滚动或停止滚动
            document.body.classList.remove('fast-scrolling', 'medium-scrolling');
        }

        // 滚动方向优化
        document.body.classList.toggle('scrolling-down', scrollDirection === 'down');
        document.body.classList.toggle('scrolling-up', scrollDirection === 'up');

        isScrolling = true;

        // 滚动结束检测
        clearTimeout(window.scrollEndTimer);
        window.scrollEndTimer = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('fast-scrolling', 'medium-scrolling', 'scrolling-down', 'scrolling-up');

            // 恢复视觉效果
            const complexElements = document.querySelectorAll('.vhs-overlay, .distortion, .noise, .particle-effect');
            complexElements.forEach(el => {
                el.style.visibility = '';
                el.style.pointerEvents = '';
            });

            // 恢复动画
            if (window.Effects?.resumeAllAnimations) {
                window.Effects.resumeAllAnimations();
            }
        }, performanceConfig === window.PerformanceConfig?.PERFORMANCE_CONFIG.LOW ? 300 : 150);
    }, performanceConfig === window.PerformanceConfig?.PERFORMANCE_CONFIG.LOW ? 32 : 16);

    // 添加滚动事件监听
    window.addEventListener('scroll', smartScrollHandler, { passive: true });

    // 如果是低性能模式，添加额外的CSS优化
    if (performanceConfig === window.PerformanceConfig?.PERFORMANCE_CONFIG.LOW) {
        const style = document.createElement('style');
        style.textContent = `
            .fast-scrolling .vhs-overlay,
            .fast-scrolling .distortion,
            .fast-scrolling .noise::before {
                display: none !important;
            }
            .fast-scrolling * {
                pointer-events: none;
            }
            .fast-scrolling {
                scroll-behavior: auto !important;
            }
            .low-fps-mode .particle-effect,
            .low-fps-mode .complex-animation {
                animation-play-state: paused !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 增强的Intersection Observer
    if ('IntersectionObserver' in window) {
        // 主要内容观察器
        const mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;

                if (entry.isIntersecting) {
                    element.classList.add('in-viewport');
                    element.classList.remove('out-of-viewport');

                    // 恢复动画和效果
                    if (element.dataset.hasAnimation) {
                        element.style.animationPlayState = 'running';
                    }
                } else {
                    element.classList.remove('in-viewport');
                    element.classList.add('out-of-viewport');

                    // 暂停动画以节省性能
                    if (performanceConfig === window.PerformanceConfig?.PERFORMANCE_CONFIG.LOW) {
                        if (element.style.animationName) {
                            element.dataset.hasAnimation = 'true';
                            element.style.animationPlayState = 'paused';
                        }
                    }
                }
            });
        }, {
            rootMargin: '100px',
            threshold: [0, 0.1, 0.5, 1]
        });

        // 图片懒加载观察器
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '200px'
        });

        // 观察所有重要元素
        document.querySelectorAll('section, .gallery-section, .dream-pool, .symbols-section, .dream-card, .hero-content, .gallery-item').forEach(el => {
            mainObserver.observe(el);
        });

        // 观察所有需要懒加载的图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 触摸设备优化
    if ('ontouchstart' in window) {
        let touchStartY = 0;
        let touchMoveY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', window.PerformanceConfig?.throttle((e) => {
            touchMoveY = e.touches[0].clientY;
            const touchVelocity = Math.abs(touchMoveY - touchStartY);

            if (touchVelocity > 30) {
                document.body.classList.add('touch-scrolling');
            }
        }, 16), { passive: true });

        document.addEventListener('touchend', () => {
            setTimeout(() => {
                document.body.classList.remove('touch-scrolling');
            }, 100);
        }, { passive: true });
    }
}

/**
 * 初始化模态框功能
 * 负责处理悬浮按钮的点击事件，以及模态框的显示和隐藏逻辑。
 * 通过事件监听器，实现了用户与模态框的交互，包括打开和关闭模态框。
 * @author Huameitang
 */
function initModal() {
    const modal = document.getElementById('info-modal');
    const btn = document.getElementById('more-info-btn');
    const span = document.getElementsByClassName('close-btn')[0];

    if (btn && modal) {
        btn.onclick = function () {
            modal.style.display = 'block';
        }
    }

    if (span && modal) {
        span.onclick = function () {
            modal.style.display = 'none';
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// 当DOM加载完成后初始化交互功能
document.addEventListener('DOMContentLoaded', () => {
    initializeInteractions();
    initModal();
});

export { initializeInteractions };

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeInteractions,
        initSmoothScrolling,
        initFormSubmission,
        initFAQInteractions,
        initScrollOptimizations,
        validateForm,
        getFieldLabel,
        submitForm
    };
}