/**
 * modules/auth/auth.service.js — Business Logic Layer  (Application Layer)
 *
 * Orchestrates the authentication flows by combining:
 *  - Repository (data access)
 *  - Password utilities (hashing / comparison)
 *  - JWT utilities (signing / verifying)
 *  - DTOs (shaping output)
 *
 * Controllers call services; services NEVER interact with req/res.
 * All domain errors are thrown as plain Error objects with a `statusCode`
 * property so the global error handler can format them correctly.
 *
 * Equivalent to .NET's Application Service / Use-Case classes.
 */

const repo = require("./auth.repository");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../utils/jwt");
const { userDTO, authResponseDTO } = require("./auth.dto");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Create a typed error with an HTTP status code.
 * Keeps throw sites concise: throw httpError(404, "Not found")
 */
const httpError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Generate both tokens for a user and persist the refresh token in the DB.
 */
const issueTokens = async (user) => {
  const payload = { id: user._id, email: user.email };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user._id });

  // Persist the refresh token so we can validate / revoke it later
  await repo.saveRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken };
};

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * register — Create a new user account.
 *
 * Flow:
 *  1. Check if email is already registered
 *  2. Hash the password
 *  3. Save the new user
 *  4. Return the safe user DTO (no tokens on register — user must log in)
 *
 * @param {{ name, email, password }} data
 * @returns {Promise<Object>} userDTO
 */
const register = async ({ name, email, password }) => {
  // 1. Prevent duplicate emails
  const existing = await repo.findUserByEmail(email);
  if (existing) {
    throw httpError(409, "An account with this email already exists.");
  }

  // 2. Hash the password before storing
  const hashedPassword = await hashPassword(password);

  // 3. Persist the new user
  const user = await repo.createUser({ name, email, password: hashedPassword });

  // 4. Return a safe representation (no tokens on register)
  return userDTO(user);
};

/**
 * login — Authenticate a user and issue JWT tokens.
 *
 * Flow:
 *  1. Find user by email (include password field)
 *  2. Compare submitted password with stored hash
 *  3. Sign access + refresh tokens
 *  4. Persist refresh token
 *  5. Return authResponseDTO
 *
 * @param {{ email, password }} credentials
 * @returns {Promise<Object>} authResponseDTO
 */
const login = async ({ email, password }) => {
  // 1. Fetch user — must explicitly select password since it's excluded by default
  const user = await repo.findUserByEmailWithPassword(email);
  if (!user) {
    // Deliberately vague to prevent email enumeration
    throw httpError(401, "Invalid email or password.");
  }

  // 2. Compare submitted password against stored bcrypt hash
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw httpError(401, "Invalid email or password.");
  }

  // 3 & 4. Sign tokens and persist the refresh token
  const { accessToken, refreshToken } = await issueTokens(user);

  // 5. Return tokens + safe user object
  return authResponseDTO(accessToken, refreshToken, user);
};

/**
 * getMe — Return the profile of the currently authenticated user.
 *
 * @param {string} userId - Comes from req.user.id set by auth middleware.
 * @returns {Promise<Object>} userDTO
 */
const getMe = async (userId) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw httpError(404, "User not found.");
  }
  return userDTO(user);
};

/**
 * logout — Invalidate the user's refresh token.
 *
 * Clearing the stored token means the refresh token can no longer be used
 * to obtain new access tokens, effectively ending the session.
 *
 * @param {string} userId - Comes from req.user.id set by auth middleware.
 */
const logout = async (userId) => {
  await repo.clearRefreshToken(userId);
};

/**
 * refresh — Issue a new access token using a valid refresh token.
 *
 * Flow:
 *  1. Verify the refresh token signature + expiry
 *  2. Look up the user by userId from the token payload
 *  3. Compare the submitted token against the one stored in DB
 *     (prevents replay attacks if the token was already rotated/revoked)
 *  4. Issue a new access token (and rotate the refresh token)
 *
 * @param {string} refreshToken - From the request body.
 * @returns {Promise<Object>} authResponseDTO with new tokens
 */
const refresh = async (refreshToken) => {
  // 1. Verify the JWT signature and expiry
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw httpError(401, "Invalid or expired refresh token.");
  }

  // 2. Find the user and fetch their stored refresh token
  const user = await repo.findUserByRefreshToken(refreshToken);
  if (!user) {
    // Token not in DB — either logged out or token was rotated
    throw httpError(401, "Refresh token is no longer valid. Please log in again.");
  }

  // 3 & 4. Issue new tokens (this also persists the new refresh token, rotating it)
  const { accessToken, newRefreshToken } = await (async () => {
    const tokens = await issueTokens(user);
    return { accessToken: tokens.accessToken, newRefreshToken: tokens.refreshToken };
  })();

  return authResponseDTO(accessToken, newRefreshToken, user);
};

module.exports = { register, login, getMe, logout, refresh };