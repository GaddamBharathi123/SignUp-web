const rateLimit = require("express-rate-limit");
const environment = require("../../../config/environment");
const ERROR_CODES = require("../../core/constants/http.constants");

const createLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: options.message || "Too many requests. Please try again later.",
        error_code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        timestamp: new Date().toISOString(),
      });
    },
    ...options,
  });

const globalLimiter = createLimiter({
  windowMs: environment.rateLimit.windowMs,
  max: environment.rateLimit.max,
  message: "Too many requests from this IP.",
});

const loginLimiter = createLimiter({
  windowMs: environment.rateLimit.login.windowMs,
  max: environment.rateLimit.login.max,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

const otpLimiter = createLimiter({
  windowMs: environment.rateLimit.otp.windowMs,
  max: environment.rateLimit.otp.max,
  message: "Too many OTP requests. Please try again in 1 hour.",
});

module.exports = { globalLimiter, loginLimiter, otpLimiter };