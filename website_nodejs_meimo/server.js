const { PORT } = require('./src/config/constants');
const { createApp } = require('./src/app');

const app = createApp();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});