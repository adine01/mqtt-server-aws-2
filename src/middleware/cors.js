const cors = require('cors');
const config = require('../config/server');

const corsOptions = {
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);