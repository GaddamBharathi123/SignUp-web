const { Router } = require("express");
const authController = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const {
  registerRules,
  loginRules,
  refreshRules,
  sendOtpRules,
  verifyOtpRules,
  verifyLoginOtpRules,
} = require("./auth.validation");

const router = Router();

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.post("/verify-login-otp", verifyLoginOtpRules, validate, authController.verifyLoginOtp);
router.post("/resend-login-otp", sendOtpRules, validate, authController.resendLoginOtp);

router.post("/refresh", refreshRules, validate, authController.refresh);
router.post("/send-otp", sendOtpRules, validate, authController.sendOtp);
router.post("/verify-otp", verifyOtpRules, validate, authController.verifyOtp);

router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

module.exports = router;