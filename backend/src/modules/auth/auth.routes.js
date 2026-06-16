
const { Router } = require("express");
const authController = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const { registerRules, loginRules, refreshRules } = require("./auth.validation");

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

router.post("/register", registerRules, validate, authController.register);


router.post("/login", loginRules, validate, authController.login);


router.post("/refresh", refreshRules, validate, authController.refresh);

router.get("/me", protect, authController.getMe);

router.post("/logout", protect, authController.logout);

module.exports = router;