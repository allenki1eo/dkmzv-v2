import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@ebenezer/api';

export const trpc = createTRPCReact<AppRouter>();
