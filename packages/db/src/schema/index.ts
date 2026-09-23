import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: integer('created_at', { mode: 'number' })
    .notNull()
    .default(sql`(cast(unixepoch('subsec') * 1000 as integer))`),
  updatedAt: integer('updated_at', { mode: 'number' })
    .notNull()
    .default(sql`(cast(unixepoch('subsec') * 1000 as integer))`),
};

const softDelete = {
  deletedAt: integer('deleted_at', { mode: 'number' }),
};

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    phone: text('phone').notNull(),
    email: text('email'),
    displayName: text('display_name').notNull(),
    locale: text('locale', { enum: ['sw', 'en'] }).notNull().default('sw'),
    status: text('status', { enum: ['active', 'invited', 'suspended'] })
      .notNull()
      .default('active'),
    ...timestamps,
    ...softDelete,
  },
  (table) => [
    uniqueIndex('users_phone_uidx').on(table.phone),
    uniqueIndex('users_email_uidx').on(table.email),
  ],
);

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  key: text('key', {
    enum: [
      'mchungaji',
      'katibu',
      'mhazini',
      'media',
      'kiongozi_jumuiya',
      'msomaji',
    ],
  }).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex('roles_key_uidx').on(table.key)]);

export const userRoles = sqliteTable(
  'user_roles',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id),
    jumuiyaId: text('jumuiya_id').references(() => jumuiya.id),
    ...timestamps,
  },
  (table) => [index('user_roles_user_idx').on(table.userId)],
);

export const otpChallenges = sqliteTable(
  'otp_challenges',
  {
    id: text('id').primaryKey(),
    phone: text('phone').notNull(),
    codeHash: text('code_hash').notNull(),
    expiresAt: integer('expires_at', { mode: 'number' }).notNull(),
    attempts: integer('attempts').notNull().default(0),
    consumedAt: integer('consumed_at', { mode: 'number' }),
    locale: text('locale', { enum: ['sw', 'en'] }).notNull().default('sw'),
    ...timestamps,
  },
  (table) => [index('otp_phone_idx').on(table.phone)],
);

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    tokenHash: text('token_hash').notNull(),
    expiresAt: integer('expires_at', { mode: 'number' }).notNull(),
    revokedAt: integer('revoked_at', { mode: 'number' }),
    userAgent: text('user_agent'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('sessions_token_uidx').on(table.tokenHash),
    index('sessions_user_idx').on(table.userId),
  ],
);

export const adminCredentials = sqliteTable('admin_credentials', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex('admin_credentials_user_uidx').on(table.userId),
  uniqueIndex('admin_credentials_email_uidx').on(table.email),
]);

export const families = sqliteTable('families', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ...timestamps,
  ...softDelete,
});

export const jumuiya = sqliteTable('jumuiya', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  meetingDay: text('meeting_day'),
  meetingPlace: text('meeting_place'),
  kiongoziUserId: text('kiongozi_user_id').references(() => users.id),
  notes: text('notes'),
  ...timestamps,
  ...softDelete,
});

export const members = sqliteTable(
  'members',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    familyId: text('family_id').references(() => families.id),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    otherNames: text('other_names'),
    sex: text('sex', { enum: ['mwanamke', 'mwanaume'] }),
    dateOfBirth: text('date_of_birth'),
    baptismDate: text('baptism_date'),
    confirmationDate: text('confirmation_date'),
    maritalStatus: text('marital_status'),
    status: text('status', { enum: ['active', 'visitor', 'transferred', 'deceased'] })
      .notNull()
      .default('active'),
    jumuiyaUnknownRequestedAt: integer('jumuiya_unknown_requested_at', { mode: 'number' }),
    ...timestamps,
    ...softDelete,
  },
  (table) => [index('members_user_idx').on(table.userId)],
);

