import { officeRoles } from '@ebenezer/shared';
import { auditTheme, seasons } from '@ebenezer/tokens';
import { authRouter } from './routers/auth';
import { liturgyRouter } from './routers/liturgy';
import { officeProcedure, publicProcedure, router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  liturgy: liturgyRouter,
  design: router({
    tokens: publicProcedure.query(() => ({
      seasons,
      contrast: {
        light: auditTheme('light'),
        dark: auditTheme('dark'),
      },
    })),
  }),
  office: router({
    ping: officeProcedure(...officeRoles).query(({ ctx }) => ({
      ok: true,
      name: ctx.user.displayName,
      roles: ctx.user.roles,
    })),
  }),
});

export type AppRouter = typeof appRouter;
