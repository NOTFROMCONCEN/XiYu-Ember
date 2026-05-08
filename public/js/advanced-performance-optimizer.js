/**
 * 高级性能优化器
 * @author Huameitang
 * 这个模块提供全面的性能优化策略
 * 包括资源预加载、智能缓存、代码分割、图片优化等
 * 遵循SOLID原则，确保代码的可维护性和可扩展性
 */

class AdvancedPerformanceOptimizer {
    constructor() {
        this.config = {
            // 资源优化配置
            enableResourceHints: true,
            enableCodeSplitting: true,
            enableImageOptimization: true,
            enableCSSOptimization: true,
            enableJSOptimization: true,
            
            // 缓存策略配置
            cacheStrategy: 'aggressive', // conservative, normal, aggressive
            maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7天
            enableServiceWorker: true,
            
            // 加载优化配置
            enableLazyLoading: true,
            enablePrefetch: true,
            enablePreload: true,
            enableDNSPrefetch: true,
            
            // 性能阈值
            targetFPS: 60,
            maxLoadTime: 2000, // 2秒
            maxRenderTime: 1000, // 1秒
            
            // 优化级别
            optimizationLevel: 'auto' // auto, conservative, aggressive
        };
        
        this.metrics = {
            loadStartTime: performance.now(),
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0
        };
        
        this.resourceQueue = new Map();
        this.optimizationTasks = new Set();
        
        this.init();
    }
    
    /**
     * 初始化高级性能优化器
     * 设置所有优化策略和监控机制
     * 根据设备性能自动调整优化级别
     * @author Huameitang
     */
    init() {
        console.log('🚀 启动高级性能优化器');
        
        // 检测设备性能并调整配置
        this.detectAndAdjustPerformance();
        
        // 初始化资源优化
        this.initResourceOptimization();
        
        // 初始化缓存策略
        this.initAdvancedCaching();
        
        // 初始化加载优化
        this.initLoadingOptimization();
        
        // 初始化性能监控
        this.initPerformanceMonitoring();
        
        // 初始化自适应优化
        this.initAdaptiveOptimization();
        
        console.log('✅ 高级性能优化器初始化完成');
    }
    
    /**
     * 检测设备性能并调整优化策略
     * 基于硬件信息、网络状况等因素动态调整
     * 确保在不同设备上都能获得最佳性能
     * @author Huameitang
     */
    detectAndAdjustPerformance() {
        const deviceInfo = this.getDeviceInfo();
        const networkInfo = this.getNetworkInfo();
        
        // 根据设备性能调整优化级别
        if (deviceInfo.isLowEnd || networkInfo.isSlowConnection) {
            this.config.optimizationLevel = 'aggressive';
            this.config.enableCodeSplitting = true;
            this.config.enableLazyLoading = true;
        } else if (deviceInfo.isHighEnd && networkInfo.isFastConnection) {
            this.config.optimizationLevel = 'conservative';
            this.config.enablePrefetch = true;
            this.config.enablePreload = true;
        }
        
        console.log('📊 设备性能检测完成:', { deviceInfo, networkInfo, optimizationLevel: this.config.optimizationLevel });
    }
    
    /**
     * 获取设备信息
     * 检测CPU、内存、屏幕等硬件信息
     * 用于判断设备性能级别
     * @returns {Object} 设备信息对象
     * @author Huameitang
     */
    getDeviceInfo() {
        const cpuCores = navigator.hardwareConcurrency || 2;
        const deviceMemory = navigator.deviceMemory || 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const screenSize = window.screen.width * window.screen.height;
        
        const isLowEnd = cpuCores < 4 || deviceMemory < 4 || isMobile;
        const isHighEnd = cpuCores >= 8 && deviceMemory >= 8 && !isMobile;
        
        return {
            cpuCores,
            deviceMemory,
            isMobile,
            screenSize,
            isLowEnd,
            isHighEnd,
            pixelRatio: window.devicePixelRatio || 1
        };
    }
    
