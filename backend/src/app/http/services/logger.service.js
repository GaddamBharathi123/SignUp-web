const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const environment = require("../../../config/environment");

const { level, enableFile, maxSize, maxFiles } = environment.logging;

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
    const ctx = context ? `[${context}]` : "";
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level} ${ctx} ${message}${extra}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [new winston.transports.Console({ format: consoleFormat })];

if (enableFile) {
  const logsDir = path.join(process.cwd(), "storage", "logs");
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize,
      maxFiles,
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize,
      maxFiles,
      format: fileFormat,
    })
  );
}

const baseLogger = winston.createLogger({ level, transports });

class Logger {
  constructor(context) {
    this.context = context;
  }

  info(message, meta = {}) {
    baseLogger.info(message, { context: this.context, ...meta });
  }

  error(message, meta = {}) {
    baseLogger.error(message, { context: this.context, ...meta });
  }

  warn(message, meta = {}) {
    baseLogger.warn(message, { context: this.context, ...meta });
  }

  debug(message, meta = {}) {
    baseLogger.debug(message, { context: this.context, ...meta });
  }

  exception(message, error, meta = {}) {
    baseLogger.error(message, {
      context: this.context,
      ...meta,
      error: { name: error.name, message: error.message, stack: error.stack },
    });
  }
}

const createLogger = (context) => new Logger(context);

module.exports = { createLogger };