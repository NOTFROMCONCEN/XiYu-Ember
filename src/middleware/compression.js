const compression = require('compression');

/**
 * 响应压缩中间件
 * 使用 compression 库的默认 filter（自动识别可压缩的 MIME 类型）
 * 支持通过 X-No-Compression 请求头禁用压缩
 */
function createCompressionMiddleware() {
    return compression({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        },
        memLevel: 8
    });
}

module.exports = {
    createCompressionMiddleware
};
