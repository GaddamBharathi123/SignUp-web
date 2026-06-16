/**
 * utils/jwt.js — JSON Web Token Helpers
 *
 * Centralises all JWT operations so that:
 *  - Secret keys and expiry values are never scattered across files.
 *  - Swapping the signing algorithm is a one-line change.
 *
 * Access Token  — short-lived (15 min), sent in Authorization header.
 * Refresh Token — long-lived (7 days), stored in DB, used to mint new access tokens.
 */

const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/env");

/**
 * Sign an Access Token.
 * @param {Object} payload - Data to embed (e.g. { id, email }).
 * @returns {string} Signed JWT string.
 */
const signAccessToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN, // default "15m"
  });
};

/**
 * Sign a Refresh Token.
 * @param {Object} payload - Data to embed (typically just { id }).
 * @returns {string} Signed JWT string.
 */
const signRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN, // default "7d"
  });
};

/**
 * Verify an Access Token.
 * @param {string} token - JWT string from the Authorization header.
 * @returns {Object} Decoded payload if valid.
 * @throws {JsonWebTokenError|TokenExpiredError} if invalid or expired.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

/**
 * Verify a Refresh Token.
 * @param {string} token - JWT string from the request body.
 * @returns {Object} Decoded payload if valid.
 * @throws {JsonWebTokenError|TokenExpiredError} if invalid or expired.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};