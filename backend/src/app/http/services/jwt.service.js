const jwt = require("jsonwebtoken");
const environment = require("../../../config/environment");

const signAccessToken = (payload) =>
  jwt.sign(payload, environment.jwt.accessSecret, {
    expiresIn: environment.jwt.accessExpiresIn,
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, environment.jwt.refreshSecret, {
    expiresIn: environment.jwt.refreshExpiresIn,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, environment.jwt.accessSecret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, environment.jwt.refreshSecret);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};