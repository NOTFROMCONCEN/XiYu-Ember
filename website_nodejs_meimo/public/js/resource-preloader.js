/**
 * 资源预加载管理模块
 * 负责高效预加载和缓存关键资源
 * @author Huameitang
 */

import { progressBar } from './progress-bar.js';

export class ResourcePreloader {
    constructor() {
        this.preloadedResources = new Map();
        this.loadingPromises = new Map();
        this.observer = null;
    }

    initialize() {
        // 初始化 IntersectionObserver
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        if (element.dataset.src) {
                            this.loadImage(element);
                        }
                    }
                });
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.01
            }
        );

        // 预注册图片懒加载
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });
    }

    async loadImage(imgElement) {
        const src = imgElement.dataset.src;
        if (!src) return;

        // 从观察者中移除
        this.observer.unobserve(imgElement);

        try {
            // 如果图片已经加载过，直接从缓存获取
            if (this.preloadedResources.has(src)) {
                imgElement.src = this.preloadedResources.get(src);
                return;
            }

            // 如果图片正在加载，等待加载完成
            if (this.loadingPromises.has(src)) {
                const url = await this.loadingPromises.get(src);
                imgElement.src = url;
                return;
            }

            // 开始新的加载
            progressBar.addLoadingItem(src);
            const loadPromise = new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.preloadedResources.set(src, src);
                    progressBar.removeLoadingItem(src);
                    resolve(src);
                };
                img.onerror = reject;
                img.src = src;
            });

            this.loadingPromises.set(src, loadPromise);
            const url = await loadPromise;
            imgElement.src = url;
            this.loadingPromises.delete(src);

        } catch (error) {
            console.error(`加载图片失败: ${src}`, error);
            progressBar.removeLoadingItem(src);
        }
    }

    preloadCriticalResources() {
        // 预加载关键 CSS 文件
        const criticalCss = [
            '/css/styles.css',
            '/css/header.css',
            '/css/hero.css'
        ];

        criticalCss.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });

        // 预加载关键图片资源
        const criticalImages = [
            '/images/logo1.PNG',
            '/images/logo2.PNG'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

export const resourcePreloader = new ResourcePreloader();
