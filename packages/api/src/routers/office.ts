import { and, desc, eq, isNull, like, sql } from 'drizzle-orm';
import { newId, now, schema } from '@ebenezer/db';
import { officeRoles } from '@ebenezer/shared';
import { z } from 'zod';
import { officeProcedure, router } from '../trpc';

async function audit(
  db: import('@ebenezer/db').Database,
  actorUserId: string,
  action: string,
  entity: string,
  entityId: string,
  after: unknown,
) {
  await db.insert(schema.auditLog).values({
    id: newId(),
    actorUserId,
    action,
    entity,
    entityId,
    afterJson: JSON.stringify(after),
  });
}

export const officeRouter = router({
  ping: officeProcedure(...officeRoles).query(({ ctx }) => ({
    ok: true,
    name: ctx.user.displayName,
    roles: ctx.user.roles,
  })),

  dashboard: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    const memberCount = await ctx.db
      .select({ members: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.members)
      .where(isNull(schema.members.deletedAt));
    const receivedRows = await ctx.db
      .select({ received: sql<number>`coalesce(sum(amount_tzs), 0)`.mapWith(Number) })
      .from(schema.transactions)
      .where(eq(schema.transactions.status, 'success'));
    const members = memberCount[0]?.members ?? 0;
    const received = receivedRows[0]?.received ?? 0;
    const live = await ctx.db.query.liveStreams.findFirst({
      where: eq(schema.liveStreams.status, 'live'),
    });
    const upcoming = await ctx.db
      .select()
      .from(schema.events)
      .where(isNull(schema.events.deletedAt))
      .orderBy(desc(schema.events.startsAt))
      .limit(4);
    return {
      members,
      receivedTzs: received,
      viewers: live?.viewerCount ?? 0,
      liveTitle: live?.titleSw ?? null,
      upcoming,
    };
  }),

  members: officeProcedure(...officeRoles)
    .input(z.object({ q: z.string().optional() }).default({}))
    .query(async ({ ctx, input }) => {
      const q = input?.q?.trim();
      const rows = await ctx.db
        .select({
          id: schema.members.id,
          firstName: schema.members.firstName,
          lastName: schema.members.lastName,
          status: schema.members.status,
          jumuiya: schema.jumuiya.name,
        })
        .from(schema.members)
        .leftJoin(schema.jumuiyaMembers, eq(schema.jumuiyaMembers.memberId, schema.members.id))
        .leftJoin(schema.jumuiya, eq(schema.jumuiya.id, schema.jumuiyaMembers.jumuiyaId))
        .where(
          and(
            isNull(schema.members.deletedAt),
            q ? like(schema.members.lastName, `%${q}%`) : undefined,
          ),
        )
        .limit(80);
      return rows;
    }),

  jumuiya: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    const groups = await ctx.db.select().from(schema.jumuiya).where(isNull(schema.jumuiya.deletedAt));
    const counts = await ctx.db
      .select({
        jumuiyaId: schema.jumuiyaMembers.jumuiyaId,
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(schema.jumuiyaMembers)
      .groupBy(schema.jumuiyaMembers.jumuiyaId);
    return groups.map((group) => ({
      ...group,
      members: counts.find((item) => item.jumuiyaId === group.id)?.total ?? 0,
    }));
  }),

  sermons: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.sermons)
      .where(isNull(schema.sermons.deletedAt))
      .orderBy(desc(schema.sermons.preachedOn));
  }),

  publishSermon: officeProcedure('mchungaji', 'media')
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(schema.sermons)
        .set({ status: 'published', publishedAt: now(), updatedAt: now() })
        .where(eq(schema.sermons.id, input.id));
      await audit(ctx.db, ctx.user.id, 'publish', 'sermons', input.id, { status: 'published' });
      return { ok: true };
    }),

  createSermon: officeProcedure('mchungaji', 'media')
    .input(
      z.object({
        titleSw: z.string().min(3),
        preacher: z.string().min(3),
        readings: z.string().min(3),
        preachedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = newId();
      await ctx.db.insert(schema.sermons).values({
        id,
        titleSw: input.titleSw,
        titleEn: input.titleSw,
        preacher: input.preacher,
        readings: input.readings,
        preachedOn: input.preachedOn,
        status: 'draft',
      });
      await audit(ctx.db, ctx.user.id, 'create', 'sermons', id, input);
      return { id };
    }),

  live: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    return ctx.db.select().from(schema.liveStreams).orderBy(desc(schema.liveStreams.startsAt));
  }),

  setLive: officeProcedure('mchungaji', 'media')
    .input(z.object({ id: z.string(), status: z.enum(['scheduled', 'live', 'ended']) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(schema.liveStreams)
        .set({
          status: input.status,
          viewerCount: input.status === 'live' ? 86 : 0,
          updatedAt: now(),
        })
        .where(eq(schema.liveStreams.id, input.id));
      await audit(ctx.db, ctx.user.id, 'set-live', 'live_streams', input.id, input);
      return { ok: true };
    }),

  ledger: officeProcedure('mchungaji', 'mhazini', 'msomaji')
    .query(async ({ ctx }) => {
      const rows = await ctx.db
        .select({
          id: schema.transactions.id,
          amountTzs: schema.transactions.amountTzs,
          status: schema.transactions.status,
          network: schema.transactions.network,
          createdAt: schema.transactions.createdAt,
          category: schema.givingCategories.nameSw,
          anonymous: schema.transactions.anonymous,
        })
        .from(schema.transactions)
        .innerJoin(schema.givingCategories, eq(schema.transactions.categoryId, schema.givingCategories.id))
        .orderBy(desc(schema.transactions.createdAt))
        .limit(40);
      const byCategory = await ctx.db
        .select({
          category: schema.givingCategories.nameSw,
          total: sql<number>`coalesce(sum(${schema.transactions.amountTzs}), 0)`.mapWith(Number),
        })
        .from(schema.transactions)
        .innerJoin(schema.givingCategories, eq(schema.transactions.categoryId, schema.givingCategories.id))
        .where(eq(schema.transactions.status, 'success'))
        .groupBy(schema.givingCategories.nameSw);
      return { rows, byCategory };
    }),

  cashOffering: officeProcedure('mchungaji', 'mhazini')
    .input(
      z.object({
        amountTzs: z.number().int().positive(),
        categoryKey: z.enum(['sadaka', 'zaka', 'shukrani', 'ahadi', 'mradi']),
        note: z.string().max(160).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.givingCategories.findFirst({
        where: eq(schema.givingCategories.key, input.categoryKey),
      });
      if (!category) throw new Error('Aina haipo');
      const id = newId();
      const key = `cash-${id}`;
      await ctx.db.insert(schema.transactions).values({
        id,
        categoryId: category.id,
        amountTzs: input.amountTzs,
        status: 'success',
        network: 'cash',
        provider: 'taslimu',
        providerRef: key,
        idempotencyKey: key,
        note: input.note,
      });
      const counted = await ctx.db
        .select({ total: sql<number>`count(*)`.mapWith(Number) })
        .from(schema.receipts);
      await ctx.db.insert(schema.receipts).values({
        id: newId(),
        transactionId: id,
        number: `EB-2026-${String((counted[0]?.total ?? 0) + 1).padStart(4, '0')}`,
      });
      await audit(ctx.db, ctx.user.id, 'cash', 'transactions', id, input);
      return { id };
    }),

  announcements: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.announcements)
      .where(isNull(schema.announcements.deletedAt))
      .orderBy(desc(schema.announcements.publishAt));
  }),

  createAnnouncement: officeProcedure('mchungaji', 'katibu')
    .input(
      z.object({
        titleSw: z.string().min(3),
        bodySw: z.string().min(3),
        channel: z.enum(['push', 'sms', 'both']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = newId();
      await ctx.db.insert(schema.announcements).values({
        id,
        titleSw: input.titleSw,
        titleEn: input.titleSw,
        bodySw: input.bodySw,
        bodyEn: input.bodySw,
        status: 'sent',
        channel: input.channel,
        publishAt: now(),
        createdBy: ctx.user.id,
      });
      await audit(ctx.db, ctx.user.id, 'announce', 'announcements', id, input);
      return { id };
    }),

  calendar: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    const liturgy = await ctx.db.select().from(schema.liturgicalCalendar);
    const events = await ctx.db.select().from(schema.events).where(isNull(schema.events.deletedAt));
    return { liturgy, events };
  }),

  profile: officeProcedure(...officeRoles).query(async ({ ctx }) => {
    const church = await ctx.db.query.churchProfile.findFirst();
    const log = await ctx.db.select().from(schema.auditLog).orderBy(desc(schema.auditLog.createdAt)).limit(12);
    return { church, log, user: ctx.user };
  }),
});
