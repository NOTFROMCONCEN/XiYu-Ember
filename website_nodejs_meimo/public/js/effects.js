/**
 * 视觉效果模块
 * @author Huameitang
 * 这个模块负责处理网站的各种视觉效果
 * 包括扭曲效果、闪烁效果、卡片动画等
 * 采用模块化设计，便于维护和扩展
 * 遵循SOLID原则，每个函数都有单一职责
 */

/**
 * 初始化所有视觉效果
 * 这个函数是效果模块的入口点，负责启动所有视觉效果
 * 采用统一的初始化方式，便于管理和控制
 * 集成性能配置，根据设备性能自动调整效果
 * 新增动画追踪和智能管理机制
 * @author Huameitang
 */
export function initializeEffects() {
    // 清理之前的动画
    cleanupPreviousAnimations();

    // 获取性能配置
    const performanceConfig = window.PerformanceConfig ?
        window.PerformanceConfig.getPerformanceConfig() :
        { enableVHSFlicker: true, enableDistortion: true, enableTitleDistortion: true };

    // 应用性能优化
    if (window.PerformanceConfig) {
        window.PerformanceConfig.applyPerformanceOptimizations(performanceConfig);
    }

    // 初始化动画管理器
    initAnimationManager(performanceConfig);

    // 根据性能配置启动相应效果
    if (performanceConfig.enableDistortion) {
        const cleanupFn = initDistortionEffect(performanceConfig);
        registerAnimation('distortion', cleanupFn);
    }

    if (performanceConfig.enableVHSFlicker) {
        const cleanupFn = initVHSFlicker(performanceConfig);
        registerAnimation('vhsFlicker', cleanupFn);
    }

    if (performanceConfig.enableTitleDistortion) {
        const cleanupFn = initTitleDistortion(performanceConfig);
        registerAnimation('titleDistortion', cleanupFn);
    }

    // 卡片动画和梦境符号动画保持启用（性能影响较小）
    initCardAnimations();
    initDreamItemsAnimation();

    // 启动性能监控
    if (performanceConfig.enableSmartPause) {
        initPerformanceMonitoring();
    }
}

/**
 * 初始化随机扭曲效果
 * 为背景扭曲元素添加随机变换效果
 * 使用requestAnimationFrame优化性能，避免滚动卡顿
 * 添加节流机制，减少不必要的重绘
 * 根据性能配置调整更新频率
 * 新增智能暂停和GPU加速支持
 * @param {Object} config - 性能配置对象
 * @author Huameitang
 */
function initDistortionEffect(config = {}) {
    const distortion = document.querySelector('.distortion');
    if (!distortion) return;

    // GPU加速优化
    if (config.enableGPUAcceleration) {
        distortion.style.willChange = 'transform';
        distortion.style.transform = distortion.style.transform || 'translateZ(0)';
    }

    let lastUpdate = 0;
    const updateInterval = config.distortionInterval || 3000;
    let animationId;
    let isPaused = false;

    function updateDistortion(timestamp) {
        // 检查是否暂停
        if (isPaused || document.body.classList.contains('animations-paused')) {
            animationId = requestAnimationFrame(updateDistortion);
            return;
        }

        if (timestamp - lastUpdate >= updateInterval) {
            const intensity = Math.random() * 0.02; // 进一步减少强度
            const rotation = Math.random() * 0.8 - 0.4; // 减少旋转幅度

            // 使用transform3d提升性能
            distortion.style.transform = `scale3d(${1 + intensity}, ${1 + intensity}, 1) rotateZ(${rotation}deg) translateZ(0)`;
            lastUpdate = timestamp;
        }

        if (config.useRequestAnimationFrame !== false) {
            animationId = requestAnimationFrame(updateDistortion);
            // 追踪活动动画
            if (window.activeAnimations && !window.activeAnimations.includes(animationId)) {
                window.activeAnimations.push(animationId);
            }
        }
    }

    if (config.useRequestAnimationFrame !== false) {
        animationId = requestAnimationFrame(updateDistortion);
    } else {
        // 降级到定时器模式
        const intervalId = setInterval(() => {
            if (isPaused || document.body.classList.contains('animations-paused')) return;

            const intensity = Math.random() * 0.02;
            const rotation = Math.random() * 0.8 - 0.4;
            distortion.style.transform = `scale3d(${1 + intensity}, ${1 + intensity}, 1) rotateZ(${rotation}deg) translateZ(0)`;
        }, updateInterval);

        // 返回清理函数
        return () => {
            clearInterval(intervalId);
            isPaused = true;
        };
    }

    // 返回清理函数
    return () => {
        isPaused = true;
        if (animationId) {
            cancelAnimationFrame(animationId);
            // 从活动动画列表中移除
            if (window.activeAnimations) {
                const index = window.activeAnimations.indexOf(animationId);
                if (index > -1) {
                    window.activeAnimations.splice(index, 1);
                }
            }
        }
        // 清理GPU加速属性
        if (config.enableGPUAcceleration) {
            distortion.style.willChange = 'auto';
        }
    };
}

