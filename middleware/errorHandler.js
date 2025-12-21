import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../error.log'), maxsize: 5 * 1024 * 1024, maxFiles: 5 }),
    ],
});

export default function errorHandler(err, req, res, next) {
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
