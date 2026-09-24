import { seasons } from '@ebenezer/tokens';
import { jumuiyaPlaces, resolveLiturgicalDay, type ParishHome, type SeasonKey } from '@ebenezer/shared';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { schema, type Database } from '@ebenezer/db';

function seasonHex(key: string, override?: string | null): string {
  if (override) return override;
  if (key in seasons) return seasons[key as SeasonKey].hex;
  return seasons.ordinary.hex;
}

export async function loadParishHome(db: Database): Promise<ParishHome> {
  const days = await db.select().from(schema.liturgicalCalendar).orderBy(desc(schema.liturgicalCalendar.startsOn));
  const today = resolveLiturgicalDay(
    days.map((day) => ({
      startsOn: day.startsOn,
      endsOn: day.endsOn,
      season: day.season,
      sundayNameSw: day.sundayNameSw,
      sundayNameEn: day.sundayNameEn,
      readings: day.readings,
    })),
  );
  const seasonKey = today?.season ?? 'ordinary';
  const season = seasons[seasonKey];
  const matched = days.find((day) => day.startsOn === today?.startsOn && day.sundayNameSw === today.sundayNameSw);

  const forDate = new Date().toISOString().slice(0, 10);
  const verse =
    (await db.query.dailyVerses.findFirst({ where: eq(schema.dailyVerses.forDate, forDate) })) ??
    (await db.query.dailyVerses.findFirst({ orderBy: desc(schema.dailyVerses.forDate) }));

  const live = await db.query.liveStreams.findFirst({
    where: eq(schema.liveStreams.status, 'live'),
  });

  const nextEvent = await db.query.events.findFirst({
    where: and(eq(schema.events.kind, 'ibada'), isNull(schema.events.deletedAt)),
    orderBy: desc(schema.events.startsAt),
  });

  const announcementRows = await db
    .select()
    .from(schema.announcements)
    .where(isNull(schema.announcements.deletedAt))
    .orderBy(desc(schema.announcements.publishAt))
    .limit(8);

  const jumuiyaRows = await db.select().from(schema.jumuiya).where(isNull(schema.jumuiya.deletedAt));
  const memberCounts = await db
    .select({
      jumuiyaId: schema.jumuiyaMembers.jumuiyaId,
      total: sql<number>`count(*)`.mapWith(Number),
    })
    .from(schema.jumuiyaMembers)
    .groupBy(schema.jumuiyaMembers.jumuiyaId);

  const sermonRows = await db
    .select()
    .from(schema.sermons)
    .where(and(eq(schema.sermons.status, 'published'), isNull(schema.sermons.deletedAt)))
    .orderBy(desc(schema.sermons.preachedOn))
    .limit(20);

  const series = await db.select().from(schema.sermonSeries);
  const categories = await db.select().from(schema.givingCategories);

  return {
    source: 'network',
    season: {
      key: seasonKey,
      sw: season.sw,
      en: season.en,
      hex: seasonHex(seasonKey, matched?.colorOverride),
      sundaySw: today?.sundayNameSw ?? season.sw,
      sundayEn: today?.sundayNameEn ?? season.en,
      readings: today?.readings ?? nextEvent?.readings ?? '',
    },
    verse: {
      reference: verse?.reference ?? '1 Samweli 7:12',
      textSw: verse?.textSw ?? 'Hata sasa BWANA ametusaidia.',
      textEn: verse?.textEn ?? 'Thus far the LORD has helped us.',
    },
    live: live
      ? {
          titleSw: live.titleSw,
          titleEn: live.titleEn,
          viewers: live.viewerCount,
          liturgySw: live.liturgySw ?? '',
          readings: live.readings ?? '',
        }
      : null,
    nextService: {
      titleSw: nextEvent?.titleSw ?? 'Ibada ya Jumapili',
      titleEn: nextEvent?.titleEn ?? 'Sunday service',
      whenSw: 'Jumapili, saa 1:00 asubuhi',
      whenEn: 'Sunday, 7:00 in the morning',
      preacher: nextEvent?.preacher ?? 'Mchungaji Yohana Mwanga',
      readings: nextEvent?.readings ?? '',
      place: nextEvent?.place ?? 'Kanisa kuu',
    },
    announcements: announcementRows.map((row) => ({
      id: row.id,
      titleSw: row.titleSw,
      titleEn: row.titleEn,
      bodySw: row.bodySw,
      bodyEn: row.bodyEn,
      whenSw: 'Usharika',
    })),
    reminders: [
      { id: 'sala', titleSw: 'Sala ya asubuhi', titleEn: 'Morning prayer', time: '06:00' },
      { id: 'jumuiya', titleSw: 'Kikao cha jumuiya', titleEn: 'Jumuiya meeting', time: '16:00' },
    ],
    jumuiya: jumuiyaRows.map((row) => {
      const place = jumuiyaPlaces[row.name];
      return {
        id: row.id,
        name: row.name,
        leader: 'Kiongozi',
        day: row.meetingDay ?? '',
        place: row.meetingPlace ?? '',
        members: memberCounts.find((item) => item.jumuiyaId === row.id)?.total ?? 0,
        street: place?.street,
        lat: place?.lat,
        lng: place?.lng,
        weekday: place?.weekday,
      };
    }),
    sermons: sermonRows.map((row) => {
      const parent = series.find((item) => item.id === row.seriesId);
      return {
        id: row.id,
        titleSw: row.titleSw,
        titleEn: row.titleEn,
        preacher: row.preacher,
        preachedOn: row.preachedOn,
        readings: row.readings ?? '',
        notesSw: row.notesSw ?? '',
        notesEn: row.notesEn ?? '',
        seriesSw: parent?.titleSw ?? '',
        seriesEn: parent?.titleEn ?? '',
        minutes: 18,
      };
    }),
    categories: categories.map((row) => ({
      key: row.key,
      nameSw: row.nameSw,
      nameEn: row.nameEn,
    })),
  };
}
