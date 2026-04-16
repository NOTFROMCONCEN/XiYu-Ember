/**
 * 高级性能监控模块
 * 负责监控页面性能指标并动态调整
 * @author Huameitang
 */

export function initAdvancedPerformanceMonitoring() {
    // 监控页面加载性能
    if ('PerformanceObserver' in window) {
        // 监控长任务
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    console.warn(`检测到长任务: ${entry.duration.toFixed(2)}ms`);
                    // 触发性能保护模式
                    document.body.classList.add('performance-protection');
                }
            }
        });

        try {
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.log('长任务监控不支持');
        }

        // 监控布局偏移
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.value > 0.1) {
                    console.warn(`检测到布局偏移: ${entry.value.toFixed(3)}`);
                }
            }
        });

        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.log('布局偏移监控不支持');
        }
    }

    // 监控内存使用
    if (performance.memory) {
        setInterval(() => {
            const memoryInfo = performance.memory;
            const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576);
            const limitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1048576);
            const usagePercent = (usedMB / limitMB) * 100;

            if (usagePercent > 85) {
                console.warn(`内存使用率过高: ${usagePercent.toFixed(1)}%`);
                document.body.classList.add('memory-pressure');

                // 触发垃圾回收（如果支持）
                if (window.gc && typeof window.gc === 'function') {
                    window.gc();
                }
            } else if (usagePercent < 70) {
                document.body.classList.remove('memory-pressure');
            }
        }, 15000);
    }

    // 监控网络状态
    if ('connection' in navigator) {
        const connection = navigator.connection;

        function updateConnectionStatus() {
            const effectiveType = connection.effectiveType;
            document.body.classList.remove('slow-connection', 'fast-connection');

            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                document.body.classList.add('slow-connection', 'data-saver');
            } else if (effectiveType === '4g') {
                document.body.classList.add('fast-connection');
            }
        }

        connection.addEventListener('change', updateConnectionStatus);
        updateConnectionStatus();
    }
}
