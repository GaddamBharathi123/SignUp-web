const ERROR_CODES = require("../constants/http.constants");

class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad request", details = null) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details = null) {
    super(message, 401, ERROR_CODES.UNAUTHORIZED, details);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Permission denied", details = null) {
    super(message, 403, ERROR_CODES.PERMISSION_DENIED, details);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = null) {
    super(message, 404, ERROR_CODES.NOT_FOUND, details);
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource already exists", details = null) {
    super(message, 409, ERROR_CODES.ALREADY_EXISTS, details);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed", details = null) {
    super(message, 422, ERROR_CODES.VALIDATION_ERROR, details);
  }
}

class RateLimitError extends AppError {
  constructor(message = "Too many requests", details = null) {
    super(message, 429, ERROR_CODES.RATE_LIMIT_EXCEEDED, details);
  }
}

class InternalError extends AppError {
  constructor(message = "Internal server error", details = null) {
    super(message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR, details);
  }
}

const isAppError = (error) => error instanceof AppError;

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalError,
  isAppError,
};