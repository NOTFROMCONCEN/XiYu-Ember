function performanceMonitorMiddleware(req, res, next) {
    const startTime = process.hrtime.bigint();

    res.on('finish', () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000;

        if (duration > 1000) {
            console.warn(`慢请求检测: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
        }

        const responseSize = res.get('Content-Length');
        if (responseSize && parseInt(responseSize, 10) > 1024 * 1024) {
            console.warn(`大响应检测: ${req.url} - ${(parseInt(responseSize, 10) / 1024 / 1024).toFixed(2)}MB`);
        }
    });

    next();
}

module.exports = {
    performanceMonitorMiddleware
};
