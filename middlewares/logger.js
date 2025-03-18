const logger = (req, res, next) => {
    const start = Date.now(); // Capture request start time

    res.on("finish", () => {
        const duration = Date.now() - start; // Calculate response time
        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
        );
    });

    next(); // Move to the next middleware
};