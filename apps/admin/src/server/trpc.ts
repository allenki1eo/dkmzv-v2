import { appRouter, createContext } from '@ebenezer/api';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'ebenezer_session';

export async function getServerCaller() {
  const jar = await cookies();
  const sessionToken = jar.get(SESSION_COOKIE)?.value ?? null;
  const ctx = await createContext({ sessionToken });
  return {
    caller: appRouter.createCaller(ctx),
    user: ctx.user,
  };
}
