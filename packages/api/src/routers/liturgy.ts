import { seasons } from '@ebenezer/tokens';
import { resolveLiturgicalDay, type LiturgicalDay } from '@ebenezer/shared';
import { desc } from 'drizzle-orm';
import { schema } from '@ebenezer/db';
import { publicProcedure, router } from '../trpc';

export const liturgyRouter = router({
  today: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(schema.liturgicalCalendar)
      .orderBy(desc(schema.liturgicalCalendar.startsOn));

    const mapped: LiturgicalDay[] = rows.map((row) => ({
      startsOn: row.startsOn,
      endsOn: row.endsOn,
      season: row.season,
      sundayNameSw: row.sundayNameSw,
      sundayNameEn: row.sundayNameEn,
      readings: row.readings,
    }));

    const today = resolveLiturgicalDay(mapped, new Date());
    const season = today ? seasons[today.season] : seasons.ordinary;
    return {
      today,
      season: {
        key: today?.season ?? 'ordinary',
        hex: today
          ? (rows.find((row) => row.id && row.startsOn === today.startsOn)?.colorOverride ??
            season.hex)
          : season.hex,
        sw: season.sw,
        en: season.en,
      },
    };
  }),

  calendar: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(schema.liturgicalCalendar);
  }),

  verseToday: publicProcedure.query(async ({ ctx }) => {
    const forDate = new Date().toISOString().slice(0, 10);
    const exact = await ctx.db.query.dailyVerses.findFirst({
      where: (table, { eq }) => eq(table.forDate, forDate),
    });
    if (exact) return exact;
    return ctx.db.query.dailyVerses.findFirst({
      orderBy: (table, { desc: d }) => [d(table.forDate)],
    });
  }),
});