export const jumuiyaMembers = sqliteTable(
  'jumuiya_members',
  {
    id: text('id').primaryKey(),
    jumuiyaId: text('jumuiya_id')
      .notNull()
      .references(() => jumuiya.id),
    memberId: text('member_id')
      .notNull()
      .references(() => members.id),
    role: text('role', { enum: ['mwanachama', 'kiongozi', 'katibu'] })
      .notNull()
      .default('mwanachama'),
    ...timestamps,
  },
  (table) => [uniqueIndex('jumuiya_members_uidx').on(table.jumuiyaId, table.memberId)],
);

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  key: text('key', {
    enum: ['vijana', 'wanawake', 'wanaume', 'wazee', 'kwaya'],
  }).notNull(),
  nameSw: text('name_sw').notNull(),
  nameEn: text('name_en').notNull(),
  ...timestamps,
}, (table) => [uniqueIndex('groups_key_uidx').on(table.key)]);

export const groupMembers = sqliteTable(
  'group_members',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id),
    memberId: text('member_id')
      .notNull()
      .references(() => members.id),
    ...timestamps,
  },
  (table) => [uniqueIndex('group_members_uidx').on(table.groupId, table.memberId)],
);

export const memberSettings = sqliteTable('member_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  theme: text('theme', { enum: ['system', 'light', 'dark'] }).notNull().default('system'),
  textScale: integer('text_scale').notNull().default(100),
  lowData: integer('low_data', { mode: 'boolean' }).notNull().default(false),
  verseReminderTime: text('verse_reminder_time'),
  sundayReminder: integer('sunday_reminder', { mode: 'boolean' }).notNull().default(true),
  jumuiyaReminder: integer('jumuiya_reminder', { mode: 'boolean' }).notNull().default(true),
  pushToken: text('push_token'),
  ...timestamps,
}, (table) => [uniqueIndex('member_settings_user_uidx').on(table.userId)]);

export const sermonSeries = sqliteTable('sermon_series', {
  id: text('id').primaryKey(),
  titleSw: text('title_sw').notNull(),
  titleEn: text('title_en').notNull(),
  descriptionSw: text('description_sw'),
  descriptionEn: text('description_en'),
  ...timestamps,
  ...softDelete,
});

export const mediaAssets = sqliteTable('media_assets', {
  id: text('id').primaryKey(),
  kind: text('kind', { enum: ['video', 'audio', 'image', 'pdf'] }).notNull(),
  storage: text('storage', { enum: ['mux', 'r2', 'youtube', 'local'] }).notNull(),
  uri: text('uri').notNull(),
  muxPlaybackId: text('mux_playback_id'),
  durationSec: integer('duration_sec'),
  bytes: integer('bytes'),
  mime: text('mime'),
  ...timestamps,
});

export const sermons = sqliteTable(
  'sermons',
  {
    id: text('id').primaryKey(),
    seriesId: text('series_id').references(() => sermonSeries.id),
    titleSw: text('title_sw').notNull(),
    titleEn: text('title_en').notNull(),
    preacher: text('preacher').notNull(),
    preachedOn: text('preached_on').notNull(),
    readings: text('readings'),
    notesSw: text('notes_sw'),
    notesEn: text('notes_en'),
    videoAssetId: text('video_asset_id').references(() => mediaAssets.id),
    audioAssetId: text('audio_asset_id').references(() => mediaAssets.id),
    thumbnailAssetId: text('thumbnail_asset_id').references(() => mediaAssets.id),
    status: text('status', { enum: ['draft', 'scheduled', 'published'] })
      .notNull()
      .default('draft'),
    publishedAt: integer('published_at', { mode: 'number' }),
    ...timestamps,
    ...softDelete,
  },
  (table) => [index('sermons_date_idx').on(table.preachedOn)],
);

export const liveStreams = sqliteTable('live_streams', {
  id: text('id').primaryKey(),
  titleSw: text('title_sw').notNull(),
  titleEn: text('title_en').notNull(),
  status: text('status', {
    enum: ['scheduled', 'live', 'ended', 'archived'],
  }).notNull(),
  startsAt: integer('starts_at', { mode: 'number' }).notNull(),
  muxStreamKey: text('mux_stream_key'),
  muxPlaybackId: text('mux_playback_id'),
  youtubeUrl: text('youtube_url'),
  viewerCount: integer('viewer_count').notNull().default(0),
  liturgySw: text('liturgy_sw'),
  readings: text('readings'),
  archivedSermonId: text('archived_sermon_id').references(() => sermons.id),
  ...timestamps,
});

