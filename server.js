require('dotenv').config();

const http = require('http');
const { PORT, NODE_ENV } = require('./src/config/constants');
const { createApp } = require('./src/app');

const app = createApp();
const server = http.createServer(app);

let isShuttingDown = false;

// 启动服务器
server.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
    console.log(`[${new Date().toISOString()}] Environment: ${NODE_ENV}`);
});

// 优雅关闭处理
function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`[${new Date().toISOString()}] Received ${signal}. Shutting down gracefully...`);

    // 如果服务器尚未启动（监听前出错），直接退出
    if (!server.listening) {
        console.log(`[${new Date().toISOString()}] Server was not listening, exiting immediately`);
        process.exit(0);
        return;
    }

    server.close((err) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] Error during shutdown:`, err);
            process.exit(1);
        }
        console.log(`[${new Date().toISOString()}] Server closed successfully`);
        process.exit(0);
    });

    // 强制关闭兜底（10秒后）
    setTimeout(() => {
        console.error(`[${new Date().toISOString()}] Forced shutdown after timeout`);
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未捕获异常处理
process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
});
