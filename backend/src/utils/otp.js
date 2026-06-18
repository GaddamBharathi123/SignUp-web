const { OTP_EXPIRES_IN_MINUTES } = require("../config/env");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateOtpExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + OTP_EXPIRES_IN_MINUTES);
  return expiry;
};

const isOtpExpired = (otpExpiry) => {
  return new Date() > new Date(otpExpiry);
};

module.exports = { generateOtp, generateOtpExpiry, isOtpExpired };