const environment = require("../../../config/environment");
const { AUTH } = require("../../core/constants/auth.constants");

const generateOtp = () => {
  if (environment.basic.isDev) return AUTH.DEV_OTP_CODE;
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateOtpExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + environment.auth.otpExpiryMinutes);
  return expiry;
};

const isOtpExpired = (otpExpiry) => new Date() > new Date(otpExpiry);

module.exports = { generateOtp, generateOtpExpiry, isOtpExpired };