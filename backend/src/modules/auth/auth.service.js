const repo = require("./auth.repository");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../utils/jwt");
const { userDTO, authResponseDTO } = require("./auth.dto");
const { generateOtp, generateOtpExpiry, isOtpExpired } = require("../../utils/otp");
const { sendOtpEmail } = require("../../utils/mailer");

const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const issueTokens = async (user) => {
  const payload = { id: user._id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user._id });
  await repo.saveRefreshToken(user._id, refreshToken);
  return { accessToken, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existing = await repo.findUserByEmail(email);
  if (existing) {
    throw httpError(409, "An account with this email already exists.");
  }
  const hashedPassword = await hashPassword(password);
  const user = await repo.createUser({ name, email, password: hashedPassword });
  return userDTO(user);
};

const login = async ({ email, password }) => {
  const user = await repo.findUserByEmailWithPassword(email);
  if (!user) {
    throw httpError(401, "Invalid email or password.");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw httpError(401, "Invalid email or password.");
  }
  const { accessToken, refreshToken } = await issueTokens(user);
  return authResponseDTO(accessToken, refreshToken, user);
};

const getMe = async (userId) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw httpError(404, "User not found.");
  }
  return userDTO(user);
};

const logout = async (userId) => {
  await repo.clearRefreshToken(userId);
};

const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw httpError(401, "Invalid or expired refresh token.");
  }
  const user = await repo.findUserByRefreshToken(refreshToken);
  if (!user) {
    throw httpError(401, "Refresh token is no longer valid. Please log in again.");
  }
  const tokens = await issueTokens(user);
  return authResponseDTO(tokens.accessToken, tokens.refreshToken, user);
};

const sendOtp = async ({ email }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw httpError(404, "No account found with this email address.");
  }
  const otp = generateOtp();
  const otpExpiry = generateOtpExpiry();
  await repo.saveOtp(user._id, otp, otpExpiry);
  await sendOtpEmail(email, otp);
  return { email };
};

const verifyOtp = async ({ email, otp }) => {
  const user = await repo.findUserByEmailWithOtp(email);
  if (!user) {
    throw httpError(404, "No account found with this email address.");
  }
  if (!user.otp || !user.otpExpiry) {
    throw httpError(400, "No OTP was requested for this account. Please request a new one.");
  }
  if (isOtpExpired(user.otpExpiry)) {
    await repo.clearOtp(user._id);
    throw httpError(410, "OTP has expired. Please request a new one.");
  }
  if (user.otp !== otp) {
    throw httpError(401, "Invalid OTP. Please check and try again.");
  }
  await repo.clearOtp(user._id);
  const { accessToken, refreshToken } = await issueTokens(user);
  return authResponseDTO(accessToken, refreshToken, user);
};

module.exports = { register, login, getMe, logout, refresh, sendOtp, verifyOtp };