const logger = {
    info: (message, ...args) => {
        console.log(`ℹ️ ${message}`, ...args);
    },
    success: (message, ...args) => {
        console.log(`✅ ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`❌ ${message}`, ...args);
    },
    warning: (message, ...args) => {
        console.warn(`⚠️ ${message}`, ...args);
    },
    mqtt: (message, ...args) => {
        console.log(`📡 ${message}`, ...args);
    },
    socket: (message, ...args) => {
        console.log(`🔌 ${message}`, ...args);
    },
    route: (message, ...args) => {
        console.log(`🚌 ${message}`, ...args);
    },
    passenger: (message, ...args) => {
        console.log(`📱 ${message}`, ...args);
    }
};

export default logger;