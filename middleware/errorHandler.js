
const winston = require('winston');
const path = require('path');

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, message, stack, status }) => {
            return `Timestamp: ${timestamp}\nStatus: ${status}\nMessage: ${message}\nStack: ${stack}\n`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../error.log') }),
    ],
});

function errorHandler(err, req, res, next) {
    const status = err.status || 500;

    // Always log error details
    errorLogger.error({
        message: err.message,
        stack: err.stack,
        status,
        timestamp: new Date().toISOString(),
    });

    // Send response (hide details in production)
    res.status(status).json({
        error: {
            code: status,
            message:
                req.app.get('env') === 'development'
                    ? err.message
                    : 'Something went wrong. Please try again later.',
        },
    });
}

module.exports = errorHandler;
