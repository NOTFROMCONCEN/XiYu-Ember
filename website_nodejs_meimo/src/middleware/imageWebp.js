const path = require('path');
const fs = require('fs');

function imageWebpMiddleware(rootDir) {
    return (req, res, next) => {
        const filename = req.params.filename;
        const ext = path.extname(filename).toLowerCase();
        const supportsWebP = req.headers.accept && req.headers.accept.includes('image/webp');

        if (supportsWebP && ['.jpg', '.jpeg', '.png'].includes(ext)) {
            const webpPath = path.join(rootDir, 'public', 'images', filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

            fs.access(webpPath, fs.constants.F_OK, (err) => {
                if (!err) {
                    res.sendFile(webpPath);
                } else {
                    next();
                }
            });
            return;
        }

        next();
    };
}

module.exports = {
    imageWebpMiddleware
};
