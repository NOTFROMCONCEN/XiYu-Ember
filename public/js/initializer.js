/**
 * 页面初始化模块
 * 负责协调和管理所有页面初始化流程
 * @author Huameitang
 */

import { progressBar } from './progress-bar.js';
import { resourcePreloader } from './resource-preloader.js';
import { loadComponent } from './component-loader.js';
import { initAdvancedPerformanceMonitoring } from './performance-monitoring.js';
import { initializeEffects } from './effects.js';
import { initializeInteractions } from './interactions.js';
import { Gallery } from './gallery.js';

export class PageInitializer {
    constructor() {
        this.components = [
            { id: 'header-component', path: 'components/header.html', priority: 'high' },
            { id: 'hero-component', path: 'components/hero.html', priority: 'high' },
            { id: 'cards-component', path: 'components/cards.html', priority: 'medium' },
            { id: 'gallery-component', path: 'components/gallery.html', priority: 'medium' },
            { id: 'symbols-component', path: 'components/symbols.html', priority: 'low' },
            { id: 'form-component', path: 'components/form.html', priority: 'low' },
            { id: 'about-component', path: 'components/about.html', priority: 'low' },
            { id: 'footer-component', path: 'components/footer.html', priority: 'low' }
        ];
    }

    async initialize() {
        try {
            console.log('开始初始化页面...');

            // 1. 初始化进度条
            progressBar.initialize();
            progressBar.setProgress(10);

            // 2. 初始化性能监控
            initAdvancedPerformanceMonitoring();
            progressBar.setProgress(20);

            // 3. 初始化资源预加载器
            resourcePreloader.initialize();
            progressBar.setProgress(30);

            // 4. 预加载关键资源
            await resourcePreloader.preloadCriticalResources();
            progressBar.setProgress(40);

            // 5. 加载高优先级组件
            const highPriorityComponents = this.components.filter(c => c.priority === 'high');
            await this.loadComponents(highPriorityComponents);
            progressBar.setProgress(60);

            // 6. 加载中等优先级组件
            const mediumPriorityComponents = this.components.filter(c => c.priority === 'medium');
            await this.loadComponents(mediumPriorityComponents);
            progressBar.setProgress(80);

            // 7. 加载低优先级组件
            const lowPriorityComponents = this.components.filter(c => c.priority === 'low');
            await this.loadComponents(lowPriorityComponents);
            progressBar.setProgress(90);

            // 8. 完成初始化
            await this.finalizeInitialization();
            progressBar.setProgress(100);

            console.log('页面初始化完成');
            return true;

        } catch (error) {
            console.error('页面初始化失败:', error);
            this.handleInitializationError(error);
            return false;
        }
    }

    async loadComponents(components) {
        try {
            for (const component of components) {
                const elementId = component.id;
                const componentPath = component.path;

                console.log(`加载组件: ${elementId}`);
                // 修复：修正了导入方式和 loadComponent 的参数顺序
                await loadComponent(componentPath, elementId);
            }
        } catch (error) {
            console.error('加载组件失败:', error);
            throw error;
        }
    }

    async finalizeInitialization() {
        // 等待下一帧以确保DOM更新
        await new Promise(resolve => requestAnimationFrame(resolve));

        initializeEffects();
        initializeInteractions();

        // 实例化画廊并调用其初始化方法
        const galleryInstance = new Gallery();
        galleryInstance.init();

        // 启动后台优化
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.performBackgroundOptimizations();
            });
        } else {
            setTimeout(() => {
                this.performBackgroundOptimizations();
            }, 1000);
        }

        // 设置页面就绪标记
        document.body.classList.add('page-ready');
    }

    performBackgroundOptimizations() {
        // 预加载其他资源
        const secondaryResources = [
            'images/logo2.PNG',
            'css/gallery.css',
            'css/symbols.css'
        ];

        for (const resource of secondaryResources) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        }
    }

    handleInitializationError(error) {
        console.error('初始化过程中出现错误:', error);

        // 显示错误信息
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.style.display = 'block';
            loadingText.style.color = '#ff6b6b';
            loadingText.style.whiteSpace = 'pre-wrap';
            loadingText.textContent = '加载失败: ' + (error?.stack || error?.message || error) + '\n请提供截图排查。';
        }

        // 移除加载状态
        document.body.classList.remove('loading');
        document.body.classList.add('page-ready');

        // 触发错误事件
        const errorEvent = new CustomEvent('initializationError', {
            detail: { error }
        });
        document.dispatchEvent(errorEvent);
    }
}

export const pageInitializer = new PageInitializer();
