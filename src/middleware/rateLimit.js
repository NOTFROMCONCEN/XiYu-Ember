const rateLimit = require('express-rate-limit');

/**
 * API 限流中间件
 * 使用 express-rate-limit 替代自定义 Map 实现
 * 自动处理内存清理、IP 识别、响应头设置
 */
const apiRateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 100, // 每个 IP 15 分钟内最多 100 次请求
    standardHeaders: true, // 返回 RateLimit-* 响应头
    legacyHeaders: false, // 禁用 X-RateLimit-* 响应头
    message: {
        error: 'Too many requests',
        retryAfter: '15 minutes'
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json(options.message);
    }
});

module.exports = {
    apiRateLimitMiddleware
};
