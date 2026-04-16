const compression = require('compression');

function createCompressionMiddleware() {
    return compression({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }

            const contentType = res.getHeader('Content-Type');
            if (contentType && (
                contentType.includes('text/') ||
                contentType.includes('application/json') ||
                contentType.includes('application/javascript') ||
                contentType.includes('text/css')
            )) {
                return true;
            }

            return compression.filter(req, res);
        },
        memLevel: 8
    });
}

module.exports = {
    createCompressionMiddleware
};
