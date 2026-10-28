
import "dotenv/config";
import app from "./src/app.js";
import ConnectDB from "./src/db/DB.js";

const PORT = process.env.PORT || 5000;

let server;

const StartServer = async () => {
  try {
    await ConnectDB();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(async () => {
    try {
      const mongoose = await import("mongoose");
      await mongoose.default.connection.close();
      console.log("MongoDB connection closed");
      console.log("Server closed");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error.message);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

StartServer();