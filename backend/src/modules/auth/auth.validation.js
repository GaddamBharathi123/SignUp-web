/**
 * modules/auth/auth.validation.js — Request Validation Rules  (Domain Layer)
 *
 * Each export is an array of express-validator check() rules.
 * They are used as middleware arrays in the route definitions:
 *
 *   router.post("/register", registerRules, validate, authController.register)
 *
 * The `validate` middleware (validate.middleware.js) reads the result of
 * these rules and returns a 422 if any fail.
 */

const { body } = require("express-validator");

/**
 * Rules for POST /auth/register
 */
const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(), // Lowercases and removes dots from Gmail addresses

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

/**
 * Rules for POST /auth/login
 */
const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

/**
 * Rules for POST /auth/refresh
 */
const refreshRules = [
  body("refreshToken")
    .notEmpty().withMessage("Refresh token is required"),
];

module.exports = { registerRules, loginRules, refreshRules };