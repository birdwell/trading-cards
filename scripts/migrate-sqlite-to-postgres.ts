/**
 * One-time helper: copy catalog data from local SQLite into Railway Postgres.
 * Ownership is not migrated (it becomes per-user via Clerk).
 *
 * Usage: pnpm exec tsx scripts/migrate-sqlite-to-postgres.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import pg from "pg";

async function main() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    throw new Error("Set DATABASE_URL to your Postgres connection string first");
  }

  const sqlite = createClient({ url: "file:./database.db" });
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const sets = await sqlite.execute("SELECT id, name, year, source_file, sport FROM sets");
    const cards = await sqlite.execute(
      "SELECT id, card_number, player_name, card_type, set_id FROM cards"
    );

    console.log(`Found ${sets.rows.length} sets and ${cards.rows.length} cards in SQLite`);

    await pool.query("BEGIN");
    await pool.query("TRUNCATE TABLE user_cards, cards, sets RESTART IDENTITY CASCADE");

    for (const row of sets.rows) {
      await pool.query(
        `INSERT INTO sets (id, name, year, source_file, sport)
         VALUES ($1, $2, $3, $4, $5)`,
        [row.id, row.name, row.year, row.source_file, row.sport]
      );
    }

    for (const row of cards.rows) {
      await pool.query(
        `INSERT INTO cards (id, card_number, player_name, card_type, set_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          row.id,
          row.card_number,
          row.player_name,
          row.card_type,
          row.set_id,
        ]
      );
    }

    await pool.query(
      `SELECT setval(pg_get_serial_sequence('sets', 'id'), COALESCE((SELECT MAX(id) FROM sets), 1))`
    );
    await pool.query(
      `SELECT setval(pg_get_serial_sequence('cards', 'id'), COALESCE((SELECT MAX(id) FROM cards), 1))`
    );

    await pool.query("COMMIT");
    console.log("Migration complete");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  } finally {
    sqlite.close();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
