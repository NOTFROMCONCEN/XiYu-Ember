const morgan = require('morgan');
const { isDev } = require('../config/constants');

/**
 * 请求日志中间件
 * 开发环境：彩色详细日志
 * 生产环境：紧凑的 combined 格式
 */
const requestLogger = isDev
    ? morgan('dev')
    : morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms');

module.exports = {
    requestLogger
};
