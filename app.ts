
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import rateLimit from 'express-rate-limit';

// TODO: Migrate all imports below to TypeScript modules and remove ts-ignore
// @ts-ignore
import dashboardRouter from './routes/dashboardRoutes.js';
// @ts-ignore
import userRouter from './routes/userRoutes.js';
// @ts-ignore
import itemRouter from './routes/itemRoutes.js';
// @ts-ignore
import errorHandler from './middleware/errorHandler.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// @ts-ignore
import { getUserDBClient } from './config/db.js';


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
app.use(express.static(path.join(__dirname, 'public')));

const userDBClient = getUserDBClient();
app.set('trust proxy', 1);

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ client: userDBClient }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'strict'
  }
}));

// routes
app.use('/', dashboardRouter);
app.use('/', userRouter);
app.use('/', itemRouter);

// catch 404
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// central error handler
app.use(errorHandler);

export default app;
