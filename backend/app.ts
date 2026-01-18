import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import logger from "morgan";
import rateLimit from "express-rate-limit";

// TODO: Migrate all imports below to TypeScript modules and remove ts-ignore
import dashboardRouter from "./routes/dashboardRoutes.js";
import userRouter from "./routes/userRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { getUserDBClient } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// security: rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// view engine
// TODO: Legacy server-side rendering remains using EJS. When SPA is
// fully adopted, remove EJS views and the view engine setup.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// JWT secrets required for auth
if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn(
    "JWT secrets are not set; set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET for auth",
  );
}

// routes
app.use("/api/v1", dashboardRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", itemRouter);

// catch 404
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// central error handler
app.use(errorHandler);

export default app;