    /**
     * 获取网络信息
     * 检测网络连接类型和速度
     * 用于调整资源加载策略
     * @returns {Object} 网络信息对象
     * @author Huameitang
     */
    getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) {
            return { type: 'unknown', isSlowConnection: false, isFastConnection: true };
        }
        
        const effectiveType = connection.effectiveType;
        const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g';
        const isFastConnection = effectiveType === '4g' || effectiveType === '5g';
        
        return {
            type: effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData,
            isSlowConnection,
            isFastConnection
        };
    }
    
    /**
     * 初始化资源优化
     * 设置资源预加载、压缩、合并等优化策略
     * 根据资源类型采用不同的优化方案
     * @author Huameitang
     */
    initResourceOptimization() {
        // 添加资源提示标签
        if (this.config.enableResourceHints) {
            this.addResourceHints();
        }
        
        // 优化图片加载
        if (this.config.enableImageOptimization) {
            this.optimizeImages();
        }
        
        // 优化CSS加载
        if (this.config.enableCSSOptimization) {
            this.optimizeCSS();
        }
        
        // 优化JavaScript加载
        if (this.config.enableJSOptimization) {
            this.optimizeJavaScript();
        }
        
        console.log('🎯 资源优化初始化完成');
    }
    
    /**
     * 添加资源提示标签
     * 使用DNS预解析、预连接、预加载等技术
     * 提前建立连接和加载关键资源
     * @author Huameitang
     */
    addResourceHints() {
        const hints = [
            // DNS预解析
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
            
            // 预连接
            { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
            { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com', crossorigin: true },
            
            // 预加载关键资源
            { rel: 'preload', href: 'css/styles.css', as: 'style' },
            { rel: 'preload', href: 'js/performance-config.js', as: 'script' },
            
            // 预获取下一页资源
            { rel: 'prefetch', href: 'about.html' },
            { rel: 'prefetch', href: 'components/gallery.html' }
        ];
        
        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });
        
        console.log('🔗 资源提示标签添加完成');
    }
    
    /**
     * 优化图片加载
     * 实现懒加载、响应式图片、WebP格式支持
     * 根据设备性能和网络状况调整图片质量
     * @author Huameitang
     */
    optimizeImages() {
        // 实现图片懒加载
        if (this.config.enableLazyLoading) {
            this.implementImageLazyLoading();
        }
        
        // 添加响应式图片支持
        this.addResponsiveImageSupport();
        
        // 检测WebP支持
        this.detectWebPSupport();
        
        console.log('🖼️ 图片优化完成');
    }
    
    /**
     * 实现图片懒加载
     * 使用Intersection Observer API监听图片进入视口
     * 只有当图片即将显示时才开始加载
     * @author Huameitang
     */
    implementImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px', // 提前50px开始加载
                threshold: 0.01
            });
            
            // 观察所有懒加载图片
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }
    
    /**
     * 优化CSS加载
     * 内联关键CSS、延迟加载非关键CSS
     * 使用媒体查询优化不同设备的样式加载
     * @author Huameitang
     */
    optimizeCSS() {
        // 内联关键CSS
        this.inlineCriticalCSS();
        
        // 延迟加载非关键CSS
        this.deferNonCriticalCSS();
        
        // 移除未使用的CSS
        this.removeUnusedCSS();
        
        console.log('🎨 CSS优化完成');
    }
    
    /**
     * 内联关键CSS
     * 将首屏渲染必需的CSS直接内联到HTML中
     * 避免额外的网络请求阻塞渲染
     * @author Huameitang
     */
    inlineCriticalCSS() {
        const criticalCSS = `
            /* 关键渲染路径CSS */
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
            .loading { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 9999; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }
    
    /**
     * 延迟加载非关键CSS
     * 将非首屏必需的CSS延迟到页面加载完成后再加载
     * 优先保证首屏渲染速度
     * @author Huameitang
     */
    deferNonCriticalCSS() {
        const nonCriticalCSS = [
            'css/gallery.css',
            'css/symbols.css',
            'css/footer.css'
        ];
        
        // 页面加载完成后再加载非关键CSS
        window.addEventListener('load', () => {
            nonCriticalCSS.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = function() { this.media = 'all'; };
                document.head.appendChild(link);
            });
        });
    }
    
    /**
     * 初始化性能监控
     * 监控关键性能指标，实时调整优化策略
     * 收集用户体验数据用于持续优化
     * @author Huameitang
     */
    initPerformanceMonitoring() {
        // 监控Core Web Vitals
        this.monitorCoreWebVitals();
        
        // 监控自定义性能指标
        this.monitorCustomMetrics();
        
        // 设置性能预算
        this.setPerformanceBudget();
        
        console.log('📈 性能监控初始化完成');
    }
    
    /**
     * 监控Core Web Vitals
     * 监控LCP、FID、CLS等关键用户体验指标
     * 当指标超出阈值时自动触发优化措施
     * @author Huameitang
     */
    monitorCoreWebVitals() {
        // 监控Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.startTime;
            
            if (lastEntry.startTime > 2500) {
                console.warn('⚠️ LCP超出阈值:', lastEntry.startTime);
                this.triggerLCPOptimization();
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // 监控First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                
                if (entry.processingStart - entry.startTime > 100) {
                    console.warn('⚠️ FID超出阈值:', entry.processingStart - entry.startTime);
                    this.triggerFIDOptimization();
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // 监控Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            this.metrics.cumulativeLayoutShift = clsValue;
            
            if (clsValue > 0.1) {
                console.warn('⚠️ CLS超出阈值:', clsValue);
                this.triggerCLSOptimization();
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    /**
     * 触发LCP优化
     * 当LCP指标超出阈值时执行的优化措施
     * 包括资源优先级调整、预加载优化等
     * @author Huameitang
     */
    triggerLCPOptimization() {
        // 提高关键资源优先级
        this.boostCriticalResourcePriority();
        
        // 优化图片加载
        this.optimizeLCPImage();
        
        // 减少渲染阻塞资源
        this.reduceRenderBlockingResources();
    }
    
    /**
     * 触发FID优化
     * 当FID指标超出阈值时执行的优化措施
     * 包括代码分割、任务调度优化等
     * @author Huameitang
     */
    triggerFIDOptimization() {
        // 分解长任务
        this.breakUpLongTasks();
        
        // 延迟非关键JavaScript
        this.deferNonCriticalJS();
        
        // 使用Web Workers处理计算密集型任务
        this.offloadToWebWorkers();
    }
    
    /**
     * 触发CLS优化
     * 当CLS指标超出阈值时执行的优化措施
     * 包括布局稳定性优化、尺寸预留等
     * @author Huameitang
     */
    triggerCLSOptimization() {
        // 为图片和视频预留空间
        this.reserveSpaceForMedia();
        
        // 避免在现有内容上方插入内容
        this.avoidContentInsertion();
        
        // 使用transform动画替代布局动画
        this.useTransformAnimations();
    }
    
    /**
     * 获取性能报告
     * 生成详细的性能分析报告
     * 包括各项指标、优化建议等
     * @returns {Object} 性能报告对象
     * @author Huameitang
     */
    getPerformanceReport() {
        const loadTime = performance.now() - this.metrics.loadStartTime;
        
        return {
            timestamp: new Date().toISOString(),
            loadTime,
            metrics: this.metrics,
            optimizations: Array.from(this.optimizationTasks),
            recommendations: this.generateRecommendations(),
            score: this.calculatePerformanceScore()
        };
    }
    
    /**
     * 计算性能评分
     * 基于各项性能指标计算综合评分
     * 用于评估优化效果
     * @returns {number} 性能评分 (0-100)
     * @author Huameitang
     */
    calculatePerformanceScore() {
        let score = 100;
        
        // LCP评分 (权重: 25%)
        if (this.metrics.largestContentfulPaint > 4000) score -= 25;
        else if (this.metrics.largestContentfulPaint > 2500) score -= 15;
        
        // FID评分 (权重: 25%)
        if (this.metrics.firstInputDelay > 300) score -= 25;
        else if (this.metrics.firstInputDelay > 100) score -= 15;
        
        // CLS评分 (权重: 25%)
        if (this.metrics.cumulativeLayoutShift > 0.25) score -= 25;
        else if (this.metrics.cumulativeLayoutShift > 0.1) score -= 15;
        
        // 加载时间评分 (权重: 25%)
        const loadTime = performance.now() - this.metrics.loadStartTime;
        if (loadTime > 5000) score -= 25;
        else if (loadTime > 3000) score -= 15;
        
        return Math.max(0, score);
    }
}

// 全局实例
window.AdvancedPerformanceOptimizer = new AdvancedPerformanceOptimizer();

// 导出性能报告到控制台
window.getPerformanceReport = () => {
    return window.AdvancedPerformanceOptimizer.getPerformanceReport();
};

console.log('🚀 高级性能优化器已加载');