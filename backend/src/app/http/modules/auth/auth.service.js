const repo = require("./auth.repository");
const { hashPassword, comparePassword } = require("../../services/password.service");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../services/jwt.service");
const { generateOtp, generateOtpExpiry, isOtpExpired } = require("../../services/otp.service");
const { sendOtpEmail } = require("../../services/mailer.service");
const { userDTO, authResponseDTO } = require("./auth.dto");
const { AUTH } = require("../../../core/constants/auth.constants");
const {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../../../core/errors");
const ERROR_CODES = require("../../../core/constants/http.constants");
const { createLogger } = require("../../services/logger.service");

const log = createLogger("auth.service");

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
    throw new ConflictError("An account with this email already exists.");
  }
  const hashedPassword = await hashPassword(password);
  const user = await repo.createUser({ name, email, password: hashedPassword });
  log.info(`New user registered: ${email}`);
  return userDTO(user);
};

const login = async ({ email, password }) => {
  const user = await repo.findUserByEmailWithPassword(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }
  if (!user.isActive) {
    throw new ForbiddenError("Your account has been suspended. Please contact support.");
  }
  if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
    const minutesLeft = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
    const err = new UnauthorizedError(
      `Account is temporarily locked. Try again in ${minutesLeft} minute(s).`
    );
    err.errorCode = ERROR_CODES.ACCOUNT_LOCKED;
    throw err;
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const updated = await repo.incrementLoginAttempts(user._id);
    if (updated.loginAttempts >= AUTH.MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + AUTH.LOCKOUT_MINUTES);
      await repo.lockAccount(user._id, lockedUntil);
      log.warn(`Account locked after ${AUTH.MAX_LOGIN_ATTEMPTS} failed attempts: ${email}`);
      const err = new UnauthorizedError(
        `Too many failed attempts. Account locked for ${AUTH.LOCKOUT_MINUTES} minutes.`
      );
      err.errorCode = ERROR_CODES.ACCOUNT_LOCKED;
      throw err;
    }
    throw new UnauthorizedError("Invalid email or password.");
  }
  await repo.resetLoginAttempts(user._id);
  const otp = generateOtp();
  const otpExpiry = generateOtpExpiry();
  await repo.saveOtp(user._id, otp, otpExpiry);
  await sendOtpEmail(user.email, otp);
  log.info(`2FA OTP sent to ${email}`);
  return { email: user.email };
};

const verifyLoginOtp = async ({ email, otp }) => {
  const user = await repo.findUserByEmailWithOtp(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  if (!user.otp || !user.otpExpiry) {
    throw new BadRequestError("No OTP was requested. Please log in again.");
  }
  if (isOtpExpired(user.otpExpiry)) {
    await repo.clearOtp(user._id);
    throw new UnauthorizedError("OTP has expired. Please log in again.");
  }
  if (user.otp !== otp) {
    throw new UnauthorizedError("Invalid OTP. Please check and try again.");
  }
  await repo.clearOtp(user._id);
  const { accessToken, refreshToken } = await issueTokens(user);
  log.info(`User logged in via 2FA: ${email}`);
  return authResponseDTO(accessToken, refreshToken, user);
};

const resendLoginOtp = async ({ email }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  const otp = generateOtp();
  const otpExpiry = generateOtpExpiry();
  await repo.saveOtp(user._id, otp, otpExpiry);
  await sendOtpEmail(user.email, otp);
  log.info(`Login OTP resent to ${email}`);
  return { email: user.email };
};

const sendOtp = async ({ email }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  const otp = generateOtp();
  const otpExpiry = generateOtpExpiry();
  await repo.saveOtp(user._id, otp, otpExpiry);
  await sendOtpEmail(email, otp);
  log.info(`OTP sent to ${email}`);
  return { email };
};

const verifyOtp = async ({ email, otp }) => {
  const user = await repo.findUserByEmailWithOtp(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  if (!user.otp || !user.otpExpiry) {
    throw new BadRequestError("No OTP was requested. Please request a new one.");
  }
  if (isOtpExpired(user.otpExpiry)) {
    await repo.clearOtp(user._id);
    throw new UnauthorizedError("OTP has expired. Please request a new one.");
  }
  if (user.otp !== otp) {
    throw new UnauthorizedError("Invalid OTP. Please check and try again.");
  }
  await repo.clearOtp(user._id);
  const { accessToken, refreshToken } = await issueTokens(user);
  log.info(`User logged in via OTP: ${email}`);
  return authResponseDTO(accessToken, refreshToken, user);
};

const forgotPassword = async ({ email }) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  const otp = generateOtp();
  const otpExpiry = generateOtpExpiry();
  await repo.saveOtp(user._id, otp, otpExpiry);
  await sendOtpEmail(email, otp);
  log.info(`Password reset OTP sent to ${email}`);
  return { email };
};

const verifyResetOtp = async ({ email, otp }) => {
  const user = await repo.findUserByEmailWithOtp(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  if (!user.otp || !user.otpExpiry) {
    throw new BadRequestError("No password reset was requested. Please start again.");
  }
  if (isOtpExpired(user.otpExpiry)) {
    await repo.clearOtp(user._id);
    throw new UnauthorizedError("OTP has expired. Please request a new one.");
  }
  if (user.otp !== otp) {
    throw new UnauthorizedError("Invalid OTP. Please check and try again.");
  }
  log.info(`Reset OTP verified for ${email}`);
  return { email, otp };
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await repo.findUserByEmailWithOtp(email);
  if (!user) {
    throw new NotFoundError("No account found with this email address.");
  }
  if (!user.otp || !user.otpExpiry) {
    throw new BadRequestError("Session expired. Please start the password reset again.");
  }
  if (isOtpExpired(user.otpExpiry)) {
    await repo.clearOtp(user._id);
    throw new UnauthorizedError("OTP has expired. Please start again.");
  }
  if (user.otp !== otp) {
    throw new UnauthorizedError("Invalid OTP. Password reset denied.");
  }
  const hashedPassword = await hashPassword(newPassword);
  await repo.updatePassword(user._id, hashedPassword);
  log.info(`Password reset successful for ${email}`);
  return { email };
};

const getMe = async (userId) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return userDTO(user);
};

const logout = async (userId) => {
  await repo.clearRefreshToken(userId);
  log.info(`User logged out: ${userId}`);
};

const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }
  const user = await repo.findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new UnauthorizedError("Refresh token is no longer valid. Please log in again.");
  }
  const tokens = await issueTokens(user);
  return authResponseDTO(tokens.accessToken, tokens.refreshToken, user);
};

module.exports = {
  register,
  login,
  verifyLoginOtp,
  resendLoginOtp,
  sendOtp,
  verifyOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getMe,
  logout,
  refresh,
};