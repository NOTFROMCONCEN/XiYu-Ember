/**
 * 智能缓存管理器
 * 提供高级缓存策略、资源预加载和智能清理功能
 * 根据设备性能和网络状况动态调整缓存策略
 * @author Huameitang
 * @version 1.0.0
 */

class SmartCacheManager {
    constructor() {
        this.cache = new Map();
        this.preloadQueue = [];
        this.config = {
            maxCacheSize: this.getOptimalCacheSize(),
            maxAge: 30 * 60 * 1000, // 30分钟
            preloadDelay: 100,
            cleanupInterval: 5 * 60 * 1000, // 5分钟
            compressionEnabled: true,
            priorityLevels: {
                critical: 1,
                high: 2,
                normal: 3,
                low: 4
            }
        };
        
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            totalRequests: 0,
            averageLoadTime: 0
        };
        
        this.observers = {
            cacheHit: [],
            cacheMiss: [],
            cacheEviction: [],
            preloadComplete: []
        };
        
        this.init();
    }
    
    /**
     * 初始化缓存管理器
     * 设置定期清理和性能监控
     */
    init() {
        // 定期清理过期缓存
        setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);
        
        // 监听内存压力事件
        if ('memory' in performance) {
            this.monitorMemoryPressure();
        }
        
        // 监听网络状况变化
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.adjustCacheStrategy();
            });
        }
        
        // 页面可见性变化时的处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausePreloading();
            } else {
                this.resumePreloading();
            }
        });
        
        console.log('智能缓存管理器已初始化');
    }
    
    /**
     * 获取最优缓存大小
     * 根据设备内存动态计算
     * @returns {number} 缓存大小（字节）
     */
    getOptimalCacheSize() {
        const deviceMemory = navigator.deviceMemory || 4; // 默认4GB
        const baseSize = 50 * 1024 * 1024; // 50MB基础大小
        
        if (deviceMemory >= 8) {
            return baseSize * 4; // 200MB
        } else if (deviceMemory >= 4) {
            return baseSize * 2; // 100MB
        } else {
            return baseSize; // 50MB
        }
    }
    
    /**
     * 缓存资源
     * @param {string} key - 缓存键
     * @param {any} data - 要缓存的数据
     * @param {Object} options - 缓存选项
     */
    set(key, data, options = {}) {
        const now = Date.now();
        const priority = options.priority || 'normal';
        const maxAge = options.maxAge || this.config.maxAge;
        
        // 检查缓存大小限制
        if (this.getCurrentCacheSize() >= this.config.maxCacheSize) {
            this.evictLRU();
        }
        
        const cacheEntry = {
            data: this.compressData(data),
            timestamp: now,
            lastAccessed: now,
            priority: this.config.priorityLevels[priority],
            maxAge: maxAge,
            size: this.calculateSize(data),
            compressed: this.config.compressionEnabled
        };
        
        this.cache.set(key, cacheEntry);
        console.log(`缓存已设置: ${key}, 优先级: ${priority}`);
    }
    
    /**
     * 获取缓存资源
     * @param {string} key - 缓存键
     * @returns {any} 缓存的数据或null
     */
    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            this.stats.misses++;
            this.notifyObservers('cacheMiss', { key });
            return null;
        }
        
        const now = Date.now();
        
        // 检查是否过期
        if (now - entry.timestamp > entry.maxAge) {
            this.cache.delete(key);
            this.stats.misses++;
            this.notifyObservers('cacheMiss', { key, reason: 'expired' });
            return null;
        }
        
        // 更新访问时间
        entry.lastAccessed = now;
        this.stats.hits++;
        this.notifyObservers('cacheHit', { key });
        
        return this.decompressData(entry.data, entry.compressed);
    }
    
    /**
     * 预加载资源
     * @param {Array} resources - 要预加载的资源列表
     * @param {Object} options - 预加载选项
     */
    async preload(resources, options = {}) {
        const priority = options.priority || 'normal';
        const delay = options.delay || this.config.preloadDelay;
        
        for (const resource of resources) {
            this.preloadQueue.push({
                ...resource,
                priority: this.config.priorityLevels[priority],
                addedAt: Date.now()
            });
        }
        
        // 按优先级排序
        this.preloadQueue.sort((a, b) => a.priority - b.priority);
        
        // 开始预加载
        this.processPreloadQueue(delay);
    }
    
    /**
     * 处理预加载队列
     * @param {number} delay - 延迟时间
     */
    async processPreloadQueue(delay) {
        while (this.preloadQueue.length > 0) {
            const resource = this.preloadQueue.shift();
            
            try {
                const startTime = performance.now();
                const data = await this.loadResource(resource);
                const loadTime = performance.now() - startTime;
                
                // 更新平均加载时间
                this.updateAverageLoadTime(loadTime);
                
                // 缓存预加载的资源
                this.set(resource.key, data, {
                    priority: resource.priority,
                    maxAge: resource.maxAge
                });
                
                this.notifyObservers('preloadComplete', {
                    key: resource.key,
                    loadTime: loadTime
                });
                
                console.log(`预加载完成: ${resource.key}, 耗时: ${loadTime.toFixed(2)}ms`);
                
            } catch (error) {
                console.error(`预加载失败: ${resource.key}`, error);
            }
            
            // 延迟以避免阻塞主线程
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    /**
     * 加载资源
     * @param {Object} resource - 资源配置
     * @returns {Promise} 加载的数据
     */
    async loadResource(resource) {
        const { url, type, options = {} } = resource;
        
        switch (type) {
            case 'image':
                return this.loadImage(url, options);
            case 'script':
                return this.loadScript(url, options);
            case 'style':
                return this.loadStyle(url, options);
            case 'json':
                return this.loadJSON(url, options);
            default:
                return this.loadGeneric(url, options);
        }
    }
    
    /**
     * 加载图片
     * @param {string} url - 图片URL
     * @param {Object} options - 加载选项
     * @returns {Promise} 图片元素
     */
    loadImage(url, options = {}) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => resolve(img);
            img.onerror = reject;
            
            if (options.crossOrigin) {
                img.crossOrigin = options.crossOrigin;
            }
            
            img.src = url;
        });
    }
    
    /**
     * 加载脚本
     * @param {string} url - 脚本URL
     * @param {Object} options - 加载选项
     * @returns {Promise} 脚本内容
     */
    loadScript(url, options = {}) {
        return fetch(url, options).then(response => response.text());
    }
    
    /**
     * 加载样式
     * @param {string} url - 样式URL
     * @param {Object} options - 加载选项
     * @returns {Promise} 样式内容
     */
    loadStyle(url, options = {}) {
        return fetch(url, options).then(response => response.text());
    }
    
    /**
     * 加载JSON
     * @param {string} url - JSON URL
     * @param {Object} options - 加载选项
     * @returns {Promise} JSON数据
     */
    loadJSON(url, options = {}) {
        return fetch(url, options).then(response => response.json());
    }
    
    /**
     * 通用资源加载
     * @param {string} url - 资源URL
     * @param {Object} options - 加载选项
     * @returns {Promise} 资源数据
     */
    loadGeneric(url, options = {}) {
        return fetch(url, options).then(response => response.blob());
    }
    
    /**
     * 压缩数据
     * @param {any} data - 要压缩的数据
     * @returns {any} 压缩后的数据
     */
    compressData(data) {
        if (!this.config.compressionEnabled) {
            return data;
        }
        
        try {
            if (typeof data === 'string') {
                // 简单的字符串压缩（实际项目中可以使用更高级的压缩算法）
                return btoa(data);
            }
            return data;
        } catch (error) {
            console.warn('数据压缩失败:', error);
            return data;
        }
    }
    
    /**
     * 解压数据
     * @param {any} data - 压缩的数据
     * @param {boolean} compressed - 是否已压缩
     * @returns {any} 解压后的数据
     */
    decompressData(data, compressed) {
        if (!compressed || !this.config.compressionEnabled) {
            return data;
        }
        
        try {
            if (typeof data === 'string') {
                return atob(data);
            }
            return data;
        } catch (error) {
            console.warn('数据解压失败:', error);
            return data;
        }
    }
    
    /**
     * 计算数据大小
     * @param {any} data - 数据
     * @returns {number} 大小（字节）
     */
    calculateSize(data) {
        if (typeof data === 'string') {
            return new Blob([data]).size;
        } else if (data instanceof Blob) {
            return data.size;
        } else {
            return JSON.stringify(data).length * 2; // 估算
        }
    }
    
    /**
     * 获取当前缓存大小
     * @returns {number} 缓存大小（字节）
     */
    getCurrentCacheSize() {
        let totalSize = 0;
        for (const entry of this.cache.values()) {
            totalSize += entry.size;
        }
        return totalSize;
    }
    
    /**
     * LRU缓存淘汰
     * 移除最近最少使用的缓存项
     */
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.stats.evictions++;
            this.notifyObservers('cacheEviction', { key: oldestKey, reason: 'LRU' });
            console.log(`LRU淘汰缓存: ${oldestKey}`);
        }
    }
    
    /**
     * 清理过期缓存
     */
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.maxAge) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            this.cache.delete(key);
            this.notifyObservers('cacheEviction', { key, reason: 'expired' });
        });
        
        if (keysToDelete.length > 0) {
            console.log(`清理过期缓存: ${keysToDelete.length} 项`);
        }
    }
    
    /**
     * 监控内存压力
     */
    monitorMemoryPressure() {
        if ('memory' in performance) {
            const checkMemory = () => {
                const memInfo = performance.memory;
                const usageRatio = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
                
                if (usageRatio > 0.8) {
                    console.warn('内存使用率过高，开始激进清理缓存');
                    this.aggressiveCleanup();
                }
            };
            
            setInterval(checkMemory, 30000); // 每30秒检查一次
        }
    }
    
    /**
     * 激进清理缓存
     * 在内存压力大时清理低优先级缓存
     */
    aggressiveCleanup() {
        const keysToDelete = [];
        
        for (const [key, entry] of this.cache.entries()) {
            // 清理低优先级和较旧的缓存
            if (entry.priority >= 3 || Date.now() - entry.lastAccessed > 10 * 60 * 1000) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            this.cache.delete(key);
            this.stats.evictions++;
            this.notifyObservers('cacheEviction', { key, reason: 'memory_pressure' });
        });
        
        console.log(`激进清理缓存: ${keysToDelete.length} 项`);
    }
    
    /**
     * 调整缓存策略
     * 根据网络状况动态调整
     */
    adjustCacheStrategy() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                // 慢网络：增加缓存时间，减少预加载
                this.config.maxAge = 60 * 60 * 1000; // 1小时
                this.config.preloadDelay = 500;
                console.log('调整为慢网络缓存策略');
            } else if (effectiveType === '4g') {
                // 快网络：减少缓存时间，增加预加载
                this.config.maxAge = 15 * 60 * 1000; // 15分钟
                this.config.preloadDelay = 50;
                console.log('调整为快网络缓存策略');
            }
        }
    }
    
    /**
     * 暂停预加载
     */
    pausePreloading() {
        this.preloadPaused = true;
        console.log('预加载已暂停');
    }
    
    /**
     * 恢复预加载
     */
    resumePreloading() {
        this.preloadPaused = false;
        if (this.preloadQueue.length > 0) {
            this.processPreloadQueue(this.config.preloadDelay);
        }
        console.log('预加载已恢复');
    }
    
    /**
     * 更新平均加载时间
     * @param {number} loadTime - 加载时间
     */
    updateAverageLoadTime(loadTime) {
        this.stats.totalRequests++;
        this.stats.averageLoadTime = (
            (this.stats.averageLoadTime * (this.stats.totalRequests - 1) + loadTime) /
            this.stats.totalRequests
        );
    }
    
    /**
     * 注册观察者
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
        if (this.observers[event]) {
            this.observers[event].push(callback);
        }
    }
    
    /**
     * 移除观察者
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (this.observers[event]) {
            const index = this.observers[event].indexOf(callback);
            if (index > -1) {
                this.observers[event].splice(index, 1);
            }
        }
    }
    
    /**
     * 通知观察者
     * @param {string} event - 事件名称
     * @param {any} data - 事件数据
     */
    notifyObservers(event, data) {
        if (this.observers[event]) {
            this.observers[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('观察者回调错误:', error);
                }
            });
        }
    }
    
    /**
     * 获取缓存统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        const hitRate = this.stats.totalRequests > 0 ? 
            (this.stats.hits / this.stats.totalRequests * 100).toFixed(2) : 0;
        
        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            cacheSize: this.getCurrentCacheSize(),
            cacheCount: this.cache.size,
            preloadQueueSize: this.preloadQueue.length
        };
    }
    
    /**
     * 清空所有缓存
     */
    clear() {
        this.cache.clear();
        this.preloadQueue = [];
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            totalRequests: 0,
            averageLoadTime: 0
        };
        console.log('缓存已清空');
    }
    
    /**
     * 销毁缓存管理器
     */
    destroy() {
        this.clear();
        this.observers = {
            cacheHit: [],
            cacheMiss: [],
            cacheEviction: [],
            preloadComplete: []
        };
        console.log('缓存管理器已销毁');
    }
}

// 创建全局实例
if (typeof window !== 'undefined') {
    window.SmartCacheManager = new SmartCacheManager();
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        if (window.SmartCacheManager) {
            window.SmartCacheManager.destroy();
        }
    });
}