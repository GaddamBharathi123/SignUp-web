const { isAppError } = require("../../core/errors");
const ERROR_CODES = require("../../core/constants/http.constants");
const { createLogger } = require("../services/logger.service");

const log = createLogger("error");

const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    error_code: ERROR_CODES.NOT_FOUND,
    error: { path: req.originalUrl, method: req.method },
    timestamp: new Date().toISOString(),
  });
};

const globalErrorHandler = (err, req, res, next) => {
  log.exception(`Error in ${req.method} ${req.originalUrl}`, err);

  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error_code: err.errorCode,
      error: err.details ?? { message: err.message },
      timestamp: err.timestamp,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
      error_code: ERROR_CODES.ALREADY_EXISTS,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      error_code: ERROR_CODES.VALIDATION_ERROR,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error_code: ERROR_CODES.TOKEN_INVALID,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV !== "production" ? err.message : "Internal Server Error",
    error_code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { notFound, globalErrorHandler };