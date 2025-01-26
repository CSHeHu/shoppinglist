console.log('Server starting...');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const winston = require('winston');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dataRouter = require('./routes/dataRoutes');
const rateLimit = require('express-rate-limit');

const app = express();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
});

app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);

// winston logs errors, morgan connections
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
        winston.format.printf(({ timestamp, message, stack, status }) => {
            return `Timestamp: ${timestamp}\nStatus: ${status}\nMessage: ${message}\nStack: ${stack}\n`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, 'error.log') })
    ],
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {    
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// error handler
app.use(function(err, req, res, next) {    
    // Log the error details to the logfile
    if (req.app.get('env') === 'development'){
        errorLogger.error({
            message: err.message,
            stack: err.stack,
            status: err.status || 500,
            timestamp: new Date().toISOString(),
        });
    }

    // Send error response
    res.status(err.status || 500).json({
        error: {
            code: err.status || 500,
            message: 'Something went wrong. Please try again later.',
        },
    });
});

module.exports = app;
