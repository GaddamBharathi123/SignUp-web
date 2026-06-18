const User = require("./auth.model");

const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password");
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
};