const path = require('path');
const fs = require('fs');

/**
 * HTTP/2 Push 中间件
 * 对首页请求推送关键 CSS 文件
 * 包含路径边界验证防止目录遍历
 */
function http2PushMiddleware(req, res, next) {
    if (req.path === '/' || req.path === '/index.html') {
        if (res.push) {
            const publicDir = path.resolve(__dirname, '../public');
            const cssFiles = [
                { url: '/css/critical-path.css', filePath: path.join(publicDir, 'css/critical-path.css') },
                { url: '/css/combined-performance.css', filePath: path.join(publicDir, 'css/combined-performance.css') }
            ];

            cssFiles.forEach(({ url, filePath }) => {
                // 防御性路径验证：确保推送的文件在 public 目录内
                const resolvedPath = path.resolve(filePath);
                if (!resolvedPath.startsWith(publicDir)) {
                    return;
                }

                const pushOptions = {
                    ':path': url,
                    ':method': 'GET',
                    ':scheme': 'https'
                };

                const stream = res.push(pushOptions);
                if (stream) {
                    fs.readFile(filePath, (err, data) => {
                        if (!err) {
                            stream.respond({
                                'content-type': 'text/css',
                                'content-length': data.length
                            });
                            stream.end(data);
                        } else {
                            stream.end();
                        }
                    });
                }
            });
        }
    }

    next();
}

module.exports = {
    http2PushMiddleware
};