export const announcements = sqliteTable('announcements', {
  id: text('id').primaryKey(),
  titleSw: text('title_sw').notNull(),
  titleEn: text('title_en').notNull(),
  bodySw: text('body_sw').notNull(),
  bodyEn: text('body_en').notNull(),
  status: text('status', { enum: ['draft', 'scheduled', 'sent'] }).notNull().default('draft'),
  channel: text('channel', { enum: ['push', 'sms', 'both'] }).notNull().default('push'),
  publishAt: integer('publish_at', { mode: 'number' }),
  createdBy: text('created_by').references(() => users.id),
  ...timestamps,
  ...softDelete,
});

export const announcementTargets = sqliteTable('announcement_targets', {
  id: text('id').primaryKey(),
  announcementId: text('announcement_id')
    .notNull()
    .references(() => announcements.id),
  audience: text('audience', {
    enum: ['wote', 'jumuiya', 'kikundi'],
  }).notNull(),
  jumuiyaId: text('jumuiya_id').references(() => jumuiya.id),
  groupId: text('group_id').references(() => groups.id),
  ...timestamps,
});

export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  kind: text('kind', {
    enum: ['verse', 'ibada', 'jumuiya', 'pledge', 'custom'],
  }).notNull(),
  titleSw: text('title_sw').notNull(),
  titleEn: text('title_en').notNull(),
  bodySw: text('body_sw'),
  bodyEn: text('body_en'),
  fireAt: integer('fire_at', { mode: 'number' }).notNull(),
  memberId: text('member_id').references(() => members.id),
  jumuiyaId: text('jumuiya_id').references(() => jumuiya.id),
  ...timestamps,
});

export const notificationDeliveries = sqliteTable(
  'notification_deliveries',
  {
    id: text('id').primaryKey(),
    channel: text('channel', { enum: ['push', 'sms'] }).notNull(),
    status: text('status', { enum: ['queued', 'sent', 'failed'] }).notNull(),
    toPhone: text('to_phone'),
    pushToken: text('push_token'),
    announcementId: text('announcement_id').references(() => announcements.id),
    reminderId: text('reminder_id').references(() => reminders.id),
    providerRef: text('provider_ref'),
    error: text('error'),
    ...timestamps,
  },
  (table) => [index('deliveries_status_idx').on(table.status)],
);

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  kind: text('kind', {
    enum: ['ibada', 'harusi', 'ubatizo', 'kipaimara', 'jumuiya', 'nyingine'],
  }).notNull(),
  titleSw: text('title_sw').notNull(),
  titleEn: text('title_en').notNull(),
  startsAt: integer('starts_at', { mode: 'number' }).notNull(),
  endsAt: integer('ends_at', { mode: 'number' }),
  place: text('place'),
  preacher: text('preacher'),
  readings: text('readings'),
  jumuiyaId: text('jumuiya_id').references(() => jumuiya.id),
  ...timestamps,
  ...softDelete,
});

export const eventRsvps = sqliteTable(
  'event_rsvps',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id),
    memberId: text('member_id')
      .notNull()
      .references(() => members.id),
    status: text('status', { enum: ['yes', 'no', 'maybe'] }).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('event_rsvps_uidx').on(table.eventId, table.memberId)],
);

export const liturgicalCalendar = sqliteTable(
  'liturgical_calendar',
  {
    id: text('id').primaryKey(),
    startsOn: text('starts_on').notNull(),
    endsOn: text('ends_on').notNull(),
    season: text('season', {
      enum: [
        'advent',
        'christmas',
        'epiphany',
        'ordinary',
        'lent',
        'easter',
        'pentecost',
      ],
    }).notNull(),
    sundayNameSw: text('sunday_name_sw').notNull(),
    sundayNameEn: text('sunday_name_en').notNull(),
    readings: text('readings'),
    colorOverride: text('color_override'),
    ...timestamps,
  },
  (table) => [index('liturgical_range_idx').on(table.startsOn, table.endsOn)],
);

