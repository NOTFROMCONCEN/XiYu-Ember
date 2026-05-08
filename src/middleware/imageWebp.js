const path = require('path');
const fs = require('fs');

/**
 * WebP 图片转换中间件
 * 检测客户端是否支持 WebP，如果支持则尝试返回对应的 .webp 文件
 * 使用 path.basename() 防止路径遍历攻击
 */
function imageWebpMiddleware(rootDir) {
    return (req, res, next) => {
        const rawFilename = req.params.filename;
        const filename = path.basename(rawFilename);
        const ext = path.extname(filename).toLowerCase();
        const supportsWebP = req.headers.accept && req.headers.accept.includes('image/webp');

        if (!supportsWebP || !['.jpg', '.jpeg', '.png'].includes(ext)) {
            return next();
        }

        const webpFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const webpPath = path.join(rootDir, 'public', 'images', webpFilename);

        // 确保解析后的路径仍在 public/images 目录内
        const resolvedPath = path.resolve(webpPath);
        const allowedDir = path.resolve(rootDir, 'public', 'images');
        if (!resolvedPath.startsWith(allowedDir)) {
            return res.status(403).json({ error: 'Invalid path' });
        }

        fs.access(webpPath, fs.constants.F_OK, (err) => {
            if (!err) {
                res.setHeader('Content-Type', 'image/webp');
                res.sendFile(webpPath);
            } else {
                next();
            }
        });
    };
}

module.exports = {
    imageWebpMiddleware
};
