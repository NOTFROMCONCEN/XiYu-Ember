/**
 * JavaScript性能优化模块
 * @author Performance Optimizer
 * 提供性能监控、懒加载、防抖节流等优化功能
 */

class PerformanceOptimizer {
    constructor() {
        this.isLowPowerMode = false;
        this.isSlowNetwork = false;
        this.performanceMetrics = {};
        this.observers = new Map();
        this.init();
    }

    /**
     * 初始化性能优化器
     */
    init() {
        this.detectDeviceCapabilities();
        this.setupPerformanceMonitoring();
        this.optimizeScrolling();
        this.setupLazyLoading();
        this.optimizeAnimations();
        this.setupNetworkOptimization();
    }

    /**
     * 检测设备性能能力
     */
    detectDeviceCapabilities() {
        // 检测设备类型
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 检测内存
        const memory = navigator.deviceMemory || 4;
        
        // 检测CPU核心数
        const cores = navigator.hardwareConcurrency || 4;
        
        // 检测网络状况
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.isSlowNetwork = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        }
        
        // 检测省电模式
        this.isLowPowerMode = isMobile || memory < 4 || cores < 4 || this.isSlowNetwork;
        
        // 应用性能模式
        if (this.isLowPowerMode) {
            document.documentElement.classList.add('low-performance-mode');
            console.log('启用低性能模式');
        }
        
        // 应用网络优化
        if (this.isSlowNetwork) {
            document.documentElement.classList.add('slow-network');
            console.log('检测到慢速网络，启用网络优化');
        }
    }

    /**
     * 优化滚动性能
     */
    optimizeScrolling() {
        let ticking = false;
        let lastScrollY = 0;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // 滚动时暂停非关键动画
            if (!this.isLowPowerMode) {
                document.documentElement.classList.toggle('scrolling', true);
                
                // 清除之前的定时器
                clearTimeout(this.scrollTimeout);
                
                // 滚动停止后恢复动画
                this.scrollTimeout = setTimeout(() => {
                    document.documentElement.classList.remove('scrolling');
                }, 150);
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };

        // 使用被动监听器优化性能
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * 防抖函数
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * 节流函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 创建全局实例
const performanceOptimizer = new PerformanceOptimizer();
window.performanceOptimizer = performanceOptimizer;

export default PerformanceOptimizer;