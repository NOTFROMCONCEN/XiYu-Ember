/**
 * 性能优化配置模块
 * @author Huameitang
 * 这个模块提供性能优化配置选项
 * 允许根据设备性能动态调整视觉效果
 * 遵循YAGNI原则，只提供必要的配置选项
 */

/**
 * 性能配置常量
 * 定义不同性能级别的配置参数
 * 便于根据设备性能进行动态调整
 * 新增GPU加速、内存管理和智能暂停机制
 */
const PERFORMANCE_CONFIG = {
    // 高性能模式 - 适用于高端设备
    HIGH: {
        enableVHSFlicker: true,
        enableDistortion: true,
        enableTitleDistortion: true,
        flickerInterval: 500,
        distortionInterval: 3000,
        titleDistortionInterval: 3000,
        useRequestAnimationFrame: true,
        enableGPUAcceleration: true,
        maxConcurrentAnimations: 10,
        enableSmartPause: true,
        memoryCleanupInterval: 30000,
        enablePreload: true
    },
    
    // 中等性能模式 - 适用于中端设备
    MEDIUM: {
        enableVHSFlicker: true,
        enableDistortion: false,
        enableTitleDistortion: true,
        flickerInterval: 1000,
        distortionInterval: 5000,
        titleDistortionInterval: 5000,
        useRequestAnimationFrame: true,
        enableGPUAcceleration: true,
        maxConcurrentAnimations: 6,
        enableSmartPause: true,
        memoryCleanupInterval: 45000,
        enablePreload: false
    },
    
    // 低性能模式 - 适用于低端设备或移动设备
    LOW: {
        enableVHSFlicker: false,
        enableDistortion: false,
        enableTitleDistortion: false,
        flickerInterval: 2000,
        distortionInterval: 10000,
        titleDistortionInterval: 10000,
        useRequestAnimationFrame: false,
        enableGPUAcceleration: false,
        maxConcurrentAnimations: 2,
        enableSmartPause: true,
        memoryCleanupInterval: 60000,
        enablePreload: false
    }
};

/**
 * 检测设备性能级别
 * 基于设备特征自动判断合适的性能级别
 * 考虑CPU核心数、内存、设备类型等因素
 * @returns {string} 性能级别 ('HIGH', 'MEDIUM', 'LOW')
 * @author Huameitang
 */
function detectPerformanceLevel() {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 检测CPU核心数
    const cpuCores = navigator.hardwareConcurrency || 2;
    
    // 检测内存大小（如果可用）
    const deviceMemory = navigator.deviceMemory || 4;
    
    // 检测连接类型（如果可用）
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    // 根据设备特征判断性能级别
    if (isMobile || cpuCores < 4 || deviceMemory < 4 || isSlowConnection) {
        return 'LOW';
    } else if (cpuCores >= 8 && deviceMemory >= 8) {
        return 'HIGH';
    } else {
        return 'MEDIUM';
    }
}

/**
 * 获取当前性能配置
 * 根据检测到的性能级别返回相应的配置
 * 支持手动覆盖性能级别
 * @param {string} forceLevel - 强制指定的性能级别（可选）
 * @returns {Object} 性能配置对象
 * @author Huameitang
 */
function getPerformanceConfig(forceLevel = null) {
    const level = forceLevel || detectPerformanceLevel();
    const config = PERFORMANCE_CONFIG[level] || PERFORMANCE_CONFIG.MEDIUM;
    
    console.log(`性能级别: ${level}`, config);
    return config;
}

/**
 * 应用性能优化
 * 根据性能配置调整页面元素和效果
 * 动态禁用或启用某些视觉效果
 * 新增GPU加速、内存管理和智能暂停机制
 * @param {Object} config - 性能配置对象
 * @author Huameitang
 */
