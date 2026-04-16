/**
 * 组件加载器模块
 * @author Huameitang
 */

/**
 * 加载HTML组件
 * @param {string} componentPath - 组件文件路径
 * @param {string} containerId - 容器元素ID
 * @returns {Promise<void>}
 */
export async function loadComponent(componentPath, containerId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        } else {
            console.error(`Container with ID '${containerId}' not found`);
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        showComponentPlaceholder(containerId);
    }
}

/**
 * 串行加载组件
 * @param {Array} components - 组件配置数组
 */
export async function loadComponentsSequentially(components) {
    let loadedCount = 0;
    const totalComponents = components.length;

    for (const component of components) {
        try {
            updateLoadingProgress(loadedCount, totalComponents);
            await loadComponent(component.url, component.name + '-component');
            loadedCount++;
            await new Promise(resolve => setTimeout(resolve,
                component.priority === 'high' ? 30 :
                    component.priority === 'medium' ? 50 : 100
            ));
        } catch (error) {
            console.error(`加载组件 ${component.name} 失败:`, error);
            await handleComponentLoadError(component, loadedCount);
        }
    }

    hideLoadingProgress();
}

/**
 * 并行加载组件
 * @param {Array} components - 组件配置数组
 */
export async function loadComponentsInParallel(components) {
    const criticalComponents = components.filter(c => c.priority === 'critical');
    const importantComponents = components.filter(c => c.priority === 'important');
    const normalComponents = components.filter(c => c.priority === 'normal');

    try {
        // 加载关键组件
        await Promise.all(criticalComponents.map(component =>
            loadComponentWithRetry(component.url, component.name + '-component', 2)
        ));

        // 加载重要组件
        await Promise.all(importantComponents.map(component =>
            loadComponentWithRetry(component.url, component.name + '-component', 1)
        ));

        // 加载普通组件
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                Promise.all(normalComponents.map(component =>
                    loadComponentWithRetry(component.url, component.name + '-component', 1)
                ));
            });
        } else {
            setTimeout(() => {
                Promise.all(normalComponents.map(component =>
                    loadComponentWithRetry(component.url, component.name + '-component', 1)
                ));
            }, 100);
        }
    } catch (error) {
        console.error('并行加载组件出错:', error);
        await loadComponentsSequentially(components);
    }
}

/**
 * 处理组件加载错误
 * @param {Object} component - 组件配置
 * @param {number} loadedCount - 已加载计数
 */
async function handleComponentLoadError(component, loadedCount) {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loadComponent(component.url, component.name + '-component');
        loadedCount++;
    } catch (retryError) {
        console.error(`重试加载组件 ${component.name} 仍然失败:`, retryError);
        showComponentPlaceholder(component.name);
    }
}

/**
 * 显示加载进度
 * @param {number} loaded - 已加载数量
 * @param {number} total - 总数量
 */
function updateLoadingProgress(loaded, total) {
    let progressBar = document.getElementById('loading-progress');
    if (!progressBar) {
        createProgressBar();
        progressBar = document.getElementById('loading-progress');
    }

    const percentage = (loaded / total) * 100;
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `加载中... ${loaded}/${total} (${Math.round(percentage)}%)`;
    }
}

/**
 * 创建进度条
 */
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'loading-progress';
    progressBar.innerHTML = `
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">加载中...</div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        #loading-progress {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
        }
        .progress-container {
            max-width: 400px;
            margin: 0 auto;
            text-align: center;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        .progress-text {
            color: white;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
}

/**
 * 隐藏加载进度
 */
export function hideLoadingProgress() {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
        progressBar.style.opacity = '0';
        setTimeout(() => progressBar.remove(), 300);
    }
}
