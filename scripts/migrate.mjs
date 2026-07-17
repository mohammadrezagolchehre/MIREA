import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

function loadLocalDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const envPath = resolve(".env.local");
  if (!existsSync(envPath)) return null;

  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((item) => item.startsWith("DATABASE_URL="));

  return line?.slice("DATABASE_URL=".length).trim() || null;
}

const databaseUrl = loadLocalDatabaseUrl();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const schema = readFileSync(resolve("database/neon-schema.sql"), "utf8");
const statements = schema
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);
const sql = neon(databaseUrl);

for (const statement of statements) {
  await sql.query(statement);
}

console.info(`Applied ${statements.length} database statements.`);
