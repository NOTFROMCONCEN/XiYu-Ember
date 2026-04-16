const rateLimitStore = new Map();

function apiRateLimitMiddleware(req, res, next) {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 100;

    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.windowStart > windowMs) {
            rateLimitStore.delete(ip);
        }
    }

    const clientData = rateLimitStore.get(clientIP) || { windowStart: now, requests: 0 };

    if (now - clientData.windowStart > windowMs) {
        clientData.windowStart = now;
        clientData.requests = 0;
    }

    clientData.requests++;
    rateLimitStore.set(clientIP, clientData);

    if (clientData.requests > maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
    }

    next();
}

module.exports = {
    apiRateLimitMiddleware
};
