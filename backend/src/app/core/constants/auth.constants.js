const environment = require("../../../config/environment");

const AUTH = {
  OTP_EXPIRY_MINUTES: environment.auth.otpExpiryMinutes,
  MAX_LOGIN_ATTEMPTS: environment.auth.maxLoginAttempts,
  LOCKOUT_MINUTES: environment.auth.lockoutMinutes,
  DEV_OTP_CODE: "123456",
};

const JWT = {
  ACCESS_EXPIRES_IN: environment.jwt.accessExpiresIn,
  REFRESH_EXPIRES_IN: environment.jwt.refreshExpiresIn,
};

module.exports = { AUTH, JWT };