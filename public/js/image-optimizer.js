/**
 * 图片懒加载和优化模块
 * @author Performance Optimizer
 * 提供高性能的图片懒加载、WebP检测、渐进式加载等功能
 */

class ImageOptimizer {
    constructor() {
        this.lazyImages = [];
        this.imageObserver = null;
        this.supportsWebP = false;
        this.init();
    }

    /**
     * 初始化图片优化器
     */
    async init() {
        await this.detectWebPSupport();
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupProgressiveLoading();
    }

    /**
     * 检测WebP支持
     */
    async detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
                document.documentElement.classList.add(this.supportsWebP ? 'webp' : 'no-webp');
                console.log(`WebP支持: ${this.supportsWebP ? '是' : '否'}`);
                resolve(this.supportsWebP);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * 设置懒加载
     */
    setupLazyLoading() {
        // 检查是否支持Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(
                this.handleImageIntersection.bind(this),
                {
                    // 提前50px开始加载
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );
        }

        // 监听所有懒加载图片
        this.observeLazyImages();
    }

    /**
     * 观察懒加载图片
     */
    observeLazyImages() {
        const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');
        
        lazyImages.forEach(img => {
            if (this.imageObserver) {
                this.imageObserver.observe(img);
            } else {
                // 降级处理：直接加载
                this.loadImage(img);
            }
        });
    }

    /**
     * 处理图片进入视口
     */
    handleImageIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.imageObserver.unobserve(img);
            }
        });
    }

    /**
     * 加载图片
     */
    loadImage(img) {
        const startTime = performance.now();
        
        // 创建新的Image对象预加载
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // 加载成功
            const loadTime = performance.now() - startTime;
            console.log(`图片加载完成: ${loadTime.toFixed(2)}ms`);
            
            // 应用图片源
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            
            // 添加加载完成状态
            img.classList.add('loaded');
            img.classList.remove('image-loading');
            
            // 触发自定义事件
            img.dispatchEvent(new CustomEvent('imageLoaded', { 
                detail: { loadTime } 
            }));
        };
        
        imageLoader.onerror = () => {
            // 加载失败处理
            console.warn('图片加载失败:', img.dataset.src || img.src);
            img.classList.add('image-error');
            img.classList.remove('image-loading');
            
            // 设置错误占位符
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            }
        };
        
        // 添加加载状态
        img.classList.add('image-loading');
        
        // 开始加载
        const srcToLoad = this.getOptimizedImageSrc(img);
        imageLoader.src = srcToLoad;
    }

    /**
     * 获取优化后的图片源
     */
    getOptimizedImageSrc(img) {
        let src = img.dataset.src || img.src;
        
        // WebP优化
        if (this.supportsWebP && img.dataset.webp) {
            src = img.dataset.webp;
        }
        
        // 根据设备像素比选择图片
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 1.5 && img.dataset.srcRetina) {
            src = img.dataset.srcRetina;
        }
        
        // 移动端优化
        if (window.innerWidth <= 768 && img.dataset.srcMobile) {
            src = img.dataset.srcMobile;
        }
        
        return src;
    }

    /**
     * 优化现有图片
     */
    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not(.lazy-image)');
        
        images.forEach(img => {
            // 添加错误处理
            if (!img.complete) {
                img.addEventListener('error', () => {
                    img.classList.add('image-error');
                });
            }
            
            // 添加加载完成处理
            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    /**
     * 设置渐进式加载
     */
    setupProgressiveLoading() {
        const progressiveImages = document.querySelectorAll('.progressive-image');
        
        progressiveImages.forEach(container => {
            const placeholder = container.querySelector('.placeholder');
            const fullImage = container.querySelector('.full-image');
            
            if (placeholder && fullImage) {
                fullImage.addEventListener('load', () => {
                    container.classList.add('loaded');
                });
                
                fullImage.addEventListener('error', () => {
                    container.classList.add('error');
                });
            }
        });
    }

    /**
     * 预加载关键图片
     */
    preloadCriticalImages(imageUrls) {
        imageUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    /**
     * 压缩大图片URL (如果服务支持)
     */
    getCompressedImageUrl(originalUrl, width, quality = 80) {
        // 如果有图片处理服务，可以在这里添加URL转换逻辑
        // 例如: return `${originalUrl}?w=${width}&q=${quality}&format=auto`;
        return originalUrl;
    }

    /**
     * 获取图片尺寸建议
     */
    getOptimalImageSize() {
        const screenWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // 根据屏幕尺寸返回建议的图片宽度
        if (screenWidth <= 480) {
            return Math.floor(480 * devicePixelRatio);
        } else if (screenWidth <= 768) {
            return Math.floor(768 * devicePixelRatio);
        } else if (screenWidth <= 1024) {
            return Math.floor(1024 * devicePixelRatio);
        } else {
            return Math.floor(1920 * Math.min(devicePixelRatio, 2));
        }
    }

    /**
     * 添加新的懒加载图片
     */
    addLazyImage(img) {
        if (this.imageObserver) {
            this.imageObserver.observe(img);
        } else {
            this.loadImage(img);
        }
    }

    /**
     * 移除图片观察
     */
    removeImageObserver(img) {
        if (this.imageObserver) {
            this.imageObserver.unobserve(img);
        }
    }

    /**
     * 销毁观察器
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// 初始化图片优化器
const imageOptimizer = new ImageOptimizer();

// 导出给全局使用
window.imageOptimizer = imageOptimizer;

// 页面可见性变化时的优化
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时停止所有图片加载
        console.log('页面隐藏，暂停图片加载');
    } else {
        // 页面显示时恢复图片加载
        console.log('页面显示，恢复图片加载');
        imageOptimizer.observeLazyImages();
    }
});

// 网络状态变化监听
if ('connection' in navigator) {
    const connection = navigator.connection;
    
    const handleConnectionChange = () => {
        const effectiveType = connection.effectiveType;
        console.log(`网络状态变化: ${effectiveType}`);
        
        // 根据网络状态调整图片质量
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            // 慢速网络，降低图片质量
            document.documentElement.classList.add('slow-network');
        } else {
            document.documentElement.classList.remove('slow-network');
        }
    };
    
    connection.addEventListener('change', handleConnectionChange);
    handleConnectionChange(); // 初始检查
}

export default ImageOptimizer;