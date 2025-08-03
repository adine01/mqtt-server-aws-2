module.exports = {
    AVAILABLE_ROUTES: [
        "99", "240", "EX01", "187"
    ],
    CLEANUP_INTERVAL: parseInt(process.env.CLEANUP_INTERVAL) || 5 * 60 * 1000, // 5 minutes
    OFFLINE_THRESHOLD: parseInt(process.env.OFFLINE_THRESHOLD) || 10 * 60 * 1000 // 10 minutes
};