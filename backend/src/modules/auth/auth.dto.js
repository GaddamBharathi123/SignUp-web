

/**

 * @param {import('./auth.model')} 
 * @returns {Object} 
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
 * @param {string} 
 * @param {string} 
 * @param {import('./auth.model')} 
 * @returns {Object} 
 */
const authResponseDTO = (accessToken, refreshToken, user) => ({
  accessToken,
  refreshToken,
  user: userDTO(user),
});

module.exports = { userDTO, authResponseDTO };