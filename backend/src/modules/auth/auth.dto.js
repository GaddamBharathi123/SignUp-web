

/**

 * @param {import('./auth.model')} user - A Mongoose User document.
 * @returns {Object} Safe user object.
 */
const userDTO = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 *
 * @param {string} accessToken  - Short-lived JWT.
 * @param {string} refreshToken - Long-lived JWT.
 * @param {import('./auth.model')} user - Mongoose User document.
 * @returns {Object} Login response payload.
 */
const authResponseDTO = (accessToken, refreshToken, user) => ({
  accessToken,
  refreshToken,
  user: userDTO(user),
});

module.exports = { userDTO, authResponseDTO };