export const dailyVerses = sqliteTable(
  'daily_verses',
  {
    id: text('id').primaryKey(),
    forDate: text('for_date').notNull(),
    reference: text('reference').notNull(),
    textSw: text('text_sw').notNull(),
    textEn: text('text_en').notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('daily_verses_date_uidx').on(table.forDate)],
);

export const givingCategories = sqliteTable('giving_categories', {
  id: text('id').primaryKey(),
  key: text('key', {
    enum: ['sadaka', 'zaka', 'shukrani', 'ahadi', 'mradi'],
  }).notNull(),
  nameSw: text('name_sw').notNull(),
  nameEn: text('name_en').notNull(),
  ...timestamps,
}, (table) => [uniqueIndex('giving_categories_key_uidx').on(table.key)]);

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  nameSw: text('name_sw').notNull(),
  nameEn: text('name_en').notNull(),
  goalTzs: integer('goal_tzs').notNull(),
  ...timestamps,
  ...softDelete,
});

export const pledges = sqliteTable('pledges', {
  id: text('id').primaryKey(),
  memberId: text('member_id')
    .notNull()
    .references(() => members.id),
  categoryId: text('category_id')
    .notNull()
    .references(() => givingCategories.id),
  projectId: text('project_id').references(() => projects.id),
  promisedTzs: integer('promised_tzs').notNull(),
  dueOn: text('due_on'),
  anonymous: integer('anonymous', { mode: 'boolean' }).notNull().default(false),
  ...timestamps,
  ...softDelete,
});

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    memberId: text('member_id').references(() => members.id),
    categoryId: text('category_id')
      .notNull()
      .references(() => givingCategories.id),
    projectId: text('project_id').references(() => projects.id),
    pledgeId: text('pledge_id').references(() => pledges.id),
    amountTzs: integer('amount_tzs').notNull(),
    status: text('status', {
      enum: ['pending', 'success', 'failed', 'reversed'],
    }).notNull(),
    network: text('network', { enum: ['mpesa', 'mixx', 'airtel', 'cash'] }),
    provider: text('provider'),
    providerRef: text('provider_ref'),
    idempotencyKey: text('idempotency_key').notNull(),
    anonymous: integer('anonymous', { mode: 'boolean' }).notNull().default(false),
    note: text('note'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('transactions_idem_uidx').on(table.idempotencyKey),
    uniqueIndex('transactions_provider_ref_uidx').on(table.providerRef),
    index('transactions_status_idx').on(table.status),
  ],
);

export const receipts = sqliteTable('receipts', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id')
    .notNull()
    .references(() => transactions.id),
  number: text('number').notNull(),
  pdfUri: text('pdf_uri'),
  ...timestamps,
}, (table) => [uniqueIndex('receipts_number_uidx').on(table.number)]);

export const auditLog = sqliteTable(
  'audit_log',
  {
    id: text('id').primaryKey(),
    actorUserId: text('actor_user_id').references(() => users.id),
    action: text('action').notNull(),
    entity: text('entity').notNull(),
    entityId: text('entity_id'),
    beforeJson: text('before_json'),
    afterJson: text('after_json'),
    ...timestamps,
  },
  (table) => [index('audit_entity_idx').on(table.entity, table.entityId)],
);

export const churchProfile = sqliteTable('church_profile', {
  id: text('id').primaryKey(),
  nameSw: text('name_sw').notNull(),
  nameEn: text('name_en').notNull(),
  shortName: text('short_name').notNull(),
  city: text('city').notNull(),
  smsSenderId: text('sms_sender_id'),
  officePhone: text('office_phone'),
  officeEmail: text('office_email'),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many, one }) => ({
  roles: many(userRoles),
  member: one(members),
  sessions: many(sessions),
  settings: one(memberSettings),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  family: one(families, { fields: [members.familyId], references: [families.id] }),
  jumuiyaMemberships: many(jumuiyaMembers),
}));

export const jumuiyaRelations = relations(jumuiya, ({ many }) => ({
  members: many(jumuiyaMembers),
}));
