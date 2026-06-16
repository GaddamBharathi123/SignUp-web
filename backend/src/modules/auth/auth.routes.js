/**
 * modules/auth/auth.routes.js — Auth Route Definitions  (API Layer)
 *
 * Wires together: validation rules → validate middleware → protect middleware → controller.
 *
 * This router is mounted at /api/v1/auth in routes/index.js, so paths
 * here are relative (e.g., "/login" becomes "/api/v1/auth/login").
 */

const { Router } = require("express");
const authController = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const { registerRules, loginRules, refreshRules } = require("./auth.validation");

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 * 1. Validate request body with registerRules
 * 2. Check validation result with `validate`
 * 3. Hand off to controller
 */
router.post("/register", registerRules, validate, authController.register);

/**
 * POST /api/v1/auth/login
 */
router.post("/login", loginRules, validate, authController.login);

/**
 * POST /api/v1/auth/refresh
 * Refresh token is sent in the request body, not as a Bearer token.
 */
router.post("/refresh", refreshRules, validate, authController.refresh);

// ─── Protected Routes (require valid access token) ────────────────────────────

/**
 * GET /api/v1/auth/me
 * `protect` middleware verifies the Bearer token and attaches req.user.
 */
router.get("/me", protect, authController.getMe);

/**
 * POST /api/v1/auth/logout
 */
router.post("/logout", protect, authController.logout);

module.exports = router;