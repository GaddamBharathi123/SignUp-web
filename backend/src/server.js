const { connectDB } = require("./config/db");
const { createLogger } = require("./app/http/services/logger.service");
const environment = require("./config/environment");
const app = require("./app");

const log = createLogger("server");

const startServer = async () => {
  try {
    await connectDB();
    app.listen(environment.basic.port, () => {
      log.info(`Server running on http://localhost:${environment.basic.port}`);
      log.info(`Environment: ${environment.basic.env}`);
    });
  } catch (error) {
    log.exception("Failed to start server", error);
    process.exit(1);
  }
};

startServer();