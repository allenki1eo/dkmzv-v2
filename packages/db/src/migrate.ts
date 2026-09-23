import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { databaseUrl } from './client';

const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const sqlite = createClient({
    url: databaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(sqlite);
  await migrate(db, { migrationsFolder: resolve(here, '../drizzle') });
  sqlite.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
