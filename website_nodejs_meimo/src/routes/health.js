function registerHealthRoute(app) {
    app.get('/health', (req, res) => {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();

        res.json({
            status: 'healthy',
            uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
            memory: {
                rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`,
                heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
                heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
            },
            timestamp: new Date().toISOString()
        });
    });
}

module.exports = {
    registerHealthRoute
};
