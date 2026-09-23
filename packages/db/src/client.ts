import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema/index';

const here = dirname(fileURLToPath(import.meta.url));
const localFile = resolve(here, '../local.db');

let cached: { sqlite: Client; db: LibSQLDatabase<typeof schema> } | null = null;

export function databaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (raw && !raw.startsWith('file:')) return raw;
  if (raw?.startsWith('file:/')) return raw;
  return `file:${localFile}`;
}

export function getDb() {
  if (cached) return cached.db;
  const sqlite = createClient({
    url: databaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(sqlite, { schema });
  cached = { sqlite, db };
  return db;
}

export type Database = ReturnType<typeof getDb>;
export { schema };
