/**
 * modules/auth/auth.repository.js — Data Access Layer  (Infrastructure Layer)
 *
 * The ONLY place in the application that talks to MongoDB via Mongoose.
 * Services call repository methods; they never import Mongoose or the model directly.
 *
 * Equivalent to .NET's Repository pattern / IUserRepository.
 *
 * Rules:
 *  - No business logic here — just raw data operations.
 *  - Every method is async and uses await.
 *  - Throw errors upward; let the service/error-handler decide how to respond.
 */

const User = require("./auth.model");

/**
 * Create and persist a new user document.
 *
 * @param {{ name, email, password }} userData - Pre-hashed password expected.
 * @returns {Promise<User>} The saved Mongoose document.
 */
const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

/**
 * Find a user by email.
 * By default, `password` and `refreshToken` are excluded (select: false).
 *
 * @param {string} email
 * @returns {Promise<User|null>}
 */
const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Find a user by email AND include the hashed password field.
 * Used only during login to compare the submitted password.
 *
 * @param {string} email
 * @returns {Promise<User|null>}
 */
const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password");
};

/**
 * Find a user by their MongoDB _id.
 *
 * @param {string} id
 * @returns {Promise<User|null>}
 */
const findUserById = async (id) => {
  return User.findById(id);
};

/**
 * Save a refresh token against the user record.
 * Called after login / token refresh.
 *
 * @param {string} userId
 * @param {string} refreshToken - The raw (un-hashed) refresh JWT.
 * @returns {Promise<User|null>}
 */
const saveRefreshToken = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { new: true } // Return the updated document
  );
};

/**
 * Clear the refresh token from a user record (logout).
 *
 * @param {string} userId
 * @returns {Promise<User|null>}
 */
const clearRefreshToken = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true }
  );
};

/**
 * Find a user whose stored refreshToken matches the provided token.
 * Used during the /refresh flow to validate that the token is still active.
 *
 * @param {string} refreshToken
 * @returns {Promise<User|null>}
 */
const findUserByRefreshToken = async (refreshToken) => {
  // We must select("+refreshToken") because the field has select:false
  return User.findOne({ refreshToken }).select("+refreshToken");
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  saveRefreshToken,
  clearRefreshToken,
  findUserByRefreshToken,
};