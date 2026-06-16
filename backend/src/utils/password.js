
const bcrypt = require("bcryptjs");

/** Number of bcrypt salt rounds. Higher = slower hash (more secure). */
const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * @param {string} plainPassword - The raw password from the user.
 * @returns {Promise<string>} The bcrypt hash to store in the database.
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compare a plain-text password against a stored hash.
 * @param {string} plainPassword - The raw password from the login request.
 * @param {string} hashedPassword - The hash retrieved from the database.
 * @returns {Promise<boolean>} True if they match, false otherwise.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };