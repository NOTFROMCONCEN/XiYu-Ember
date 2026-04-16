/**
 * Service Worker - 高级缓存和性能优化
 * @author Huameitang
 * 这个Service Worker提供离线缓存、资源预加载、智能缓存策略
 * 显著提升页面加载速度和用户体验
 * 支持缓存版本管理和自动更新
 */

const CACHE_NAME = 'qiyu-ember-v2.2.0';
const STATIC_CACHE = 'qiyu-static-v2.2.0';
const DYNAMIC_CACHE = 'qiyu-dynamic-v2.2.0';
const IMAGE_CACHE = 'qiyu-images-v2.2.0';

// 需要预缓存的关键资源
const PRECACHE_RESOURCES = [
    '/',
    '/index.html',
    '/index_modular.html',
    '/css/styles.css',
    '/css/critical-path.css',
    '/css/combined-performance.css',
    '/js/performance-config.js',
    '/components/header.html',
    '/components/hero.html',
    '/components/gallery.html',
    '/components/form.html'
];

// 缓存策略配置
const CACHE_STRATEGIES = {
    // 静态资源：缓存优先
    static: {
        pattern: /\.(css|js|html)$/,
        strategy: 'cacheFirst',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        maxEntries: 100
    },
    // 图片资源：缓存优先，较长过期时间
    images: {
        pattern: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        strategy: 'cacheFirst',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
        maxEntries: 200
    },
    // API请求：网络优先
    api: {
        pattern: /\/api\//,
        strategy: 'networkFirst',
        maxAge: 5 * 60 * 1000, // 5分钟
        maxEntries: 50
    },
    // 其他资源：网络优先
    others: {
        pattern: /.*/,
        strategy: 'networkFirst',
        maxAge: 24 * 60 * 60 * 1000, // 1天
        maxEntries: 100
    }
};

/**
 * Service Worker安装事件
 * 预缓存关键资源，确保离线可用性
 * @author Huameitang
 */
self.addEventListener('install', event => {
    console.log('🔧 Service Worker 安装中...');

    event.waitUntil(
        Promise.all([
            // 预缓存静态资源
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 预缓存静态资源');
                return cache.addAll(PRECACHE_RESOURCES);
            }),

            // 跳过等待，立即激活
            self.skipWaiting()
        ])
    );
});

/**
 * Service Worker激活事件
 * 清理旧缓存，更新缓存版本
 * @author Huameitang
 */
self.addEventListener('activate', event => {
    console.log('✅ Service Worker 激活中...');

    event.waitUntil(
        Promise.all([
            // 清理旧缓存
            cleanupOldCaches(),

            // 立即控制所有客户端
            self.clients.claim()
        ])
    );
});

/**
 * 网络请求拦截
 * 根据资源类型应用不同的缓存策略
 * @author Huameitang
 */
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // 只处理GET请求
    if (request.method !== 'GET') {
        return;
    }

    // 跳过chrome扩展和其他协议
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(handleRequest(request));
});

/**
 * 处理网络请求
 * 根据资源类型选择合适的缓存策略
 * @param {Request} request - 网络请求对象
 * @returns {Promise<Response>} 响应对象
 * @author Huameitang
 */
async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 确定缓存策略
    let strategy = CACHE_STRATEGIES.others;
    let cacheName = DYNAMIC_CACHE;

    if (CACHE_STRATEGIES.static.pattern.test(pathname)) {
        strategy = CACHE_STRATEGIES.static;
        cacheName = STATIC_CACHE;
    } else if (CACHE_STRATEGIES.images.pattern.test(pathname)) {
        strategy = CACHE_STRATEGIES.images;
        cacheName = IMAGE_CACHE;
    } else if (CACHE_STRATEGIES.api.pattern.test(pathname)) {
        strategy = CACHE_STRATEGIES.api;
        cacheName = DYNAMIC_CACHE;
    }

    // 应用缓存策略
    switch (strategy.strategy) {
        case 'cacheFirst':
            return cacheFirst(request, cacheName, strategy);
        case 'networkFirst':
            return networkFirst(request, cacheName, strategy);
        case 'staleWhileRevalidate':
            return staleWhileRevalidate(request, cacheName, strategy);
        default:
            return fetch(request);
    }
}

/**
 * 缓存优先策略
 * 优先从缓存获取，缓存未命中时从网络获取
 * @param {Request} request - 请求对象
 * @param {string} cacheName - 缓存名称
 * @param {Object} strategy - 策略配置
 * @returns {Promise<Response>} 响应对象
 * @author Huameitang
 */
async function cacheFirst(request, cacheName, strategy) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // 检查缓存是否过期
            const cacheTime = await getCacheTime(request, cacheName);
            if (cacheTime && (Date.now() - cacheTime < strategy.maxAge)) {
                return cachedResponse;
            }
        }

        // 从网络获取
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // 更新缓存
            await updateCache(cache, request, networkResponse.clone(), strategy);
        }

        return networkResponse;

    } catch (error) {
        console.error('缓存优先策略失败:', error);

        // 降级到缓存（即使过期）
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // 返回离线页面或错误响应
        return createOfflineResponse();
    }
}

/**
 * 网络优先策略
 * 优先从网络获取，网络失败时从缓存获取
 * @param {Request} request - 请求对象
 * @param {string} cacheName - 缓存名称
 * @param {Object} strategy - 策略配置
 * @returns {Promise<Response>} 响应对象
 * @author Huameitang
 */
