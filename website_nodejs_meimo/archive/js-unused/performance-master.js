/**
 * 性能优化主控制器
 * @author Huameitang
 * 统一管理所有性能优化策略
 */

class PerformanceMaster {
    constructor() {
        this.metrics = {
            pageLoad: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            memoryUsage: 0,
            networkRequests: 0
        };
        
        this.optimizations = {
            imageOptimization: true,
            lazyLoading: true,
            resourcePreloading: true,
            codesplitting: true,
            caching: true,
            compression: true
        };
        
        this.observers = new Map();
        this.performanceEntries = [];
        this.init();
    }

    init() {
        this.measureCoreWebVitals();
        this.setupPerformanceObservers();
        this.optimizeImages();
        this.setupLazyLoading();
        this.enableResourceHints();
        this.monitorMemoryUsage();
        this.setupNetworkOptimization();
    }

    /**
     * 测量核心Web指标
     */
    measureCoreWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                    console.log(`FCP: ${entry.startTime.toFixed(2)}ms`);
                }
            }
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.startTime;
            console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cumulativeLayoutShift = clsValue;
            console.log(`CLS: ${clsValue.toFixed(4)}`);
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                console.log(`FID: ${this.metrics.firstInputDelay.toFixed(2)}ms`);
            }
        }).observe({ entryTypes: ['first-input'] });
    }

    /**
     * 设置性能观察器
     */
    setupPerformanceObservers() {
        // 资源加载监控
        const resourceObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.performanceEntries.push({
                    name: entry.name,
                    type: entry.initiatorType,
                    duration: entry.duration,
                    size: entry.transferSize || 0,
                    timestamp: Date.now()
                });
                this.metrics.networkRequests++;
            }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);

        // 导航监控
        const navigationObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.metrics.pageLoad = entry.loadEventEnd - entry.fetchStart;
                console.log(`页面加载时间: ${this.metrics.pageLoad.toFixed(2)}ms`);
            }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navigationObserver);
    }

    /**
     * 图片优化
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 添加loading="lazy"属性
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // 添加decode="async"属性
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // 图片加载错误处理
            img.addEventListener('error', () => {
                console.warn(`图片加载失败: ${img.src}`);
                img.style.display = 'none';
            });
        });
    }

    /**
     * 设置懒加载
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            lazyImageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    }

    /**
     * 启用资源提示
     */
    enableResourceHints() {
        // DNS预解析
        const domains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdnjs.cloudflare.com',
            'lsky.xn--p8z.icu'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // 预连接关键资源
        const preconnectDomains = ['fonts.googleapis.com', 'lsky.xn--p8z.icu'];
        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `https://${domain}`;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * 监控内存使用
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const updateMemoryMetrics = () => {
                const memory = performance.memory;
                this.metrics.memoryUsage = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2)
                };
                
                // 内存使用率过高时的优化
                if (this.metrics.memoryUsage.percentage > 80) {
                    this.performMemoryCleanup();
                }
            };

            // 定期检查内存使用
            setInterval(updateMemoryMetrics, 10000);
            updateMemoryMetrics();
        }
    }

    /**
     * 内存清理
     */
    performMemoryCleanup() {
        console.warn('内存使用率过高，执行清理操作');
        
        // 清理性能条目
        if (this.performanceEntries.length > 1000) {
            this.performanceEntries = this.performanceEntries.slice(-500);
        }
        
        // 清理未使用的图片缓存
        if (window.lightboxInstance && window.lightboxInstance.preloadedImages) {
            const cache = window.lightboxInstance.preloadedImages;
            if (cache.size > 10) {
                const entries = Array.from(cache.entries());
                entries.slice(0, cache.size - 5).forEach(([key]) => {
                    cache.delete(key);
                });
            }
        }
        
        // 强制垃圾回收（如果可用）
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * 网络优化
     */
    setupNetworkOptimization() {
        // 检测网络状态
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const networkInfo = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            
            console.log('网络状态:', networkInfo);
            
            // 根据网络状态调整优化策略
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.enableDataSaverMode();
            }
            
            // 监听网络状态变化
            connection.addEventListener('change', () => {
                console.log('网络状态变化:', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink
                });
                
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.enableDataSaverMode();
                } else {
                    this.disableDataSaverMode();
                }
            });
        }
    }

    /**
     * 启用数据节省模式
     */
    enableDataSaverMode() {
        console.log('启用数据节省模式');
        
        // 禁用非关键动画
        document.body.classList.add('reduce-motion');
        
        // 降低图片质量
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && !img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
                // 这里可以替换为低质量版本的图片
            }
        });
        
        // 禁用自动播放
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            video.removeAttribute('autoplay');
        });
    }

    /**
     * 禁用数据节省模式
     */
    disableDataSaverMode() {
        console.log('禁用数据节省模式');
        
        document.body.classList.remove('reduce-motion');
        
        // 恢复原始图片
        const images = document.querySelectorAll('img[data-original-src]');
        images.forEach(img => {
            img.src = img.dataset.originalSrc;
            delete img.dataset.originalSrc;
        });
    }

    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            optimizations: this.optimizations,
            resourceCount: this.performanceEntries.length,
            memoryUsage: this.metrics.memoryUsage,
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * 生成优化建议
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.firstContentfulPaint > 2000) {
            recommendations.push('FCP过慢，建议优化关键渲染路径');
        }
        
        if (this.metrics.largestContentfulPaint > 2500) {
            recommendations.push('LCP过慢，建议优化最大内容绘制');
        }
        
        if (this.metrics.cumulativeLayoutShift > 0.1) {
            recommendations.push('CLS过高，建议减少布局偏移');
        }
        
        if (this.metrics.firstInputDelay > 100) {
            recommendations.push('FID过高，建议优化JavaScript执行');
        }
        
        if (this.metrics.memoryUsage && this.metrics.memoryUsage.percentage > 70) {
            recommendations.push('内存使用率较高，建议进行内存优化');
        }
        
        return recommendations;
    }

    /**
     * 销毁性能监控
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.performanceEntries = [];
    }
}

// 创建全局实例
const performanceMaster = new PerformanceMaster();

// 导出到全局
window.performanceMaster = performanceMaster;
window.getPerformanceReport = () => performanceMaster.getPerformanceReport();

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    performanceMaster.destroy();
});

console.log('性能优化主控制器已启动');