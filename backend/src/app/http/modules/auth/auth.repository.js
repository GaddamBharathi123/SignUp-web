const User = require("../../../../database/user.model");

const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password +loginAttempts +lockedUntil");
};

const findUserById = async (id) => {
  return User.findById(id);
};

const saveRefreshToken = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
};

const clearRefreshToken = async (userId) => {
  return User.findByIdAndUpdate(userId, { refreshToken: null }, { new: true });
};

const findUserByRefreshToken = async (refreshToken) => {
  return User.findOne({ refreshToken }).select("+refreshToken");
};

const saveOtp = async (userId, otp, otpExpiry) => {
  return User.findByIdAndUpdate(userId, { otp, otpExpiry }, { new: true });
};

const findUserByEmailWithOtp = async (email) => {
  return User.findOne({ email }).select("+otp +otpExpiry");
};

const clearOtp = async (userId) => {
  return User.findByIdAndUpdate(userId, { otp: null, otpExpiry: null }, { new: true });
};

const incrementLoginAttempts = async (userId) => {
  return User.findByIdAndUpdate(userId, { $inc: { loginAttempts: 1 } }, { new: true });
};

const lockAccount = async (userId, lockedUntil) => {
  return User.findByIdAndUpdate(userId, { lockedUntil, loginAttempts: 0 }, { new: true });
};

const resetLoginAttempts = async (userId) => {
  return User.findByIdAndUpdate(userId, { loginAttempts: 0, lockedUntil: null }, { new: true });
};

const updatePassword = async (userId, hashedPassword) => {
  return User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, otp: null, otpExpiry: null },
    { new: true }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  saveRefreshToken,
  clearRefreshToken,
  findUserByRefreshToken,
  saveOtp,
  findUserByEmailWithOtp,
  clearOtp,
  incrementLoginAttempts,
  lockAccount,
  resetLoginAttempts,
  updatePassword,
};