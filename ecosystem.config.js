module.exports = {
    apps: [{
        name: 'qiyu-ember-website',
        script: './server.js',
        instances: 'max',          // 使用所有 CPU 核心
        exec_mode: 'cluster',      // 集群模式
        env: {
            NODE_ENV: 'development',
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        // 日志配置
        log_file: './logs/combined.log',
        out_file: './logs/out.log',
        error_file: './logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        // 自动重启
        autorestart: true,
        max_restarts: 10,
        min_uptime: '10s',
        // 内存限制
        max_memory_restart: '512M',
        // 优雅关闭
        kill_timeout: 5000,
        listen_timeout: 10000,
        // 监控
        watch: false,              // 生产环境不监控文件变化
        ignore_watch: ['node_modules', 'logs', 'public'],
        // 健康检查
        exp_backoff_restart_delay: 100
    }]
};
