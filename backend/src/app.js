
const express = require("express");
const cors = require("cors");
const { CORS_ORIGIN } = require("./config/env");
const apiRoutes = require("./routes/index");
const { notFound, globalErrorHandler } = require("./middleware/error.middleware");

const app = express();

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