import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';
import type { RoleKey } from '@ebenezer/shared';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Ingia tena.' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export function officeProcedure(...allowed: RoleKey[]) {
  return protectedProcedure.use(({ ctx, next }) => {
    const ok = ctx.user.roles.some((role) => allowed.includes(role));
    if (!ok) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Huna ruhusa ya ofisi kwa kitendo hiki.',
      });
    }
    return next({ ctx });
  });
}
