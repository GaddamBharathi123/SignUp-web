const { createLogger } = require("../services/logger.service");

const log = createLogger("http");

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.socket?.remoteAddress;

    const logFn = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    log[logFn](`${method} ${url} ${status} ${duration}ms`, { ip });
  });

  next();
};

module.exports = { loggingMiddleware };