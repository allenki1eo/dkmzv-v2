import { auditTheme, seasons } from '@ebenezer/tokens';
import { loadParishHome } from './parish-home';
import { authRouter } from './routers/auth';
import { givingRouter } from './routers/giving';
import { liturgyRouter } from './routers/liturgy';
import { officeRouter } from './routers/office';
import { publicProcedure, router } from './trpc';

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
  parish: router({
    home: publicProcedure.query(({ ctx }) => loadParishHome(ctx.db)),
  }),
  giving: givingRouter,
  office: officeRouter,
});

export type AppRouter = typeof appRouter;
