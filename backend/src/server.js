const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");
const app = require("./app");

const startServer = async () => {
  try {
    // 1. Establish MongoDB connection before accepting traffic
    await connectDB();

    // 2. Start listening
    app.listen(PORT, () => {
      console.log(`✅  Server running on http://localhost:${PORT}`);
      console.log(`🌍  Environment : ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌  Failed to start server:", error.message);
    process.exit(1); // Exit with failure code so process managers can restart
  }
};

startServer();