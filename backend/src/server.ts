import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/db.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      console.log(`API running on ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server: ", error);
    process.exit(1);
  }
};

startServer();
