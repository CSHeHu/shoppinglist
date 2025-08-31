const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');

const dashboardRouter = require('./routes/dashboardRoutes');
const usersRouter = require('./routes/users');
const itemRouter = require('./routes/itemRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// security: rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', dashboardRouter);
app.use('/users', usersRouter);
app.use('/data', itemRouter);
app.use('/recipe', recipeRouter);

// catch 404
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// central error handler
app.use(errorHandler);

module.exports = app;
