const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// 从环境变量读取配置，提供合理的默认值
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const TRUST_PROXY = process.env.TRUST_PROXY || '1';

// 安全相关配置
const ENABLE_HSTS = process.env.ENABLE_HSTS === 'true';

// 静态文件缓存配置
const STATIC_CACHE_MAX_AGE = Number(process.env.STATIC_CACHE_MAX_AGE) || 86400;

// 验证必要的环境变量
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number between 1 and 65535.`);
}

module.exports = {
    ROOT_DIR,
    PUBLIC_DIR,
    PORT,
    NODE_ENV,
    TRUST_PROXY,
    ENABLE_HSTS,
    STATIC_CACHE_MAX_AGE,
    isDev: NODE_ENV === 'development',
    isProd: NODE_ENV === 'production',
    isTest: NODE_ENV === 'test'
};
