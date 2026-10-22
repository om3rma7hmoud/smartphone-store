import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import AppError from "./utils/ApiError.js";
import errorHandler from "./middlewares/error.middleware.js";
import { paymentWebhook } from "./controllers/payment.webhook.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Stripe signature verification requires the unparsed request body.
// Keep this route before express.json().
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook,
);

app.use(express.json());
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    skip: () => env.NODE_ENV !== "production",
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    data: null,
    message: "Mobile Store API is running",
  });
});
app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
