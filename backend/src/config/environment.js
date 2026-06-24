require("dotenv").config();

const required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const parseIntEnv = (key, fallback) => parseInt(process.env[key] || fallback);
const parseBool = (key, fallback) => {
  const val = process.env[key];
  if (!val) return fallback;
  return ["true", "1", "yes"].includes(val.trim().toLowerCase());
};

const env = process.env.NODE_ENV || "development";

const environment = {
  basic: {
    env,
    isDev: env === "development",
    isProduction: env === "production",
    port: parseIntEnv("PORT", "5000"),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  database: {
    uri: required("MONGO_URI"),
  },
  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseIntEnv("SMTP_PORT", "587"),
    user: required("SMTP_USER"),
    pass: required("SMTP_PASS"),
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  },
  auth: {
    otpExpiryMinutes: parseIntEnv("OTP_EXPIRES_IN_MINUTES", "10"),
    maxLoginAttempts: parseIntEnv("AUTH_MAX_LOGIN_ATTEMPTS", "5"),
    lockoutMinutes: parseIntEnv("AUTH_LOCKOUT_MINUTES", "30"),
  },
  rateLimit: {
    windowMs: parseIntEnv("RATE_LIMIT_WINDOW_MS", "60000"),
    max: parseIntEnv("RATE_LIMIT_MAX", "120"),
    login: {
      windowMs: parseIntEnv("RATE_LIMIT_LOGIN_WINDOW_MS", "900000"),
      max: parseIntEnv("RATE_LIMIT_LOGIN_MAX", "10"),
    },
    otp: {
      windowMs: parseIntEnv("RATE_LIMIT_OTP_WINDOW_MS", "3600000"),
      max: parseIntEnv("RATE_LIMIT_OTP_MAX", "5"),
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || (env === "development" ? "debug" : "info"),
    enableFile: parseBool("LOG_ENABLE_FILE", env === "production"),
    maxSize: process.env.LOG_MAX_SIZE || "20m",
    maxFiles: process.env.LOG_MAX_FILES || "30d",
  },
};

module.exports = environment;