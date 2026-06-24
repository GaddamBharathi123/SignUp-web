const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const environment = require("./config/environment");
const apiRoutes = require("./routes/index");
const { notFound, globalErrorHandler } = require("./app/http/middleware/error.middleware");
const { loggingMiddleware } = require("./app/http/middleware/logging.middleware");
const { globalLimiter } = require("./app/http/middleware/rate-limit.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: environment.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);
app.use(globalLimiter);

app.use("/api/v1", apiRoutes);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy 🟢",
    environment: environment.basic.env,
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;