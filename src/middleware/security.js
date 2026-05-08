const helmet = require('helmet');

/**
 * 安全中间件
 * 使用 Helmet 配置安全响应头
 * CSP 配置只允许实际使用的外部资源域
 */
function createSecurityMiddleware() {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
                scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"]
            }
        },
        crossOriginEmbedderPolicy: false,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    });
}

module.exports = {
    createSecurityMiddleware
};
