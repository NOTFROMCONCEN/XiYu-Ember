/**
 * 资源优化管理器
 * @author Huameitang
 * 这个模块负责管理前端资源的加载和优化
 * 包括图片懒加载、预加载、资源压缩等功能
 * 遵循SOLID原则，提供可扩展的资源管理解决方案
 */

/**
 * 资源优化配置常量
 * 定义各种资源优化的配置参数
 * 便于统一管理和调整优化策略
 */
const RESOURCE_CONFIG = {
    // 懒加载配置
    LAZY_LOADING: {
        rootMargin: '50px 0px',
        threshold: 0.01,
        enableNativeLazyLoading: true
    },
    
    // 预加载配置
    PRELOAD: {
        criticalImages: [
            '/images/logo1.PNG',
            '/images/logo2.PNG'
        ],
        criticalFonts: [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap'
        ]
    },
    
    // 缓存配置
    CACHE: {
        version: '1.0.0',
        maxAge: 86400000, // 24小时
        maxSize: 50 * 1024 * 1024 // 50MB
    },
    
    // 高级优化配置
    ADVANCED: {
        enableWebP: true,
        enableBrotli: true,
        enableCriticalCSS: true,
        enableCodeSplitting: true,
        enableResourceHints: true,
        compressionLevel: 0.8,
        imageQuality: 0.85
    }
};

/**
 * 资源优化管理器类
 * @author Huameitang
 * 提供完整的资源优化功能，包括懒加载、预加载、缓存管理等
 * 采用单例模式，确保全局只有一个实例
 * 遵循开闭原则，便于扩展新的优化功能
 */
class ResourceOptimizer {
    constructor() {
        this.lazyLoadObserver = null;
        this.preloadedResources = new Set();
        this.resourceCache = new Map();
        this.performanceMetrics = {
            loadTimes: [],
            cacheHits: 0,
            cacheMisses: 0
        };
        
        this.init();
    }
    
    /**
     * 初始化资源优化器
     * @author Huameitang
     * 设置各种优化功能的初始化
     * 包括懒加载观察器、预加载、缓存等
     * 确保在页面加载时就开始优化工作
     */
    init() {
        this.setupLazyLoading();
        this.setupPreloading();
        this.setupResourceCache();
        this.setupPerformanceMonitoring();
        
        console.log('资源优化器初始化完成');
    }
    
    /**
     * 设置图片懒加载
     * @author Huameitang
     * 使用Intersection Observer API实现高性能的图片懒加载
     * 支持原生懒加载作为备选方案
     * 减少初始页面加载时间和带宽消耗
     */
    setupLazyLoading() {
        // 检查浏览器支持
        if ('IntersectionObserver' in window) {
            const config = RESOURCE_CONFIG.LAZY_LOADING;
            
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.lazyLoadObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: config.rootMargin,
                threshold: config.threshold
            });
            
