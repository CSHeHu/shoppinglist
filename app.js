
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import rateLimit from 'express-rate-limit';

import dashboardRouter from './routes/dashboardRoutes.js';
import usersRouter from './routes/users.js';
import itemRouter from './routes/itemRoutes.js';
import recipeRouter from './routes/recipeRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default app;
