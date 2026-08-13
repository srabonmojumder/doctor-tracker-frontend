import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { ensureAdminSeeded, ensureSampleDataSeeded } from "./seedData";

// CLI entry point: `npm run seed`. Useful for seeding a real MongoDB/Atlas
// database (production/staging) since the auto-seed on server boot only
// inserts sample doctors/patients when NODE_ENV isn't production.
async function run() {
  await connectDB();
  await ensureAdminSeeded();
  await ensureSampleDataSeeded();
  await mongoose.disconnect();
  console.log("Seeding complete.");
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