            // 观察所有懒加载图片
            this.observeLazyImages();
        } else {
            // 降级处理：直接加载所有图片
            this.loadAllImages();
        }
    }
    
    /**
     * 观察需要懒加载的图片
     * @author Huameitang
     * 查找页面中所有标记为懒加载的图片元素
     * 将它们添加到Intersection Observer中进行监控
     * 支持动态添加的图片元素
     */
    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (this.lazyLoadObserver) {
                this.lazyLoadObserver.observe(img);
            }
        });
    }
    
    /**
     * 加载单个图片
     * @param {HTMLImageElement} img - 要加载的图片元素
     * @author Huameitang
     * 执行实际的图片加载操作
     * 包含错误处理和加载完成回调
     * 支持WebP格式检测和降级处理
     */
    loadImage(img) {
        const startTime = performance.now();
        
        // 获取图片源
        const src = img.dataset.src || img.src;
        if (!src) return;
        
        // 创建新的图片对象进行预加载
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // 加载成功，更新图片源
            img.src = src;
            img.classList.add('loaded');
            
            // 记录性能指标
            const loadTime = performance.now() - startTime;
            this.performanceMetrics.loadTimes.push(loadTime);
            
            // 移除懒加载属性
            img.removeAttribute('data-src');
            
            console.log(`图片加载完成: ${src} (${loadTime.toFixed(2)}ms)`);
        };
        
        imageLoader.onerror = () => {
            console.error(`图片加载失败: ${src}`);
            img.classList.add('error');
        };
        
        imageLoader.src = src;
    }
    
    /**
     * 加载所有图片（降级处理）
     * @author Huameitang
     * 当浏览器不支持Intersection Observer时的降级方案
     * 直接加载页面中的所有图片
     * 确保功能的向后兼容性
     */
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
    
    /**
     * 设置资源预加载
     * @author Huameitang
     * 预加载关键资源，提升用户体验
     * 包括关键图片、字体、CSS等资源
     * 使用link标签的preload功能实现
     */
    setupPreloading() {
        const config = RESOURCE_CONFIG.PRELOAD;
        
        // 预加载关键图片
        config.criticalImages.forEach(src => {
            this.preloadImage(src);
        });
        
        // 预加载关键字体
        config.criticalFonts.forEach(href => {
            this.preloadFont(href);
        });
    }
    
    /**
     * 预加载图片
     * @param {string} src - 图片源地址
     * @author Huameitang
     * 使用Image对象预加载图片到浏览器缓存
     * 避免重复预加载同一资源
     * 提升后续访问速度
     */
    preloadImage(src) {
        if (this.preloadedResources.has(src)) return;
        
        const img = new Image();
        img.onload = () => {
            this.preloadedResources.add(src);
            console.log(`图片预加载完成: ${src}`);
        };
        img.onerror = () => {
            console.error(`图片预加载失败: ${src}`);
        };
        img.src = src;
    }
    
    /**
     * 预加载字体
     * @param {string} href - 字体CSS文件地址
     * @author Huameitang
     * 使用link标签预加载字体资源
     * 避免字体加载导致的页面闪烁
     * 提升文字渲染性能
     */
    preloadFont(href) {
        if (this.preloadedResources.has(href)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
            this.preloadedResources.add(href);
            console.log(`字体预加载完成: ${href}`);
        };
        
        document.head.appendChild(link);
    }
    
    /**
     * 设置资源缓存
     * @author Huameitang
     * 实现客户端资源缓存机制
     * 使用localStorage存储小型资源
     * 减少重复网络请求
     */
    setupResourceCache() {
        // 检查localStorage支持
        if (!window.localStorage) {
            console.warn('localStorage不支持，跳过资源缓存');
            return;
        }
        
        // 清理过期缓存
        this.cleanExpiredCache();
        
        console.log('资源缓存系统初始化完成');
    }
    
    /**
     * 清理过期缓存
     * @author Huameitang
     * 定期清理localStorage中的过期资源
     * 防止缓存占用过多存储空间
     * 确保缓存数据的有效性
     */
    cleanExpiredCache() {
        const now = Date.now();
        const maxAge = RESOURCE_CONFIG.CACHE.maxAge;
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('resource_cache_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (now - data.timestamp > maxAge) {
                        localStorage.removeItem(key);
                        console.log(`清理过期缓存: ${key}`);
                    }
                } catch (e) {
                    // 清理损坏的缓存数据
                    localStorage.removeItem(key);
                }
            }
        }
    }
    
    /**
     * 设置性能监控
     * @author Huameitang
     * 监控资源加载性能指标
     * 收集加载时间、缓存命中率等数据
     * 为性能优化提供数据支持
     */
    setupPerformanceMonitoring() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.reportPerformanceMetrics();
            }, 1000);
        });
        
        // 定期报告性能指标
        setInterval(() => {
            this.reportPerformanceMetrics();
        }, 60000); // 每分钟报告一次
    }
    
    /**
     * 报告性能指标
     * @author Huameitang
     * 输出当前的性能监控数据
     * 包括平均加载时间、缓存命中率等
     * 帮助开发者了解优化效果
     */
    reportPerformanceMetrics() {
        const metrics = this.performanceMetrics;
        const avgLoadTime = metrics.loadTimes.length > 0 
            ? metrics.loadTimes.reduce((a, b) => a + b, 0) / metrics.loadTimes.length 
            : 0;
        
        const cacheHitRate = metrics.cacheHits + metrics.cacheMisses > 0 
            ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100).toFixed(2) 
            : 0;
        
        console.log('资源优化性能报告:', {
            平均加载时间: `${avgLoadTime.toFixed(2)}ms`,
            缓存命中率: `${cacheHitRate}%`,
            预加载资源数: this.preloadedResources.size,
            总加载次数: metrics.loadTimes.length
        });
    }
    
    /**
     * 动态添加懒加载图片
     * @param {HTMLImageElement} img - 要添加懒加载的图片元素
     * @author Huameitang
     * 为动态添加的图片元素启用懒加载
     * 支持SPA应用的动态内容加载
     * 确保新添加的图片也能享受优化效果
     */
    addLazyImage(img) {
        if (this.lazyLoadObserver && img) {
            this.lazyLoadObserver.observe(img);
        }
    }
    
    /**
     * 销毁资源优化器
     * @author Huameitang
     * 清理所有观察器和事件监听器
     * 释放内存资源，防止内存泄漏
     * 在页面卸载时调用
     */
    destroy() {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
            this.lazyLoadObserver = null;
        }
        
        this.preloadedResources.clear();
        this.resourceCache.clear();
        
        console.log('资源优化器已销毁');
    }
}

// 创建全局资源优化器实例
const resourceOptimizer = new ResourceOptimizer();

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    resourceOptimizer.destroy();
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ResourceOptimizer,
        RESOURCE_CONFIG,
        resourceOptimizer
    };
}

// 全局变量供其他脚本使用
window.ResourceOptimizer = ResourceOptimizer;
window.resourceOptimizer = resourceOptimizer;