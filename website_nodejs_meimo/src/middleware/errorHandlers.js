function errorHandler(err, req, res, next) {
    console.error('服务器错误:', err);

    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    res.status(500).json({ error: err.message, stack: err.stack });
}

function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Resource not found' });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
