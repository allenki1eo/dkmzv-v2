import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword } from './crypto';
import { newId, now } from './ids';
import * as tables from './schema/index';
import { databaseUrl } from './client';

const here = dirname(fileURLToPath(import.meta.url));
const stamp = now();

const firstNames = [
  'Neema',
  'Amani',
  'Baraka',
  'Rehema',
  'Yohana',
  'Maria',
  'Petro',
  'Esther',
  'Daudi',
  'Grace',
  'Joseph',
  'Asha',
  'Daniel',
  'Faraja',
  'Luka',
  'Sarah',
  'Emmanuel',
  'Joyce',
  'Samuel',
  'Upendo',
];

const lastNames = [
  'Mwanga',
  'Kimaro',
  'Ngowi',
  'Mushi',
  'Lyimo',
  'Swai',
  'Msuya',
  'Tarimo',
  'Kileo',
  'Mosha',
];

const jumuiyaSeed = [
  { name: 'Amani', meetingDay: 'Jumatano', meetingPlace: 'Nyumba ya Mama Neema, Mbezi' },
  { name: 'Upendo', meetingDay: 'Alhamisi', meetingPlace: 'Ukumbi mdogo, kanisa' },
  { name: 'Imani', meetingDay: 'Jumanne', meetingPlace: 'Nyumba ya Ndugu Petro, Tegeta' },
  { name: 'Tumaini', meetingDay: 'Ijumaa', meetingPlace: 'Shule ya awali, Goba' },
  { name: 'Neema', meetingDay: 'Jumatano', meetingPlace: 'Nyumba ya Mama Joyce, Makongo' },
  { name: 'Mwanga', meetingDay: 'Alhamisi', meetingPlace: 'Chumba cha kwaya' },
];

