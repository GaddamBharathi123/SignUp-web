const { validationResult } = require("express-validator");
const { sendError } = require("../services/response.service");
const ERROR_CODES = require("../../core/constants/http.constants");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendError(res, 422, "Validation failed", ERROR_CODES.VALIDATION_ERROR, formattedErrors);
  }

  next();
};

module.exports = { validate };