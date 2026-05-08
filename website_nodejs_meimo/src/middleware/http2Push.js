const path = require('path');
const fs = require('fs');

function http2PushMiddleware(req, res, next) {
    if (req.path === '/' || req.path === '/index.html') {
        if (res.push) {
            const cssFiles = [
                { url: '/css/critical-path.css', filePath: path.join(__dirname, '../../public/css/critical-path.css') },
                { url: '/css/combined-performance.css', filePath: path.join(__dirname, '../../public/css/combined-performance.css') }
            ];

            cssFiles.forEach(({ url, filePath }) => {
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
