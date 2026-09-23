import { randomBytes } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import {
  hashSecret,
  newId,
  now,
  schema,
  verifyPassword,
} from '@ebenezer/db';
import {
  officeLoginSchema,
  officeRoles,
  requestOtpSchema,
  verifyOtpSchema,
} from '@ebenezer/shared';
import { TRPCError } from '@trpc/server';
import { generateOtp } from '../otp';
import { protectedProcedure, publicProcedure, router } from '../trpc';

const OTP_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function sessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export const authRouter = router({
  requestOtp: publicProcedure.input(requestOtpSchema).mutation(async ({ ctx, input }) => {
    const code = generateOtp();
    await ctx.db.insert(schema.otpChallenges).values({
      id: newId(),
      phone: input.phone,
      codeHash: hashSecret(code),
      expiresAt: now() + OTP_TTL_MS,
      locale: input.locale,
    });
    await ctx.otp.send({ phone: input.phone, code, locale: input.locale });
    return {
      sent: true,
      masked: `${input.phone.slice(0, 6)}***${input.phone.slice(-3)}`,
      dev: ctx.otp.constructor.name === 'DevOtpProvider' ? code : undefined,
    };
  }),

  verifyOtp: publicProcedure.input(verifyOtpSchema).mutation(async ({ ctx, input }) => {
    const challenge = await ctx.db.query.otpChallenges.findFirst({
      where: and(
        eq(schema.otpChallenges.phone, input.phone),
        isNull(schema.otpChallenges.consumedAt),
      ),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    if (!challenge) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Omba namba ya siri kwanza.' });
    }
    if (challenge.expiresAt < now()) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Namba ya siri imeisha muda.' });
    }
    if (challenge.attempts >= MAX_ATTEMPTS) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Majaribio yamezidi.' });
    }
    if (challenge.codeHash !== hashSecret(input.code)) {
      await ctx.db
        .update(schema.otpChallenges)
        .set({ attempts: challenge.attempts + 1, updatedAt: now() })
        .where(eq(schema.otpChallenges.id, challenge.id));
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Namba ya siri si sahihi.' });
    }

    await ctx.db
      .update(schema.otpChallenges)
      .set({ consumedAt: now(), updatedAt: now() })
      .where(eq(schema.otpChallenges.id, challenge.id));

    let user = await ctx.db.query.users.findFirst({
      where: eq(schema.users.phone, input.phone),
    });

    if (!user) {
      if (!input.displayName) {
        return { needsName: true as const };
      }
      const id = newId();
      await ctx.db.insert(schema.users).values({
        id,
        phone: input.phone,
        displayName: input.displayName,
        locale: challenge.locale,
      });
      await ctx.db.insert(schema.members).values({
        id: newId(),
        userId: id,
        firstName: input.displayName.split(' ')[0] ?? input.displayName,
        lastName: input.displayName.split(' ').slice(1).join(' ') || 'Mwaminifu',
      });
      await ctx.db.insert(schema.memberSettings).values({
        id: newId(),
        userId: id,
      });
      user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.id, id),
      });
    }

    if (!user) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    const token = sessionToken();
    await ctx.db.insert(schema.sessions).values({
      id: newId(),
      userId: user.id,
      tokenHash: hashSecret(token),
      expiresAt: now() + SESSION_TTL_MS,
    });

    return {
      needsName: false as const,
      token,
      user: {
        id: user.id,
        displayName: user.displayName,
        phone: user.phone,
        locale: user.locale,
      },
    };
  }),

  officeLogin: publicProcedure.input(officeLoginSchema).mutation(async ({ ctx, input }) => {
    const credential = await ctx.db.query.adminCredentials.findFirst({
      where: eq(schema.adminCredentials.email, input.email.toLowerCase()),
    });
    if (!credential || !verifyPassword(input.password, credential.passwordHash)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Barua pepe au nenosiri si sahihi.',
      });
    }
    const user = await ctx.db.query.users.findFirst({
      where: eq(schema.users.id, credential.userId),
    });
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const roleRows = await ctx.db
      .select({ key: schema.roles.key })
      .from(schema.userRoles)
      .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
      .where(eq(schema.userRoles.userId, user.id));
    if (!roleRows.some((row) => officeRoles.includes(row.key))) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Akaunti hii haina ruhusa ya ofisi.' });
    }

    const token = sessionToken();
    await ctx.db.insert(schema.sessions).values({
      id: newId(),
      userId: user.id,
      tokenHash: hashSecret(token),
      expiresAt: now() + SESSION_TTL_MS,
    });
    return {
      token,
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        roles: roleRows.map((row) => row.key),
      },
    };
  }),

  me: publicProcedure.query(({ ctx }) => ctx.user),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.sessionToken) return { ok: true };
    await ctx.db
      .update(schema.sessions)
      .set({ revokedAt: now(), updatedAt: now() })
      .where(eq(schema.sessions.tokenHash, hashSecret(ctx.sessionToken)));
    return { ok: true };
  }),
});