/**
 * 初始化VHS闪烁效果
 * 为VHS覆盖层添加轻微的透明度变化
 * 模拟老式录像带的闪烁效果
 * 使用requestAnimationFrame优化性能
 * 根据性能配置调整闪烁频率
 * 新增智能暂停和GPU加速支持
 * @param {Object} config - 性能配置对象
 * @author Huameitang
 */
function initVHSFlicker(config = {}) {
    const vhsOverlay = document.querySelector('.vhs-overlay');
    if (!vhsOverlay) return;

    // GPU加速优化
    if (config.enableGPUAcceleration) {
        vhsOverlay.style.willChange = 'opacity';
    }

    let lastFlicker = 0;
    const flickerInterval = config.flickerInterval || 500;
    let animationId;
    let isPaused = false;

    function updateFlicker(timestamp) {
        // 检查是否暂停
        if (isPaused || document.body.classList.contains('animations-paused')) {
            animationId = requestAnimationFrame(updateFlicker);
            return;
        }

        if (timestamp - lastFlicker >= flickerInterval) {
            const opacity = 0.6 + Math.random() * 0.15; // 进一步减少透明度变化幅度
            vhsOverlay.style.opacity = opacity;
            lastFlicker = timestamp;
        }

        if (config.useRequestAnimationFrame !== false) {
            animationId = requestAnimationFrame(updateFlicker);
            // 追踪活动动画
            if (window.activeAnimations && !window.activeAnimations.includes(animationId)) {
                window.activeAnimations.push(animationId);
            }
        }
    }

    if (config.useRequestAnimationFrame !== false) {
        animationId = requestAnimationFrame(updateFlicker);
    } else {
        // 降级到定时器模式
        const intervalId = setInterval(() => {
            if (isPaused || document.body.classList.contains('animations-paused')) return;

            const opacity = 0.6 + Math.random() * 0.15;
            vhsOverlay.style.opacity = opacity;
        }, flickerInterval);

        // 返回清理函数
        return () => {
            clearInterval(intervalId);
            isPaused = true;
        };
    }

    // 返回清理函数
    return () => {
        isPaused = true;
        if (animationId) {
            cancelAnimationFrame(animationId);
            // 从活动动画列表中移除
            if (window.activeAnimations) {
                const index = window.activeAnimations.indexOf(animationId);
                if (index > -1) {
                    window.activeAnimations.splice(index, 1);
                }
            }
        }
        // 清理GPU加速属性
        if (config.enableGPUAcceleration) {
            vhsOverlay.style.willChange = 'auto';
        }
    };
}

/**
 * 初始化卡片动画效果
 * 为每个梦境卡片添加随机初始旋转和悬停效果
 * 增强3D视觉体验和交互性
 * @author Huameitang
 */
