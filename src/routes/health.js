const { isDev } = require('../config/constants');

function registerHealthRoute(app) {
    app.get('/health', (req, res) => {
        const uptime = process.uptime();

        const response = {
            status: 'healthy',
            uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
            timestamp: new Date().toISOString()
        };

        // 只在开发环境暴露详细内存信息
        if (isDev) {
            const memoryUsage = process.memoryUsage();
            response.memory = {
                rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`,
                heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
                heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
            };
        }

        res.json(response);
    });
}

module.exports = {
    registerHealthRoute
};
