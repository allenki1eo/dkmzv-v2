import { getDb, hashSecret, schema, type Database } from '@ebenezer/db';
import { eq } from 'drizzle-orm';
import type { RoleKey } from '@ebenezer/shared';
import { createOtpProvider, type OtpProvider } from './otp';

export type SessionUser = {
  id: string;
  phone: string;
  email: string | null;
  displayName: string;
  locale: 'sw' | 'en';
  roles: RoleKey[];
};

export type Context = {
  db: Database;
  otp: OtpProvider;
  user: SessionUser | null;
  sessionToken: string | null;
};

export async function createContext(opts: {
  sessionToken?: string | null;
  db?: Database;
  otp?: OtpProvider;
}): Promise<Context> {
  const db = opts.db ?? getDb();
  const otp = opts.otp ?? createOtpProvider();
  const sessionToken = opts.sessionToken ?? null;
  let user: SessionUser | null = null;

  if (sessionToken) {
    const tokenHash = hashSecret(sessionToken);
    const session = await db.query.sessions.findFirst({
      where: eq(schema.sessions.tokenHash, tokenHash),
    });
    if (session && !session.revokedAt && session.expiresAt > Date.now()) {
      const row = await db.query.users.findFirst({
        where: eq(schema.users.id, session.userId),
      });
      if (row && row.status === 'active' && !row.deletedAt) {
        user = {
          id: row.id,
          phone: row.phone,
          email: row.email,
          displayName: row.displayName,
          locale: row.locale,
          roles: [] as RoleKey[],
        };
        const roleRows = await db
          .select({ key: schema.roles.key })
          .from(schema.userRoles)
          .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
          .where(eq(schema.userRoles.userId, row.id));
        user.roles = roleRows.map((item) => item.key);
      }
    }
  }

  return { db, otp, user, sessionToken };
}
