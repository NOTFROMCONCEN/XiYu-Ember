const path = require('path');
const express = require('express');

function createStaticFilesMiddleware(publicDir) {
    return express.static(publicDir, {
        etag: true,
        lastModified: true,
        weak: true,
        setHeaders: (res, filePath, stat) => {
            const ext = path.extname(filePath).toLowerCase();

            if (ext === '.html') {
                res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
                res.setHeader('Vary', 'Accept-Encoding, Accept');
            } else if (['.css', '.js'].includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
                res.setHeader('Vary', 'Accept-Encoding');
                if (ext === '.css') {
                    res.setHeader('X-Content-Type-Options', 'nosniff');
                }
            } else if (['.jpg', '.jpeg', '.png', '.gif', '.ico', '.svg', '.webp'].includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
                res.setHeader('Vary', 'Accept-Encoding, Accept');

                if (ext === '.webp') {
                    res.setHeader('Content-Type', 'image/webp');
                }

                if (stat.size > 1024 * 1024) {
                    console.warn(`大图片文件检测: ${path.basename(filePath)} (${(stat.size / 1024 / 1024).toFixed(2)}MB)`);
                }
            } else if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Access-Control-Allow-Origin', '*');
            } else if (['.json', '.xml'].includes(ext)) {
                res.setHeader('Cache-Control', 'public, max-age=3600');
                res.setHeader('Vary', 'Accept-Encoding');
            }

            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('X-XSS-Protection', '1; mode=block');

            if (['.css', '.js'].includes(ext)) {
                res.setHeader('X-Resource-Hint', 'preload');
            }

            if (stat.size > 0) {
                res.setHeader('Accept-Ranges', 'bytes');
            }
        },
        index: ['index.html', 'index_modular.html'],
        maxAge: 0,
        dotfiles: 'ignore',
        redirect: true,
        acceptRanges: true
    });
}

module.exports = {
    createStaticFilesMiddleware
};
