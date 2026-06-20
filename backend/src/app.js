
const express = require("express");
const cors = require("cors");
const { CORS_ORIGIN } = require("./config/env");
const apiRoutes = require("./routes/index");
const { notFound, globalErrorHandler } = require("./middleware/error.middleware");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/modules/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ─── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", apiRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is healthy 🟢" });
});

// ─── Error Handling Middleware (must be LAST) ──────────────────────────────────
app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;