const express = require('express');

const { ROOT_DIR, PUBLIC_DIR } = require('./config/constants');
const { createCompressionMiddleware } = require('./middleware/compression');
const { createSecurityMiddleware } = require('./middleware/security');
const { http2PushMiddleware } = require('./middleware/http2Push');
const { createStaticFilesMiddleware } = require('./middleware/staticFiles');
const { imageWebpMiddleware } = require('./middleware/imageWebp');
const { apiRateLimitMiddleware } = require('./middleware/rateLimit');
const { performanceMonitorMiddleware } = require('./middleware/performanceMonitor');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');
const { registerRootRoute } = require('./routes/root');
const { registerHealthRoute } = require('./routes/health');

function createApp() {
    const app = express();

    app.set('trust proxy', 1);

    // === 基础中间件（最先注册）===
    app.use(requestLogger);
    app.use(performanceMonitorMiddleware);
    app.use(createCompressionMiddleware());
    app.use(createSecurityMiddleware());

    // === 静态资源 ===
    app.use(http2PushMiddleware);
    app.use(createStaticFilesMiddleware(PUBLIC_DIR));

    // === 图片 WebP 转换 ===
    app.get('/images/:filename', imageWebpMiddleware(ROOT_DIR));

    // === 页面路由 ===
    registerRootRoute(app, PUBLIC_DIR);
    registerHealthRoute(app);

    // === API 路由（带限流和 body 解析）===
    app.use('/api', express.json({ limit: '10mb' }));
    app.use('/api', express.urlencoded({ extended: true, limit: '10mb' }));
    app.use('/api', apiRateLimitMiddleware);

    // === 错误处理（最后注册）===
    app.use(errorHandler);
    app.use(notFoundHandler);

    return app;
}

module.exports = {
    createApp
};
