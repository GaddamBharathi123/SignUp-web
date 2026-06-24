const userDTO = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const authResponseDTO = (accessToken, refreshToken, user) => ({
  accessToken,
  refreshToken,
  user: userDTO(user),
});

module.exports = { userDTO, authResponseDTO };