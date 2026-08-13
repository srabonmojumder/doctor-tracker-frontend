import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import type { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env";

let memoryServer: MongoMemoryServer | undefined;

export async function connectDB(): Promise<void> {
  let uri = env.mongodbUri;

  if (!uri) {
    if (env.isProduction) {
      throw new Error("MONGODB_URI must be set in production");
    }
    // Zero-config local development: run a real MongoDB binary managed by
    // mongodb-memory-server, persisted to a local dbPath so data survives
    // dev-server restarts instead of resetting every time.
    const dbPath = path.join(process.cwd(), ".data", "mongodb");
    fs.mkdirSync(dbPath, { recursive: true });

    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create({
      instance: { dbPath, storageEngine: "wiredTiger" },
    });
    uri = memoryServer.getUri("doctor-tracker");
    console.log("No MONGODB_URI set - using a local managed MongoDB instance for development.");
  }

  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

// Ensures the managed mongod child process is always stopped, even on crashes
// or restarts - otherwise it lingers and holds a lock on the data directory.
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}
