const { verifyAccessToken } = require("../utils/jwt");
const { sendError } = require("../utils/response");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired. Please refresh your session.");
    }
    return sendError(res, 401, "Invalid token. Authentication failed.");
  }
};

module.exports = { protect };