function initCardAnimations() {
    const cards = document.querySelectorAll('.dream-card');

    cards.forEach(card => {
        const rotation = Math.random() * 4 - 2; // -2到2度的随机旋转
        card.style.transform = `perspective(1000px) rotateY(${rotation}deg)`;

        // 鼠标进入事件
        card.addEventListener('mouseenter', () => {
            card.style.transform = `perspective(1000px) rotateY(${rotation + 5}deg) translateY(-10px)`;
        });

        // 鼠标离开事件
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateY(${rotation}deg)`;
        });
    });
}

/**
 * 初始化梦境符号动画（简化版）
 * 为每个梦境符号添加简单的悬停效果
 * 移除复杂的3D变换以提升性能
 * @author Huameitang
 */
function initDreamItemsAnimation() {
    const dreamItems = document.querySelectorAll('.dream-item');

    dreamItems.forEach(item => {
        // 移除复杂的3D变换，仅保留简单的悬停效果
        // CSS已经处理了悬停效果，这里不需要额外的JavaScript

        // 可选：添加简单的点击反馈
        item.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * 初始化标题扭曲效果
 * 为主标题添加轻微的随机位移效果
 * 增强视觉动态感
 * 使用requestAnimationFrame优化性能
 * 根据性能配置调整更新频率
 * @param {Object} config - 性能配置对象
 * @author Huameitang
 */
function initTitleDistortion(config = {}) {
    const title = document.querySelector('.dream-title');
    if (!title) return;

    let lastTitleUpdate = 0;
    const titleUpdateInterval = config.titleDistortionInterval || 3000;
    let animationId;

    function updateTitleDistortion(timestamp) {
        if (timestamp - lastTitleUpdate >= titleUpdateInterval) {
            const x = Math.random() * 2 - 1; // 减少位移幅度
            const y = Math.random() * 2 - 1;
            title.style.transform = `translate(${x}px, ${y}px)`;
            lastTitleUpdate = timestamp;
        }

        if (config.useRequestAnimationFrame !== false) {
            animationId = requestAnimationFrame(updateTitleDistortion);
        }
    }

    if (config.useRequestAnimationFrame !== false) {
        animationId = requestAnimationFrame(updateTitleDistortion);
    } else {
        // 降级到定时器模式
        setInterval(() => {
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            title.style.transform = `translate(${x}px, ${y}px)`;
        }, titleUpdateInterval);
    }

    // 返回清理函数
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

/**
 * 动画管理器
 * 用于追踪和管理所有活动的动画
 * 提供统一的清理和暂停机制
 * @author Huameitang
 */
let animationRegistry = new Map();
let performanceMonitor = null;

/**
 * 初始化动画管理器
 * 设置动画追踪和管理机制
 * @param {Object} config - 性能配置对象
 * @author Huameitang
 */
function initAnimationManager(config) {
    // 清理之前的注册表
    animationRegistry.clear();

    // 设置最大并发动画数限制
    window.maxConcurrentAnimations = config.maxConcurrentAnimations || 10;

    console.log(`动画管理器初始化完成，最大并发动画数: ${window.maxConcurrentAnimations}`);
}

/**
 * 注册动画
 * 将动画添加到管理器中进行追踪
 * @param {string} name - 动画名称
 * @param {Function} cleanupFn - 清理函数
 * @author Huameitang
 */
function registerAnimation(name, cleanupFn) {
    if (animationRegistry.size >= window.maxConcurrentAnimations) {
        console.warn(`达到最大并发动画数限制 (${window.maxConcurrentAnimations})，跳过动画: ${name}`);
        return;
    }

    animationRegistry.set(name, cleanupFn);
    console.log(`动画已注册: ${name}`);
}

/**
 * 清理之前的动画
 * 停止所有正在运行的动画并清理资源
 * @author Huameitang
 */
function cleanupPreviousAnimations() {
    // 清理注册的动画
    animationRegistry.forEach((cleanupFn, name) => {
        if (typeof cleanupFn === 'function') {
            cleanupFn();
            console.log(`动画已清理: ${name}`);
        }
    });
    animationRegistry.clear();

    // 清理活动动画ID
    if (window.activeAnimations) {
        window.activeAnimations.forEach(id => {
            cancelAnimationFrame(id);
        });
        window.activeAnimations = [];
    }

    // 停止性能监控
    if (performanceMonitor) {
        clearInterval(performanceMonitor);
        performanceMonitor = null;
    }
}

/**
 * 初始化性能监控
 * 监控页面性能指标，动态调整动画效果
 * @author Huameitang
 */
function initPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;

            // 根据FPS动态调整性能
            if (fps < 30) {
                // 低FPS，暂停部分动画
                document.body.classList.add('low-fps');
                console.warn(`检测到低FPS (${fps})，启用性能保护模式`);
            } else if (fps > 50) {
                // 高FPS，恢复正常
                document.body.classList.remove('low-fps');
            }
        }

        requestAnimationFrame(measureFPS);
    }

    // 启动FPS监控
    requestAnimationFrame(measureFPS);

    // 内存使用监控
    if (performance.memory) {
        performanceMonitor = setInterval(() => {
            const memoryInfo = performance.memory;
            const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576);
            const limitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1048576);
            const usagePercent = (usedMB / limitMB) * 100;

            if (usagePercent > 80) {
                console.warn(`内存使用率过高: ${usagePercent.toFixed(1)}% (${usedMB}MB/${limitMB}MB)`);
                // 触发内存清理
                if (window.PerformanceConfig && window.PerformanceConfig.initMemoryCleanup) {
                    window.gc && window.gc();
                }
            }
        }, 10000); // 每10秒检查一次
    }
}

window.initializeEffects = initializeEffects;

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeEffects,
        initDistortionEffect,
        initVHSFlicker,
        initCardAnimations,
        initDreamItemsAnimation,
        initTitleDistortion,
        initAnimationManager,
        registerAnimation,
        cleanupPreviousAnimations,
        initPerformanceMonitoring
    };
}