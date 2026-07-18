#!/usr/bin/env node

import "dotenv/config";
import { execSync } from "child_process";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

if (process.env.DATABASE_URL.startsWith("file:")) {
  console.error(
    "DATABASE_URL still points at SQLite. Set it to your Railway Postgres URL."
  );
  process.exit(1);
}

console.log("Pushing database schema to Postgres...");
try {
  execSync("pnpm exec drizzle-kit push", { stdio: "inherit" });
  console.log("Database schema sync completed successfully!");
} catch (error) {
  console.error(
    "Database schema sync failed:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
}
