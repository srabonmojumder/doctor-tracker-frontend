import app from "./app";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";
import { ensureAdminSeeded, ensureSampleDataSeeded } from "./seed/seedData";

function registerShutdown() {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, shutting down...`);
    try {
      await disconnectDB();
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

async function start() {
  registerShutdown();

  await connectDB();
  await ensureAdminSeeded();
  if (!env.isProduction) {
    await ensureSampleDataSeeded();
  }

  app.listen(env.port, () => {
    console.log(`Doctor Tracker API listening on http://localhost:${env.port}`);
  });
}

start().catch(async (err) => {
  console.error("Failed to start server:", err);
  await disconnectDB().catch(() => undefined);
  process.exit(1);
});
