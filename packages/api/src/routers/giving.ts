import { and, desc, eq, sql } from 'drizzle-orm';
import { newId, now, schema, type Database } from '@ebenezer/db';
import { nextLedgerStatus, receiptNumber, startGivingSchema, webhookSchema } from '@ebenezer/shared';
import { TRPCError } from '@trpc/server';
import { paymentProvider } from '../payments';
import { protectedProcedure, publicProcedure, router } from '../trpc';

async function settle(
  db: Database,
  idempotencyKey: string,
  incoming: 'pending' | 'success' | 'failed' | 'reversed',
) {
  const existing = await db.query.transactions.findFirst({
    where: eq(schema.transactions.idempotencyKey, idempotencyKey),
  });
  if (!existing) return null;
  const status = nextLedgerStatus(existing.status, incoming);
  if (status !== existing.status) {
    await db
      .update(schema.transactions)
      .set({ status, updatedAt: now() })
      .where(eq(schema.transactions.id, existing.id));
  }
  if (status === 'success') {
    const receipt = await db.query.receipts.findFirst({
      where: eq(schema.receipts.transactionId, existing.id),
    });
    if (!receipt) {
      const counted = await db
        .select({ total: sql<number>`count(*)`.mapWith(Number) })
        .from(schema.receipts);
      await db.insert(schema.receipts).values({
        id: newId(),
        transactionId: existing.id,
        number: receiptNumber((counted[0]?.total ?? 0) + 1),
      });
    }
  }
  const fresh = await db.query.transactions.findFirst({
    where: eq(schema.transactions.id, existing.id),
  });
  const receipt = fresh
    ? await db.query.receipts.findFirst({
        where: eq(schema.receipts.transactionId, fresh.id),
      })
    : null;
  return { transaction: fresh, receipt };
}

export const givingRouter = router({
  start: protectedProcedure.input(startGivingSchema).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.query.transactions.findFirst({
      where: eq(schema.transactions.idempotencyKey, input.idempotencyKey),
    });
    if (existing) {
      const receipt = await ctx.db.query.receipts.findFirst({
        where: eq(schema.receipts.transactionId, existing.id),
      });
      return { transaction: existing, receipt, replayed: true };
    }

    const category = await ctx.db.query.givingCategories.findFirst({
      where: eq(schema.givingCategories.key, input.categoryKey),
    });
    if (!category) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Aina ya sadaka haipo.' });
    }

    const member = await ctx.db.query.members.findFirst({
      where: eq(schema.members.userId, ctx.user.id),
    });

    const provider = paymentProvider();
    const pushed = await provider.stkPush({
      phone: input.phone,
      amountTzs: input.amountTzs,
      idempotencyKey: input.idempotencyKey,
      reference: `EB-${input.categoryKey}`,
    });

    await ctx.db.insert(schema.transactions).values({
      id: newId(),
      memberId: member?.id,
      categoryId: category.id,
      amountTzs: input.amountTzs,
      status: 'pending',
      network: input.network,
      provider: provider.name,
      providerRef: pushed.providerRef,
      idempotencyKey: input.idempotencyKey,
      anonymous: input.anonymous,
    });

    return { ...(await settle(ctx.db, input.idempotencyKey, 'pending')), replayed: false };
  }),

  status: publicProcedure
    .input(webhookSchema.pick({ idempotencyKey: true }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.db.query.transactions.findFirst({
        where: eq(schema.transactions.idempotencyKey, input.idempotencyKey),
      });
      if (!row) return null;
      const age = now() - row.createdAt;
      if (row.status === 'pending' && row.provider === 'ebenezer-dev' && age > 1200) {
        return settle(ctx.db, input.idempotencyKey, 'success');
      }
      const receipt = await ctx.db.query.receipts.findFirst({
        where: eq(schema.receipts.transactionId, row.id),
      });
      return { transaction: row, receipt };
    }),

  history: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db.query.members.findFirst({
      where: eq(schema.members.userId, ctx.user.id),
    });
    if (!member) return [];
    return ctx.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.memberId, member.id))
      .orderBy(desc(schema.transactions.createdAt))
      .limit(30);
  }),

  applyWebhook: publicProcedure.input(webhookSchema).mutation(async ({ ctx, input }) => {
    const row = await ctx.db.query.transactions.findFirst({
      where: and(
        eq(schema.transactions.idempotencyKey, input.idempotencyKey),
        eq(schema.transactions.providerRef, input.providerRef),
      ),
    });
    if (!row) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Muamala haujapatikana.' });
    }
    if (row.amountTzs !== input.amountTzs) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Kiasi hakilingani na daftari.' });
    }
    return settle(ctx.db, input.idempotencyKey, input.status);
  }),
});
