import { appRouter, createContext } from '@ebenezer/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/server/trpc';

async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const jar = await cookies();
      return createContext({
        sessionToken: jar.get(SESSION_COOKIE)?.value ?? null,
      });
    },
  });
}

export { handler as GET, handler as POST };
