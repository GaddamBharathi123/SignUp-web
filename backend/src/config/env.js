require("dotenv").config();
/**
 * @param {string}
 * @returns {string} 
 */
const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`  Missing required environment variable: ${key}`);
  }
  return value;
};

module.exports = {
  // ── Server ────────────────────────────────────────────────────────────────
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // ── Database ──────────────────────────────────────────────────────────────
  MONGO_URI: required("MONGO_URI"),

  // ── JWT ───────────────────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),

  /** Access token lifetime — short-lived for security */
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  /** Refresh token lifetime — long-lived, stored in DB */
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // ── CORS ──────────────────────────────────────────────────────────────────
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};