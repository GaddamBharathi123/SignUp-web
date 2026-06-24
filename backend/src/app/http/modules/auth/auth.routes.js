const { Router } = require("express");
const authController = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const { loginLimiter, otpLimiter } = require("../../middleware/rate-limit.middleware");
const {
  registerRules,
  loginRules,
  refreshRules,
  sendOtpRules,
  verifyOtpRules,
  verifyLoginOtpRules,
  forgotPasswordRules,
  verifyResetOtpRules,
  resetPasswordRules,
} = require("./auth.validation");

const router = Router();

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginLimiter, loginRules, validate, authController.login);
router.post("/verify-login-otp", verifyLoginOtpRules, validate, authController.verifyLoginOtp);
router.post("/resend-login-otp", otpLimiter, sendOtpRules, validate, authController.resendLoginOtp);

router.post("/send-otp", otpLimiter, sendOtpRules, validate, authController.sendOtp);
router.post("/verify-otp", verifyOtpRules, validate, authController.verifyOtp);

router.post("/forgot-password", otpLimiter, forgotPasswordRules, validate, authController.forgotPassword);
router.post("/verify-reset-otp", verifyResetOtpRules, validate, authController.verifyResetOtp);
router.post("/reset-password", resetPasswordRules, validate, authController.resetPassword);

router.post("/refresh", refreshRules, validate, authController.refresh);

router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

module.exports = router;