function day(offset: number, hour = 10): number {
  const d = new Date('2026-09-23T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + offset);
  d.setUTCHours(hour, 0, 0, 0);
  return d.getTime();
}

function dateOnly(offset: number): string {
  const d = new Date('2026-09-23T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const sqlite = createClient({
    url: databaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(sqlite);
  await migrate(db, { migrationsFolder: resolve(here, '../drizzle') });

  await sqlite.executeMultiple(`
    PRAGMA foreign_keys = OFF;
    DELETE FROM receipts;
    DELETE FROM transactions;
    DELETE FROM pledges;
    DELETE FROM projects;
    DELETE FROM giving_categories;
    DELETE FROM daily_verses;
    DELETE FROM liturgical_calendar;
    DELETE FROM event_rsvps;
    DELETE FROM events;
    DELETE FROM notification_deliveries;
    DELETE FROM reminders;
    DELETE FROM announcement_targets;
    DELETE FROM announcements;
    DELETE FROM live_streams;
    DELETE FROM sermons;
    DELETE FROM sermon_series;
    DELETE FROM media_assets;
    DELETE FROM group_members;
    DELETE FROM groups;
    DELETE FROM jumuiya_members;
    DELETE FROM members;
    DELETE FROM jumuiya;
    DELETE FROM families;
    DELETE FROM member_settings;
    DELETE FROM admin_credentials;
    DELETE FROM sessions;
    DELETE FROM otp_challenges;
    DELETE FROM user_roles;
    DELETE FROM roles;
    DELETE FROM users;
    DELETE FROM church_profile;
    DELETE FROM audit_log;
    PRAGMA foreign_keys = ON;
  `);

  const churchId = newId();
  await db.insert(tables.churchProfile).values({
    id: churchId,
    nameSw: 'KKKT Usharika wa Ebenezer',
    nameEn: 'KKKT Ebenezer Parish',
    shortName: 'Ebenezer',
    city: 'Dar es Salaam',
    smsSenderId: 'EBENEZER',
    officePhone: '+255222700100',
    officeEmail: 'ofisi@ebenezer.or.tz',
    createdAt: stamp,
    updatedAt: stamp,
  });

  const roleRows = (
    [
      'mchungaji',
      'katibu',
      'mhazini',
      'media',
      'kiongozi_jumuiya',
      'msomaji',
    ] as const
  ).map((key) => ({ id: newId(), key, createdAt: stamp, updatedAt: stamp }));
  await db.insert(tables.roles).values(roleRows);
  const roleByKey = Object.fromEntries(roleRows.map((row) => [row.key, row.id]));

  const pastorId = newId();
  const katibuId = newId();
  const mhaziniId = newId();
  const mediaId = newId();

  const officeUsers = [
    {
      id: pastorId,
      phone: '+255712000001',
      email: 'mchungaji@ebenezer.or.tz',
      displayName: 'Mchungaji Yohana Mwanga',
      role: 'mchungaji' as const,
    },
    {
      id: katibuId,
      phone: '+255712000002',
      email: 'katibu@ebenezer.or.tz',
      displayName: 'Katibu Rehema Kimaro',
      role: 'katibu' as const,
    },
    {
      id: mhaziniId,
      phone: '+255712000003',
      email: 'mhazini@ebenezer.or.tz',
      displayName: 'Mhazini Baraka Ngowi',
      role: 'mhazini' as const,
    },
    {
      id: mediaId,
      phone: '+255712000004',
      email: 'media@ebenezer.or.tz',
      displayName: 'Neema Mushi',
      role: 'media' as const,
    },
  ];

  await db.insert(tables.users).values(
    officeUsers.map((user) => ({
      id: user.id,
      phone: user.phone,
      email: user.email,
      displayName: user.displayName,
      locale: 'sw' as const,
      status: 'active' as const,
      createdAt: stamp,
      updatedAt: stamp,
    })),
  );

  const officePassword = hashPassword('JiweLaMsaada2026');
  await db.insert(tables.adminCredentials).values(
    officeUsers.map((user) => ({
      id: newId(),
      userId: user.id,
      email: user.email,
      passwordHash: officePassword,
      createdAt: stamp,
      updatedAt: stamp,
    })),
  );

  await db.insert(tables.userRoles).values(
    officeUsers.map((user) => ({
      id: newId(),
      userId: user.id,
      roleId: roleByKey[user.role]!,
      createdAt: stamp,
      updatedAt: stamp,
    })),
  );

  const jumuiyaRows = jumuiyaSeed.map((item) => ({
    id: newId(),
    name: item.name,
    meetingDay: item.meetingDay,
    meetingPlace: item.meetingPlace,
    createdAt: stamp,
    updatedAt: stamp,
  }));
  await db.insert(tables.jumuiya).values(jumuiyaRows);

  const familyRows = Array.from({ length: 18 }, (_, i) => ({
    id: newId(),
    name: `Familia ya ${lastNames[i % lastNames.length]}`,
    createdAt: stamp,
    updatedAt: stamp,
  }));
  await db.insert(tables.families).values(familyRows);

  const memberUsers: Array<{
    id: string;
    phone: string;
    displayName: string;
  }> = [];
  const memberRows: Array<typeof tables.members.$inferInsert> = [];
  const memberships: Array<typeof tables.jumuiyaMembers.$inferInsert> = [];

  for (let i = 0; i < 40; i += 1) {
    const first = firstNames[i % firstNames.length]!;
    const last = lastNames[i % lastNames.length]!;
    const userId = newId();
    const memberId = newId();
    const phone = `+25571${String(2000100 + i).slice(-7)}`;
    memberUsers.push({
      id: userId,
      phone,
      displayName: `${first} ${last}`,
    });
    memberRows.push({
      id: memberId,
      userId,
      familyId: familyRows[i % familyRows.length]!.id,
      firstName: first,
      lastName: last,
      sex: i % 2 === 0 ? 'mwanamke' : 'mwanaume',
      dateOfBirth: `${1968 + (i % 40)}-${String((i % 8) + 1).padStart(2, '0')}-15`,
      baptismDate: `${1970 + (i % 40)}-04-12`,
      confirmationDate: `${1984 + (i % 30)}-06-08`,
      status: 'active',
      createdAt: stamp,
      updatedAt: stamp,
    });
    memberships.push({
      id: newId(),
      jumuiyaId: jumuiyaRows[i % jumuiyaRows.length]!.id,
      memberId,
      role: i < 6 ? 'kiongozi' : 'mwanachama',
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  await db.insert(tables.users).values(
    memberUsers.map((user) => ({
      id: user.id,
      phone: user.phone,
      displayName: user.displayName,
      locale: 'sw' as const,
      status: 'active' as const,
      createdAt: stamp,
      updatedAt: stamp,
    })),
  );
  await db.insert(tables.members).values(memberRows);
  await db.insert(tables.jumuiyaMembers).values(memberships);

  for (let i = 0; i < jumuiyaRows.length; i += 1) {
    await sqlite.execute({
      sql: 'update jumuiya set kiongozi_user_id = ? where id = ?',
      args: [memberUsers[i]!.id, jumuiyaRows[i]!.id],
    });
    await db.insert(tables.userRoles).values({
      id: newId(),
      userId: memberUsers[i]!.id,
      roleId: roleByKey.kiongozi_jumuiya!,
      jumuiyaId: jumuiyaRows[i]!.id,
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  const groupDefs = [
    { key: 'vijana' as const, nameSw: 'Vijana', nameEn: 'Youth' },
    { key: 'wanawake' as const, nameSw: 'Umoja wa Wanawake', nameEn: 'Women' },
    { key: 'wanaume' as const, nameSw: 'Umoja wa Wanaume', nameEn: 'Men' },
    { key: 'wazee' as const, nameSw: 'Wazee', nameEn: 'Elders' },
    { key: 'kwaya' as const, nameSw: 'Kwaya', nameEn: 'Choir' },
  ];
  const groupRows = groupDefs.map((g) => ({
    id: newId(),
    ...g,
    createdAt: stamp,
    updatedAt: stamp,
  }));
  await db.insert(tables.groups).values(groupRows);

  const seriesJiwe = newId();
  const seriesNeno = newId();
  await db.insert(tables.sermonSeries).values([
    {
      id: seriesJiwe,
      titleSw: 'Jiwe la msaada',
      titleEn: 'Stone of help',
      descriptionSw: 'Mfululizo kutoka 1 Samweli: Mungu anasaidia, hata sasa.',
      descriptionEn: 'A series from 1 Samuel: God helps, even now.',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: seriesNeno,
      titleSw: 'Neno linakaa kwetu',
      titleEn: 'The Word dwells with us',
      descriptionSw: 'Yohana 1 na maisha ya usharika wiki hadi wiki.',
      descriptionEn: 'John 1 and parish life, week by week.',
      createdAt: stamp,
      updatedAt: stamp,
    },
  ]);

  const audio = newId();
  await db.insert(tables.mediaAssets).values({
    id: audio,
    kind: 'audio',
    storage: 'local',
    uri: '/media/sample-hubiri.aac',
    durationSec: 18 * 60,
    mime: 'audio/aac',
    createdAt: stamp,
    updatedAt: stamp,
  });

  const sermonTitles = [
    ['Jiwe lililosimama', 'The stone that was set up', seriesJiwe, '1 Samweli 7:12'],
    ['Usisahau yaliyopita', 'Do not forget what has passed', seriesJiwe, '1 Samweli 7:3-12'],
    ['BWANA ametusaidia', 'The LORD has helped us', seriesJiwe, 'Zaburi 46'],
    ['Mwanga asubuhi', 'Light in the morning', seriesJiwe, 'Zaburi 5'],
    ['Simama mahali pako', 'Stand in your place', seriesJiwe, 'Waefeso 6:10-18'],
    ['Msaada wa siri', 'Help in secret', seriesJiwe, 'Mathayo 6:6'],
    ['Neno likawa mwili', 'The Word became flesh', seriesNeno, 'Yohana 1:1-14'],
    ['Nuru inang’aa gizani', 'Light shines in the dark', seriesNeno, 'Yohana 1:5'],
    ['Njoo uone', 'Come and see', seriesNeno, 'Yohana 1:39'],
    ['Maji ya uzima', 'Living water', seriesNeno, 'Yohana 4:7-15'],
    ['Mimi ni mkate', 'I am the bread', seriesNeno, 'Yohana 6:35'],
    ['Amani nawaachieni', 'Peace I leave with you', seriesNeno, 'Yohana 14:27'],
  ] as const;

  await db.insert(tables.sermons).values(
    sermonTitles.map(([titleSw, titleEn, seriesId, readings], i) => ({
      id: newId(),
      seriesId,
      titleSw,
      titleEn,
      preacher: i % 3 === 0 ? 'Mchungaji Yohana Mwanga' : 'Mchungaji Msaidizi Asha Lyimo',
      preachedOn: dateOnly(-7 * (11 - i)),
      readings,
      notesSw:
        'Hubiri hili linatualika tukumbuke msaada wa Mungu katika maisha ya usharika, si kama wazo, bali kama jiwe tulilosimamisha.',
      notesEn:
        'This sermon asks us to remember God’s help in parish life as a stone we have set up, not as an idea.',
      audioAssetId: audio,
      status: 'published',
      publishedAt: day(-7 * (11 - i), 14),
      createdAt: stamp,
      updatedAt: stamp,
    })),
  );

  await db.insert(tables.liveStreams).values({
    id: newId(),
    titleSw: 'Ibada ya Jumapili',
    titleEn: 'Sunday service',
    status: 'scheduled',
    startsAt: day(4, 7),
    youtubeUrl: 'https://youtube.com/live/ebenezer-demo',
    liturgySw: 'Utangulizi · Kukiri dhambi · Neno · Mahubiri · Sadaka · Baraka',
    readings: 'Zaburi 121; Warumi 12:1-8; Mathayo 16:13-20',
    createdAt: stamp,
    updatedAt: stamp,
  });

  await db.insert(tables.announcements).values([
    {
      id: newId(),
      titleSw: 'Kipaimara cha vijana',
      titleEn: 'Youth confirmation',
      bodySw: 'Mazoezi ya mwisho ni Jumamosi saa 10 asubuhi. Waumini wote mnakaribishwa.',
      bodyEn: 'Final rehearsal is Saturday at 10 in the morning. The whole parish is welcome.',
      status: 'sent',
      channel: 'both',
      publishAt: day(-2, 9),
      createdBy: katibuId,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      titleSw: 'Siku ya kufunga',
      titleEn: 'Fasting day',
      bodySw: 'Jumatano hii ni siku ya kufunga na kuomba kwa ajili ya familia za usharika.',
      bodyEn: 'This Wednesday is a day of fasting and prayer for parish families.',
      status: 'sent',
      channel: 'push',
      publishAt: day(-1, 6),
      createdBy: pastorId,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      titleSw: 'Mchango wa paa',
      titleEn: 'Roof fund',
      bodySw: 'Mhazini atatoa taarifa ya paa baada ya ibada. Asante kwa ahadi zenu.',
      bodyEn: 'The treasurer will report on the roof after the service. Thank you for your pledges.',
      status: 'sent',
      channel: 'sms',
      publishAt: day(-5, 16),
      createdBy: mhaziniId,
      createdAt: stamp,
      updatedAt: stamp,
    },
  ]);

  await db.insert(tables.events).values([
    {
      id: newId(),
      kind: 'ibada',
      titleSw: 'Ibada ya Jumapili',
      titleEn: 'Sunday service',
      startsAt: day(4, 7),
      place: 'Kanisa kuu',
      preacher: 'Mchungaji Yohana Mwanga',
      readings: 'Zaburi 121; Warumi 12:1-8; Mathayo 16:13-20',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      kind: 'jumuiya',
      titleSw: 'Kikao cha Jumuiya ya Amani',
      titleEn: 'Amani jumuiya meeting',
      startsAt: day(0, 16),
      place: jumuiyaSeed[0]!.meetingPlace,
      jumuiyaId: jumuiyaRows[0]!.id,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      kind: 'ubatizo',
      titleSw: 'Ubatizo',
      titleEn: 'Baptism',
      startsAt: day(4, 8),
      place: 'Kanisa kuu',
      createdAt: stamp,
      updatedAt: stamp,
    },
  ]);

  await db.insert(tables.liturgicalCalendar).values([
    {
      id: newId(),
      startsOn: '2025-11-30',
      endsOn: '2025-12-24',
      season: 'advent',
      sundayNameSw: 'Majilio',
      sundayNameEn: 'Advent',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2025-12-25',
      endsOn: '2026-01-05',
      season: 'christmas',
      sundayNameSw: 'Krismasi',
      sundayNameEn: 'Christmas',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-01-06',
      endsOn: '2026-02-17',
      season: 'epiphany',
      sundayNameSw: 'Epifania',
      sundayNameEn: 'Epiphany',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-02-18',
      endsOn: '2026-04-04',
      season: 'lent',
      sundayNameSw: 'Kwaresma',
      sundayNameEn: 'Lent',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-04-05',
      endsOn: '2026-05-23',
      season: 'easter',
      sundayNameSw: 'Pasaka',
      sundayNameEn: 'Easter',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-05-24',
      endsOn: '2026-05-24',
      season: 'pentecost',
      sundayNameSw: 'Pentekoste',
      sundayNameEn: 'Pentecost',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-05-25',
      endsOn: '2026-11-28',
      season: 'ordinary',
      sundayNameSw: 'Kipindi cha Kawaida',
      sundayNameEn: 'Ordinary time',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-09-20',
      endsOn: '2026-09-26',
      season: 'ordinary',
      sundayNameSw: 'Jumapili ya 16 baada ya Pentekoste',
      sundayNameEn: '16th Sunday after Pentecost',
      readings: 'Zaburi 121; Warumi 12:1-8; Mathayo 16:13-20',
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: newId(),
      startsOn: '2026-11-29',
      endsOn: '2026-12-24',
      season: 'advent',
      sundayNameSw: 'Majilio',
      sundayNameEn: 'Advent',
      createdAt: stamp,
      updatedAt: stamp,
    },
  ]);

  const verses: Array<[string, string, string]> = [
    [
      '1 Samweli 7:12',
      'Hata sasa BWANA ametusaidia.',
      'Thus far the LORD has helped us.',
    ],
    [
      'Zaburi 121:1-2',
      'Natezama milimani; msaada wangu utatoka wapi? Msaada wangu watoka kwa BWANA.',
      'I lift up my eyes to the hills. From where does my help come? My help comes from the LORD.',
    ],
    [
      'Yohana 1:5',
      'Nuru inang’aa gizani, giza halikuishinda.',
      'The light shines in the darkness, and the darkness has not overcome it.',
    ],
    [
      'Mathayo 11:28',
      'Njoni kwangu, ninyi nyote msumbukao na kulemewa, nami nitawapumzisha.',
      'Come to me, all who labour and are heavy laden, and I will give you rest.',
    ],
    [
      'Zaburi 46:1',
      'Mungu ndiye kimbilio letu na nguvu zetu, msaada utimulikao sana katika taabu.',
      'God is our refuge and strength, a very present help in trouble.',
    ],
  ];

  await db.insert(tables.dailyVerses).values(
    Array.from({ length: 14 }, (_, i) => {
      const verse = verses[i % verses.length]!;
      return {
        id: newId(),
        forDate: dateOnly(i - 3),
        reference: verse[0],
        textSw: verse[1],
        textEn: verse[2],
        createdAt: stamp,
        updatedAt: stamp,
      };
    }),
  );

  const categories = (
    [
      ['sadaka', 'Sadaka', 'Offering'],
      ['zaka', 'Zaka', 'Tithe'],
      ['shukrani', 'Shukrani', 'Thanksgiving'],
      ['ahadi', 'Ahadi', 'Pledge'],
      ['mradi', 'Michango ya miradi', 'Project gift'],
    ] as const
  ).map(([key, nameSw, nameEn]) => ({
    id: newId(),
    key,
    nameSw,
    nameEn,
    createdAt: stamp,
    updatedAt: stamp,
  }));
  await db.insert(tables.givingCategories).values(categories);

  const roof = newId();
  await db.insert(tables.projects).values({
    id: roof,
    nameSw: 'Paa jipya la kanisa',
    nameEn: 'New church roof',
    goalTzs: 25_000_000,
    createdAt: stamp,
    updatedAt: stamp,
  });

  const categoryCycle = categories;
  const txRows: Array<typeof tables.transactions.$inferInsert> = [];
  for (let i = 0; i < 32; i += 1) {
    const category = categoryCycle[i % categoryCycle.length]!;
    const success = i % 9 !== 0;
    txRows.push({
      id: newId(),
      memberId: memberRows[i % memberRows.length]!.id,
      categoryId: category.id,
      projectId: category.key === 'mradi' ? roof : null,
      amountTzs: [5000, 10000, 20000, 25000, 50000][i % 5]!,
      status: success ? 'success' : 'failed',
      network: (['mpesa', 'mixx', 'airtel', 'cash'] as const)[i % 4],
      provider: 'selcom-dev',
      providerRef: `SEL-${1000 + i}`,
      idempotencyKey: `seed-${i}`,
      anonymous: i % 7 === 0,
      createdAt: day(-i, 11),
      updatedAt: day(-i, 11),
    });
  }
  await db.insert(tables.transactions).values(txRows);

  await db.insert(tables.receipts).values(
    txRows
      .filter((tx) => tx.status === 'success')
      .map((tx, i) => ({
        id: newId(),
        transactionId: tx.id,
        number: `EB-2026-${String(i + 1).padStart(4, '0')}`,
        createdAt: stamp,
        updatedAt: stamp,
      })),
  );

  await db.insert(tables.auditLog).values({
    id: newId(),
    actorUserId: katibuId,
    action: 'seed',
    entity: 'church_profile',
    entityId: churchId,
    afterJson: JSON.stringify({ name: 'KKKT Usharika wa Ebenezer' }),
    createdAt: stamp,
    updatedAt: stamp,
  });

  sqlite.close();
  console.log('Ebenezer seed ready: 6 jumuiya, 40 waumini, 12 mahubiri, mwezi wa sadaka.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