function applyPerformanceOptimizations(config) {
    // 根据配置调整VHS覆盖层
    const vhsOverlay = document.querySelector('.vhs-overlay');
    if (vhsOverlay && !config.enableVHSFlicker) {
        vhsOverlay.style.display = 'none';
    }
    
    // 根据配置调整扭曲效果
    const distortion = document.querySelector('.distortion');
    if (distortion && !config.enableDistortion) {
        distortion.style.display = 'none';
    }
    
    // 根据配置调整噪点效果
    const noise = document.querySelector('.noise');
    if (noise && config === PERFORMANCE_CONFIG.LOW) {
        noise.style.display = 'none';
    }
    
    // 为低性能设备添加CSS类
    if (config === PERFORMANCE_CONFIG.LOW) {
        document.body.classList.add('low-performance');
    }
    
    // 应用GPU加速优化
    if (config.enableGPUAcceleration) {
        applyGPUAcceleration();
    }
    
    // 启动智能暂停机制
    if (config.enableSmartPause) {
        initSmartPause();
    }
    
    // 启动内存清理机制
    if (config.memoryCleanupInterval) {
        initMemoryCleanup(config.memoryCleanupInterval);
    }
    
    // 预加载优化
    if (config.enablePreload) {
        initPreloadOptimizations();
    }
}

/**
 * 节流函数
 * 限制函数的执行频率，提升性能
 * 特别适用于滚动和resize事件
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 节流时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 * @author Huameitang
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 防抖函数
 * 延迟函数执行，避免频繁触发
 * 适用于输入框搜索等场景
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 * @author Huameitang
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * 应用GPU加速优化
 * 为关键动画元素添加GPU加速属性
 * 提升动画性能和流畅度
 * @author Huameitang
 */
function applyGPUAcceleration() {
    const acceleratedElements = [
        '.vhs-overlay',
        '.distortion',
        '.noise',
        '.dream-card',
        '.dream-symbol',
        '.hero-title'
    ];
    
    acceleratedElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            element.style.transform = element.style.transform || 'translateZ(0)';
        });
    });
}

/**
 * 初始化智能暂停机制
 * 当页面不可见时暂停动画，节省资源
 * 当页面重新可见时恢复动画
 * @author Huameitang
 */
function initSmartPause() {
    let animationsPaused = false;
    
    function pauseAnimations() {
        if (!animationsPaused) {
            document.body.classList.add('animations-paused');
            animationsPaused = true;
            
            // 暂停所有requestAnimationFrame动画
            if (window.activeAnimations) {
                window.activeAnimations.forEach(id => cancelAnimationFrame(id));
                window.pausedAnimations = [...window.activeAnimations];
                window.activeAnimations = [];
            }
        }
    }
    
    function resumeAnimations() {
        if (animationsPaused) {
            document.body.classList.remove('animations-paused');
            animationsPaused = false;
            
            // 恢复动画（需要重新初始化）
            if (window.initializeEffects) {
                setTimeout(() => window.initializeEffects(), 100);
            }
        }
    }
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAnimations();
        } else {
            resumeAnimations();
        }
    });
    
    // 监听窗口焦点变化
    window.addEventListener('blur', pauseAnimations);
    window.addEventListener('focus', resumeAnimations);
}

/**
 * 初始化内存清理机制
 * 定期清理不必要的DOM引用和事件监听器
 * 防止内存泄漏
 * @param {number} interval - 清理间隔（毫秒）
 * @author Huameitang
 */
function initMemoryCleanup(interval) {
    setInterval(() => {
        // 清理已移除的DOM元素引用
        if (window.elementCache) {
            for (let key in window.elementCache) {
                if (!document.contains(window.elementCache[key])) {
                    delete window.elementCache[key];
                }
            }
        }
        
        // 强制垃圾回收（如果支持）
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        console.log('内存清理完成');
    }, interval);
}

/**
 * 初始化预加载优化
 * 预加载关键资源，提升用户体验
 * @author Huameitang
 */
function initPreloadOptimizations() {
    // 预加载关键图片
    const criticalImages = [
        '/images/logo1.PNG',
        '/images/logo2.PNG'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // 预连接到外部资源
    const preconnectLinks = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    
    preconnectLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
    });
}

// 初始化活动动画追踪
window.activeAnimations = window.activeAnimations || [];

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PERFORMANCE_CONFIG,
        detectPerformanceLevel,
        getPerformanceConfig,
        applyPerformanceOptimizations,
        applyGPUAcceleration,
        initSmartPause,
        initMemoryCleanup,
        initPreloadOptimizations,
        throttle,
        debounce
    };
}

// 全局变量供其他脚本使用
window.PerformanceConfig = {
    PERFORMANCE_CONFIG,
    detectPerformanceLevel,
    getPerformanceConfig,
    applyPerformanceOptimizations,
    applyGPUAcceleration,
    initSmartPause,
    initMemoryCleanup,
    initPreloadOptimizations,
    throttle,
    debounce
};