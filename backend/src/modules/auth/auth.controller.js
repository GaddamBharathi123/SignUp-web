
const authService = require("./auth.service");
const { sendSuccess, sendError } = require("../../utils/response");

/**
 * @route  
 * @access  
 * @desc    
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });

    return sendSuccess(res, 201, "Account created successfully.", user);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   
 * @access  
 * @desc   
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });

    return sendSuccess(res, 200, "Login successful.", data);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   
 * @access  
 * @desc     
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the `protect` middleware
    const user = await authService.getMe(req.user.id);

    return sendSuccess(res, 200, "User profile fetched.", user);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   
 * @access  
 * @desc    
 */
const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);

    return sendSuccess(res, 200, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @route  
 * @access  
 * @desc    
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);

    return sendSuccess(res, 200, "Token refreshed successfully.", data);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout, refresh };