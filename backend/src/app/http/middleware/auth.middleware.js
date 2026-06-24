const { verifyAccessToken } = require("../services/jwt.service");
const { sendError } = require("../services/response.service");
const ERROR_CODES = require("../../core/constants/http.constants");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Access token required.", ERROR_CODES.SESSION_NOT_VALID);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired. Please refresh your session.", ERROR_CODES.SESSION_EXPIRED);
    }
    return sendError(res, 401, "Invalid token. Authentication failed.", ERROR_CODES.TOKEN_INVALID);
  }
};

module.exports = { protect };