#!/usr/bin/env node
/**
 * Applies the schema and the seed to a Supabase project.
 *
 *   SUPABASE_DB_URL='postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres' npm run db:push
 *
 * Uses the `postgres` client rather than shelling out to psql, which is not
 * installed on every machine this needs to run on. Both files are idempotent,
 * so this is safe to re-run against a project that is already partly built.
 */
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error(
    "SUPABASE_DB_URL is not set.\n" +
      "Find it in the Supabase dashboard under Settings -> Database -> Connection string (URI),\n" +
      "or paste supabase/migrations/0001_schema.sql and supabase/seed.sql into the SQL Editor by hand."
  );
  process.exit(1);
}

const files = ["supabase/migrations/0001_schema.sql", "supabase/seed.sql"];
const sql = postgres(url, { max: 1, onnotice: () => {} });

try {
  for (const file of files) {
    process.stdout.write(`applying ${file} ... `);
    await sql.unsafe(await readFile(file, "utf8"));
    console.log("ok");
  }

  const [{ count: spots }] = await sql`select count(*)::int as count from public.spots`;
  const [{ count: rooms }] = await sql`select count(*)::int as count from public.rooms`;
  const [{ count: reports }] = await sql`select count(*)::int as count from public.reports`;
  console.log(`\n${spots} spots, ${rooms} rooms, ${reports} reports.`);
  if (reports === 0) {
    console.log("No reports, which is correct for a fresh database — occupancy is crowdsourced.");
  }
} catch (error) {
  console.error("\nfailed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
