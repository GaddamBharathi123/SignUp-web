const authService = require("./auth.service");
const { sendSuccess } = require("../../utils/response");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    return sendSuccess(res, 201, "Account created successfully.", user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    return sendSuccess(res, 200, `OTP sent to ${data.email}. Please verify to complete login.`, data);
  } catch (error) {
    next(error);
  }
};

const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const data = await authService.verifyLoginOtp({ email, otp });
    return sendSuccess(res, 200, "Login successful.", data);
  } catch (error) {
    next(error);
  }
};

const resendLoginOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await authService.resendLoginOtp({ email });
    return sendSuccess(res, 200, `A new OTP has been sent to ${data.email}.`);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, 200, "User profile fetched.", user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    return sendSuccess(res, 200, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    return sendSuccess(res, 200, "Token refreshed successfully.", data);
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await authService.sendOtp({ email });
    return sendSuccess(res, 200, `OTP sent successfully to ${data.email}.`);
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const data = await authService.verifyOtp({ email, otp });
    return sendSuccess(res, 200, "OTP verified successfully.", data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyLoginOtp,
  resendLoginOtp,
  getMe,
  logout,
  refresh,
  sendOtp,
  verifyOtp,
};