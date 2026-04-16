function http2PushMiddleware(req, res, next) {
    if (req.path === '/' || req.path === '/index.html') {
        if (res.push) {
            const cssFiles = ['/css/critical-path.css', '/css/combined-performance.css'];

            cssFiles.forEach((file) => {
                const pushOptions = {
                    ':path': file,
                    ':method': 'GET',
                    ':scheme': 'https'
                };

                const stream = res.push(pushOptions);
                if (stream) {
                    stream.end();
                }
            });
        }
    }

    next();
}

module.exports = {
    http2PushMiddleware
};
