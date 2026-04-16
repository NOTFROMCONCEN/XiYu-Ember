const fs = require('fs');
const path = require('path');

function registerRootRoute(app, publicDir) {
    app.get('/', (req, res) => {
        const startTime = process.hrtime.bigint();
        const ifModifiedSince = req.headers['if-modified-since'];
        const ifNoneMatch = req.headers['if-none-match'];
        const indexPath = path.join(publicDir, 'index_modular.html');

        fs.stat(indexPath, (err, stats) => {
            if (err) {
                return res.status(404).send('Page not found');
            }

            const lastModified = stats.mtime.toUTCString();
            const etag = `"${stats.size}-${stats.mtime.getTime()}"`;

            if ((ifModifiedSince && ifModifiedSince === lastModified) ||
                (ifNoneMatch && ifNoneMatch === etag)) {
                return res.status(304).end();
            }

            res.setHeader('Last-Modified', lastModified);
            res.setHeader('ETag', etag);
            res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');

            res.sendFile(indexPath, (sendErr) => {
                if (!sendErr) {
                    const endTime = process.hrtime.bigint();
                    const duration = Number(endTime - startTime) / 1000000;
                    console.log(`首页请求完成: ${duration.toFixed(2)}ms`);
                }
            });
        });
    });
}

module.exports = {
    registerRootRoute
};
