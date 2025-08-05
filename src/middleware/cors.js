import cors from 'cors';
import config from '../config/server.js';

const corsOptions = {
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
};

export default cors(corsOptions);