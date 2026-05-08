/**
 * 高级性能监控和优化工具
 * 提供实时性能监控、自动优化和性能报告功能
 * 专门为魅魔网站优化设计
 * @author Huameitang
 */

/**
 * 性能监控器主类
 * 负责监控页面性能指标并提供优化建议
 * 包括FPS监控、内存监控、网络监控等功能
 * @author Huameitang
 */
class PerformanceMonitor {
    constructor() {
        this.isMonitoring = false;
        this.metrics = {
            fps: 60,
            frameTime: 16.67,
            memoryUsage: 0,
            memoryLimit: 0,
            networkSpeed: 'unknown',
            renderTime: 0,
            domNodes: 0,
            activeAnimations: 0
        };
        
        this.thresholds = {
            lowFPS: 30,
            highMemory: 80, // 百分比
            slowNetwork: 1000, // ms
            maxDOMNodes: 5000,
            maxAnimations: 10
        };
        
        this.callbacks = {
            onLowFPS: [],
            onHighMemory: [],
            onSlowNetwork: [],
            onPerformanceImproved: []
        };
        
        this.performanceHistory = [];
        this.maxHistoryLength = 100;
        
        this.init();
    }
    
    /**
     * 初始化性能监控器
     * 设置各种监控器和事件监听器
     * 为不同浏览器提供兼容性支持
     * @author Huameitang
     */
    init() {
        this.setupFPSMonitor();
        this.setupMemoryMonitor();
        this.setupNetworkMonitor();
        this.setupDOMMonitor();
        this.setupAnimationMonitor();
        this.setupPerformanceObserver();
        
        // 页面可见性变化监控
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMonitoring();
            } else {
                this.resumeMonitoring();
            }
        });
        
        console.log('性能监控器已初始化');
    }
    
    /**
     * 设置FPS监控器
     * 使用requestAnimationFrame监控帧率
     * 当FPS过低时触发优化措施
     * @author Huameitang
     */
    setupFPSMonitor() {
        let frameCount = 0;
        let lastTime = performance.now();
        let lastFPSCheck = lastTime;
        
        const measureFPS = (currentTime) => {
            if (!this.isMonitoring) return;
            
            frameCount++;
            
            // 每秒计算一次FPS
            if (currentTime - lastFPSCheck >= 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastFPSCheck));
                this.metrics.frameTime = (currentTime - lastFPSCheck) / frameCount;
                
                // 检查FPS阈值
                if (this.metrics.fps < this.thresholds.lowFPS) {
                    this.triggerLowFPSOptimization();
                } else if (this.metrics.fps > this.thresholds.lowFPS + 10) {
                    this.triggerPerformanceImprovement();
                }
                
                frameCount = 0;
                lastFPSCheck = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    /**
     * 设置内存监控器
     * 监控JavaScript堆内存使用情况
     * 当内存使用过高时触发清理措施
     * @author Huameitang
     */
    setupMemoryMonitor() {
        if (!performance.memory) {
            console.warn('浏览器不支持内存监控');
            return;
        }
        
        const checkMemory = () => {
            if (!this.isMonitoring) return;
            
            const memInfo = performance.memory;
            this.metrics.memoryUsage = Math.round(memInfo.usedJSHeapSize / 1048576); // MB
            this.metrics.memoryLimit = Math.round(memInfo.jsHeapSizeLimit / 1048576); // MB
            
            const usagePercent = (this.metrics.memoryUsage / this.metrics.memoryLimit) * 100;
            
            if (usagePercent > this.thresholds.highMemory) {
                this.triggerMemoryOptimization();
            }
            
            // 记录性能历史
            this.recordPerformanceSnapshot();
        };
        
        setInterval(checkMemory, 5000); // 每5秒检查一次
    }
    
    /**
     * 设置网络监控器
     * 监控网络连接状态和速度
     * 根据网络状况调整资源加载策略
     * @author Huameitang
     */
    setupNetworkMonitor() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            const updateNetworkInfo = () => {
                this.metrics.networkSpeed = connection.effectiveType;
                
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.triggerSlowNetworkOptimization();
                }
            };
            
            connection.addEventListener('change', updateNetworkInfo);
            updateNetworkInfo();
        }
        
        // 测量网络延迟
        this.measureNetworkLatency();
    }
    
    /**
     * 测量网络延迟
     * 通过加载小资源来测试网络速度
     * 用于动态调整资源加载策略
     * @author Huameitang
     */
    async measureNetworkLatency() {
        try {
            const startTime = performance.now();
            await fetch('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', {
                method: 'GET',
                cache: 'no-cache'
            });
            const endTime = performance.now();
            
            const latency = endTime - startTime;
            if (latency > this.thresholds.slowNetwork) {
                this.triggerSlowNetworkOptimization();
            }
        } catch (error) {
            console.warn('网络延迟测量失败:', error);
        }
    }
    
    /**
     * 设置DOM监控器
     * 监控DOM节点数量和复杂度
     * 当DOM过于复杂时建议优化
     * @author Huameitang
     */
    setupDOMMonitor() {
        const checkDOMComplexity = () => {
            if (!this.isMonitoring) return;
            
            this.metrics.domNodes = document.querySelectorAll('*').length;
            
            if (this.metrics.domNodes > this.thresholds.maxDOMNodes) {
                console.warn(`DOM节点过多: ${this.metrics.domNodes}，建议优化`);
                document.body.classList.add('complex-dom');
            } else {
                document.body.classList.remove('complex-dom');
            }
        };
        
        // 使用MutationObserver监控DOM变化
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(() => {
                clearTimeout(this.domCheckTimeout);
                this.domCheckTimeout = setTimeout(checkDOMComplexity, 1000);
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        checkDOMComplexity();
    }
    
    /**
     * 设置动画监控器
     * 监控活动动画数量
     * 当动画过多时自动暂停低优先级动画
     * @author Huameitang
     */
    setupAnimationMonitor() {
        const checkAnimations = () => {
            if (!this.isMonitoring) return;
            
            // 统计CSS动画
            const animatedElements = document.querySelectorAll('*');
            let activeAnimations = 0;
            
            animatedElements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.animationName !== 'none' || 
                    computedStyle.transitionProperty !== 'none') {
                    activeAnimations++;
                }
            });
            
            this.metrics.activeAnimations = activeAnimations;
            
            if (activeAnimations > this.thresholds.maxAnimations) {
                this.triggerAnimationOptimization();
            }
        };
        
        setInterval(checkAnimations, 3000); // 每3秒检查一次
    }
    
    /**
     * 设置性能观察器
     * 使用PerformanceObserver监控各种性能指标
     * 包括长任务、布局偏移等
     * @author Huameitang
     */
    setupPerformanceObserver() {
        if (!('PerformanceObserver' in window)) {
            console.warn('浏览器不支持PerformanceObserver');
            return;
        }
        
        // 监控长任务
        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`检测到长任务: ${entry.duration.toFixed(2)}ms`);
                        this.triggerLongTaskOptimization();
                    }
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.log('长任务监控不支持');
        }
        
        // 监控布局偏移
        try {
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.value > 0.1) {
                        console.warn(`检测到布局偏移: ${entry.value.toFixed(3)}`);
                        document.body.classList.add('layout-unstable');
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.log('布局偏移监控不支持');
        }
    }
    
    /**
     * 触发低FPS优化
     * 当检测到低帧率时执行的优化措施
     * 包括暂停动画、简化效果等
     * @author Huameitang
     */
    triggerLowFPSOptimization() {
        console.warn(`FPS过低: ${this.metrics.fps}，启动优化措施`);
        
        document.body.classList.add('low-fps-mode');
        
        // 暂停非关键动画
        const animations = document.querySelectorAll('.particle-effect, .complex-animation');
        animations.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
        
        // 简化视觉效果
        const complexEffects = document.querySelectorAll('.vhs-overlay, .distortion, .noise');
        complexEffects.forEach(el => {
            el.style.display = 'none';
        });
        
        this.callbacks.onLowFPS.forEach(callback => callback(this.metrics));
    }
    
    /**
     * 触发内存优化
     * 当内存使用过高时执行的清理措施
     * 包括清理缓存、移除不必要的DOM等
     * @author Huameitang
     */
    triggerMemoryOptimization() {
        console.warn(`内存使用过高: ${this.metrics.memoryUsage}MB/${this.metrics.memoryLimit}MB`);
        
        document.body.classList.add('memory-pressure');
        
        // 清理图片缓存
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!this.isElementInViewport(img)) {
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }
        });
        
        // 移除不可见的复杂元素
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(el => {
            if (el.classList.contains('non-critical')) {
                el.remove();
            }
        });
        
        // 触发垃圾回收
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        this.callbacks.onHighMemory.forEach(callback => callback(this.metrics));
    }
    
    /**
     * 触发慢网络优化
     * 当检测到网络较慢时执行的优化措施
     * 包括延迟加载、压缩资源等
     * @author Huameitang
     */
    triggerSlowNetworkOptimization() {
        console.warn('检测到慢网络，启动优化措施');
        
        document.body.classList.add('slow-network');
        
        // 延迟加载非关键资源
        const nonCriticalImages = document.querySelectorAll('img:not(.critical)');
        nonCriticalImages.forEach(img => {
            if (img.src && !img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }
        });
        
        // 禁用自动播放
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            video.removeAttribute('autoplay');
            video.pause();
        });
        
        this.callbacks.onSlowNetwork.forEach(callback => callback(this.metrics));
    }
    
    /**
     * 触发长任务优化
     * 当检测到长任务时执行的优化措施
     * 包括任务分片、延迟执行等
     * @author Huameitang
     */
    triggerLongTaskOptimization() {
        document.body.classList.add('performance-protection');
        
        // 暂停所有动画
        const allAnimations = document.querySelectorAll('*');
        allAnimations.forEach(el => {
            if (el.style.animationName) {
                el.style.animationPlayState = 'paused';
            }
        });
        
        // 延迟恢复
        setTimeout(() => {
            document.body.classList.remove('performance-protection');
            allAnimations.forEach(el => {
                if (el.style.animationPlayState === 'paused') {
                    el.style.animationPlayState = 'running';
                }
            });
        }, 2000);
    }
    
    /**
     * 触发动画优化
     * 当动画过多时执行的优化措施
     * 智能暂停低优先级动画
     * @author Huameitang
     */
    triggerAnimationOptimization() {
        console.warn(`活动动画过多: ${this.metrics.activeAnimations}`);
        
        // 暂停低优先级动画
        const lowPriorityAnimations = document.querySelectorAll('.low-priority-animation, .decoration-animation');
        lowPriorityAnimations.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    /**
     * 触发性能改善
     * 当性能指标改善时恢复被暂停的功能
     * 智能恢复各种效果和动画
     * @author Huameitang
     */
    triggerPerformanceImprovement() {
        document.body.classList.remove('low-fps-mode', 'memory-pressure', 'performance-protection');
        
        // 恢复动画
        const pausedAnimations = document.querySelectorAll('[style*="animation-play-state: paused"]');
        pausedAnimations.forEach(el => {
            el.style.animationPlayState = 'running';
        });
        
        // 恢复视觉效果
        const hiddenEffects = document.querySelectorAll('.vhs-overlay, .distortion, .noise');
        hiddenEffects.forEach(el => {
            el.style.display = '';
        });
        
        this.callbacks.onPerformanceImproved.forEach(callback => callback(this.metrics));
    }
    
    /**
     * 检查元素是否在视口内
     * 用于优化不可见元素的处理
     * 提供精确的视口检测
     * @param {Element} element - 要检查的元素
     * @returns {boolean} 是否在视口内
     * @author Huameitang
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * 记录性能快照
     * 保存当前性能指标到历史记录
     * 用于性能趋势分析
     * @author Huameitang
     */
    recordPerformanceSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            ...this.metrics
        };
        
        this.performanceHistory.push(snapshot);
        
        // 限制历史记录长度
        if (this.performanceHistory.length > this.maxHistoryLength) {
            this.performanceHistory.shift();
        }
    }
    
    /**
     * 开始监控
     * 启动所有性能监控功能
     * 重置监控状态
     * @author Huameitang
     */
    startMonitoring() {
        this.isMonitoring = true;
        console.log('性能监控已启动');
    }
    
    /**
     * 停止监控
     * 停止所有性能监控功能
     * 清理监控资源
     * @author Huameitang
     */
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('性能监控已停止');
    }
    
    /**
     * 暂停监控
     * 临时暂停监控（页面不可见时）
     * 保持监控状态但停止检查
     * @author Huameitang
     */
    pauseMonitoring() {
        this.isMonitoring = false;
    }
    
    /**
     * 恢复监控
     * 从暂停状态恢复监控
     * 重新开始性能检查
     * @author Huameitang
     */
    resumeMonitoring() {
        this.isMonitoring = true;
    }
    
    /**
     * 获取性能报告
     * 生成详细的性能分析报告
     * 包括当前指标和历史趋势
     * @returns {Object} 性能报告对象
     * @author Huameitang
     */
    getPerformanceReport() {
        const report = {
            current: { ...this.metrics },
            history: [...this.performanceHistory],
            recommendations: this.generateRecommendations(),
            timestamp: Date.now()
        };
        
        return report;
    }
    
    /**
     * 生成性能优化建议
     * 基于当前性能指标提供优化建议
     * 提供具体的改进方案
     * @returns {Array} 建议列表
     * @author Huameitang
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.fps < this.thresholds.lowFPS) {
            recommendations.push({
                type: 'fps',
                severity: 'high',
                message: `FPS过低 (${this.metrics.fps})，建议减少动画或简化视觉效果`,
                actions: ['暂停非关键动画', '简化CSS效果', '减少DOM操作']
            });
        }
        
        const memoryPercent = (this.metrics.memoryUsage / this.metrics.memoryLimit) * 100;
        if (memoryPercent > this.thresholds.highMemory) {
            recommendations.push({
                type: 'memory',
                severity: 'medium',
                message: `内存使用过高 (${memoryPercent.toFixed(1)}%)，建议清理资源`,
                actions: ['清理图片缓存', '移除不必要的DOM', '触发垃圾回收']
            });
        }
        
        if (this.metrics.domNodes > this.thresholds.maxDOMNodes) {
            recommendations.push({
                type: 'dom',
                severity: 'low',
                message: `DOM节点过多 (${this.metrics.domNodes})，建议优化结构`,
                actions: ['简化DOM结构', '使用虚拟滚动', '延迟渲染']
            });
        }
        
        return recommendations;
    }
    
    /**
     * 添加性能回调
     * 注册性能事件的回调函数
     * 支持多种性能事件类型
     * @param {string} event - 事件类型
     * @param {Function} callback - 回调函数
     * @author Huameitang
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }
    
    /**
     * 移除性能回调
     * 取消注册的回调函数
     * 清理事件监听器
     * @param {string} event - 事件类型
     * @param {Function} callback - 回调函数
     * @author Huameitang
     */
    off(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback);
            if (index > -1) {
                this.callbacks[event].splice(index, 1);
            }
        }
    }
}

// 创建全局性能监控实例
window.PerformanceMonitor = new PerformanceMonitor();

// 自动启动监控
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PerformanceMonitor.startMonitoring();
    });
} else {
    window.PerformanceMonitor.startMonitoring();
}

// 导出性能监控器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}