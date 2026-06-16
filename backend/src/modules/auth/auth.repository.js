
const User = require("./auth.model");

/**

 * @param {{ name, email, password }} 
 * @returns {Promise<User>} 
 */
const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

/**

 * @param {string} email
 * @returns {Promise<User|null>}
 */
const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**

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
 
 * @param {string} userId
 * @param {string} 
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
 
 * @param {string} refreshToken
 * @returns {Promise<User|null>}
 */
const findUserByRefreshToken = async (refreshToken) => {
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