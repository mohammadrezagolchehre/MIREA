import { neon } from "@neondatabase/serverless";

type DbRow = Record<string, unknown>;

let sqlClient: ReturnType<typeof neon> | null = null;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  return databaseUrl;
}

export function getSql() {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl());
  }

  return sqlClient;
}

export async function db<T = DbRow>(
  query: string,
  params: unknown[] = []
) {
  return getSql().query(query, params) as Promise<T[]>;
}
