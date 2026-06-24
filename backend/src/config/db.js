const mongoose = require("mongoose");
const environment = require("./environment");
const { createLogger } = require("../app/http/services/logger.service");

const log = createLogger("database");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(environment.database.uri);
    log.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    log.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  log.info("MongoDB disconnected");
};

module.exports = { connectDB, disconnectDB };