async function networkFirst(request, cacheName, strategy) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            await updateCache(cache, request, networkResponse.clone(), strategy);
        }

        return networkResponse;

    } catch (error) {
        console.log('网络请求失败，尝试从缓存获取:', request.url);

        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return createOfflineResponse();
    }
}

/**
 * 过期重新验证策略
 * 立即返回缓存，同时在后台更新缓存
 * @param {Request} request - 请求对象
 * @param {string} cacheName - 缓存名称
 * @param {Object} strategy - 策略配置
 * @returns {Promise<Response>} 响应对象
 * @author Huameitang
 */
async function staleWhileRevalidate(request, cacheName, strategy) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // 后台更新缓存
    const networkResponsePromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            updateCache(cache, request, networkResponse.clone(), strategy);
        }
        return networkResponse;
    }).catch(error => {
        console.log('后台更新失败:', error);
    });

    // 立即返回缓存响应，如果有的话
    return cachedResponse || networkResponsePromise;
}

/**
 * 更新缓存
 * 将响应存储到缓存中，并管理缓存大小
 * @param {Cache} cache - 缓存对象
 * @param {Request} request - 请求对象
 * @param {Response} response - 响应对象
 * @param {Object} strategy - 策略配置
 * @author Huameitang
 */
async function updateCache(cache, request, response, strategy) {
    try {
        // 存储响应到缓存
        await cache.put(request, response);

        // 存储缓存时间戳
        await setCacheTime(request, cache.name);

        // 管理缓存大小
        await manageCacheSize(cache, strategy.maxEntries);

    } catch (error) {
        console.error('更新缓存失败:', error);
    }
}

/**
 * 管理缓存大小
 * 当缓存条目超过限制时，删除最旧的条目
 * @param {Cache} cache - 缓存对象
 * @param {number} maxEntries - 最大条目数
 * @author Huameitang
 */
async function manageCacheSize(cache, maxEntries) {
    const keys = await cache.keys();

    if (keys.length > maxEntries) {
        const entriesToDelete = keys.length - maxEntries;

        // 删除最旧的条目（假设keys是按时间排序的）
        for (let i = 0; i < entriesToDelete; i++) {
            await cache.delete(keys[i]);
        }
    }
}

/**
 * 设置缓存时间戳
 * @param {Request} request - 请求对象
 * @param {string} cacheName - 缓存名称
 * @author Huameitang
 */
async function setCacheTime(request, cacheName) {
    const timeCache = await caches.open(`${cacheName}-timestamps`);
    const timeResponse = new Response(Date.now().toString());
    await timeCache.put(request, timeResponse);
}

/**
 * 获取缓存时间戳
 * @param {Request} request - 请求对象
 * @param {string} cacheName - 缓存名称
 * @returns {Promise<number|null>} 时间戳
 * @author Huameitang
 */
async function getCacheTime(request, cacheName) {
    try {
        const timeCache = await caches.open(`${cacheName}-timestamps`);
        const timeResponse = await timeCache.match(request);

        if (timeResponse) {
            const timeText = await timeResponse.text();
            return parseInt(timeText, 10);
        }

        return null;
    } catch (error) {
        return null;
    }
}

/**
 * 清理旧缓存
 * 删除不再使用的缓存版本
 * @author Huameitang
 */
async function cleanupOldCaches() {
    const currentCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
    const cacheNames = await caches.keys();

    const deletePromises = cacheNames
        .filter(cacheName => !currentCaches.includes(cacheName))
        .map(cacheName => {
            console.log('🗑️ 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
        });

    await Promise.all(deletePromises);
}

/**
 * 创建离线响应
 * 当网络和缓存都不可用时返回的响应
 * @returns {Response} 离线响应
 * @author Huameitang
 */
function createOfflineResponse() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>离线模式 - 栖屿 Ember</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px;
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    color: white;
                }
                .offline-message {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 30px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                }
            </style>
        </head>
        <body>
            <div class="offline-message">
                <h1>🌙 栖屿 Ember</h1>
                <h2>离线模式</h2>
                <p>您当前处于离线状态，部分功能可能不可用。</p>
                <p>请检查网络连接后重试。</p>
                <button onclick="location.reload()">重新加载</button>
            </div>
        </body>
        </html>
    `;

    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

/**
 * 消息处理
 * 处理来自主线程的消息
 * @author Huameitang
 */
self.addEventListener('message', event => {
    const { type, payload } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'GET_CACHE_INFO':
            getCacheInfo().then(info => {
                event.ports[0].postMessage(info);
            });
            break;

        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;

        case 'PRELOAD_RESOURCES':
            preloadResources(payload.urls).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
    }
});

/**
 * 获取缓存信息
 * @returns {Promise<Object>} 缓存信息
 * @author Huameitang
 */
async function getCacheInfo() {
    const cacheNames = await caches.keys();
    const info = {};

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        info[cacheName] = keys.length;
    }

    return info;
}

/**
 * 清空所有缓存
 * @author Huameitang
 */
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
}

/**
 * 预加载资源
 * @param {string[]} urls - 要预加载的URL列表
 * @author Huameitang
 */
async function preloadResources(urls) {
    const cache = await caches.open(STATIC_CACHE);

    const preloadPromises = urls.map(async url => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
            }
        } catch (error) {
            console.error('预加载失败:', url, error);
        }
    });

    await Promise.all(preloadPromises);
}

console.log('🚀 Service Worker 已加载');