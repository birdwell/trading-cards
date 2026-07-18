import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (databaseUrl.startsWith("file:")) {
  throw new Error(
    "DATABASE_URL still points at SQLite. Set it to your Railway Postgres URL."
  );
}

const pool = new pg.Pool({ connectionString: databaseUrl });

export const db = drizzle(pool, { schema });

export * from "./schema";
