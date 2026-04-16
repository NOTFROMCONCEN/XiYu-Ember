const express = require('express');

const { ROOT_DIR, PUBLIC_DIR } = require('./config/constants');
const { createCompressionMiddleware } = require('./middleware/compression');
const { createSecurityMiddleware } = require('./middleware/security');
const { http2PushMiddleware } = require('./middleware/http2Push');
const { createStaticFilesMiddleware } = require('./middleware/staticFiles');
const { imageWebpMiddleware } = require('./middleware/imageWebp');
const { apiRateLimitMiddleware } = require('./middleware/rateLimit');
const { performanceMonitorMiddleware } = require('./middleware/performanceMonitor');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');
const { registerRootRoute } = require('./routes/root');
const { registerHealthRoute } = require('./routes/health');

function createApp() {
    const app = express();

    app.set('trust proxy', 1);

    app.use(createCompressionMiddleware());
    app.use(createSecurityMiddleware());

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    app.use(http2PushMiddleware);
    app.use(createStaticFilesMiddleware(PUBLIC_DIR));

    app.get('/images/:filename', imageWebpMiddleware(ROOT_DIR));
    app.use('/api', apiRateLimitMiddleware);

    registerRootRoute(app, PUBLIC_DIR);

    app.use(performanceMonitorMiddleware);
    registerHealthRoute(app);

    app.use(errorHandler);
    app.use(notFoundHandler);

    return app;
}

module.exports = {
    createApp
};
