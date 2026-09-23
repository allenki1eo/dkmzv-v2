CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `phone` text NOT NULL,
  `email` text,
  `display_name` text NOT NULL,
  `locale` text NOT NULL DEFAULT 'sw',
  `status` text NOT NULL DEFAULT 'active',
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_uidx` ON `users` (`phone`);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_uidx` ON `users` (`email`);
--> statement-breakpoint
CREATE TABLE `roles` (
  `id` text PRIMARY KEY NOT NULL,
  `key` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_key_uidx` ON `roles` (`key`);
--> statement-breakpoint
CREATE TABLE `families` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `jumuiya` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `meeting_day` text,
  `meeting_place` text,
  `kiongozi_user_id` text REFERENCES `users`(`id`),
  `notes` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `members` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text REFERENCES `users`(`id`),
  `family_id` text REFERENCES `families`(`id`),
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `other_names` text,
  `sex` text,
  `date_of_birth` text,
  `baptism_date` text,
  `confirmation_date` text,
  `marital_status` text,
  `status` text NOT NULL DEFAULT 'active',
  `jumuiya_unknown_requested_at` integer,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `members_user_idx` ON `members` (`user_id`);
--> statement-breakpoint
CREATE TABLE `user_roles` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `role_id` text NOT NULL REFERENCES `roles`(`id`),
  `jumuiya_id` text REFERENCES `jumuiya`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE INDEX `user_roles_user_idx` ON `user_roles` (`user_id`);
--> statement-breakpoint
CREATE TABLE `otp_challenges` (
  `id` text PRIMARY KEY NOT NULL,
  `phone` text NOT NULL,
  `code_hash` text NOT NULL,
  `expires_at` integer NOT NULL,
  `attempts` integer NOT NULL DEFAULT 0,
  `consumed_at` integer,
  `locale` text NOT NULL DEFAULT 'sw',
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE INDEX `otp_phone_idx` ON `otp_challenges` (`phone`);
--> statement-breakpoint
CREATE TABLE `sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `token_hash` text NOT NULL,
  `expires_at` integer NOT NULL,
  `revoked_at` integer,
  `user_agent` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_uidx` ON `sessions` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);
--> statement-breakpoint
CREATE TABLE `admin_credentials` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_credentials_user_uidx` ON `admin_credentials` (`user_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_credentials_email_uidx` ON `admin_credentials` (`email`);
--> statement-breakpoint
CREATE TABLE `jumuiya_members` (
  `id` text PRIMARY KEY NOT NULL,
  `jumuiya_id` text NOT NULL REFERENCES `jumuiya`(`id`),
  `member_id` text NOT NULL REFERENCES `members`(`id`),
  `role` text NOT NULL DEFAULT 'mwanachama',
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jumuiya_members_uidx` ON `jumuiya_members` (`jumuiya_id`, `member_id`);
--> statement-breakpoint
CREATE TABLE `groups` (
  `id` text PRIMARY KEY NOT NULL,
  `key` text NOT NULL,
  `name_sw` text NOT NULL,
  `name_en` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `groups_key_uidx` ON `groups` (`key`);
--> statement-breakpoint
CREATE TABLE `group_members` (
  `id` text PRIMARY KEY NOT NULL,
  `group_id` text NOT NULL REFERENCES `groups`(`id`),
  `member_id` text NOT NULL REFERENCES `members`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_members_uidx` ON `group_members` (`group_id`, `member_id`);
--> statement-breakpoint
CREATE TABLE `member_settings` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `theme` text NOT NULL DEFAULT 'system',
  `text_scale` integer NOT NULL DEFAULT 100,
  `low_data` integer NOT NULL DEFAULT 0,
  `verse_reminder_time` text,
  `sunday_reminder` integer NOT NULL DEFAULT 1,
  `jumuiya_reminder` integer NOT NULL DEFAULT 1,
  `push_token` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_settings_user_uidx` ON `member_settings` (`user_id`);
--> statement-breakpoint
CREATE TABLE `sermon_series` (
  `id` text PRIMARY KEY NOT NULL,
  `title_sw` text NOT NULL,
  `title_en` text NOT NULL,
  `description_sw` text,
  `description_en` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
  `id` text PRIMARY KEY NOT NULL,
  `kind` text NOT NULL,
  `storage` text NOT NULL,
  `uri` text NOT NULL,
  `mux_playback_id` text,
  `duration_sec` integer,
  `bytes` integer,
  `mime` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE TABLE `sermons` (
  `id` text PRIMARY KEY NOT NULL,
  `series_id` text REFERENCES `sermon_series`(`id`),
  `title_sw` text NOT NULL,
  `title_en` text NOT NULL,
  `preacher` text NOT NULL,
  `preached_on` text NOT NULL,
  `readings` text,
  `notes_sw` text,
  `notes_en` text,
  `video_asset_id` text REFERENCES `media_assets`(`id`),
  `audio_asset_id` text REFERENCES `media_assets`(`id`),
  `thumbnail_asset_id` text REFERENCES `media_assets`(`id`),
  `status` text NOT NULL DEFAULT 'draft',
  `published_at` integer,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `sermons_date_idx` ON `sermons` (`preached_on`);
--> statement-breakpoint
CREATE TABLE `live_streams` (
  `id` text PRIMARY KEY NOT NULL,
  `title_sw` text NOT NULL,
  `title_en` text NOT NULL,
  `status` text NOT NULL,
  `starts_at` integer NOT NULL,
  `mux_stream_key` text,
  `mux_playback_id` text,
  `youtube_url` text,
  `viewer_count` integer NOT NULL DEFAULT 0,
  `liturgy_sw` text,
  `readings` text,
  `archived_sermon_id` text REFERENCES `sermons`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE TABLE `announcements` (
  `id` text PRIMARY KEY NOT NULL,
  `title_sw` text NOT NULL,
  `title_en` text NOT NULL,
  `body_sw` text NOT NULL,
  `body_en` text NOT NULL,
  `status` text NOT NULL DEFAULT 'draft',
  `channel` text NOT NULL DEFAULT 'push',
  `publish_at` integer,
  `created_by` text REFERENCES `users`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `announcement_targets` (
  `id` text PRIMARY KEY NOT NULL,
  `announcement_id` text NOT NULL REFERENCES `announcements`(`id`),
  `audience` text NOT NULL,
  `jumuiya_id` text REFERENCES `jumuiya`(`id`),
  `group_id` text REFERENCES `groups`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE TABLE `reminders` (
  `id` text PRIMARY KEY NOT NULL,
  `kind` text NOT NULL,
  `title_sw` text NOT NULL,
  `title_en` text NOT NULL,
  `body_sw` text,
  `body_en` text,
  `fire_at` integer NOT NULL,
  `member_id` text REFERENCES `members`(`id`),
  `jumuiya_id` text REFERENCES `jumuiya`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE TABLE `notification_deliveries` (
  `id` text PRIMARY KEY NOT NULL,
  `channel` text NOT NULL,
  `status` text NOT NULL,
  `to_phone` text,
  `push_token` text,
  `announcement_id` text REFERENCES `announcements`(`id`),
  `reminder_id` text REFERENCES `reminders`(`id`),
  `provider_ref` text,
  `error` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE INDEX `deliveries_status_idx` ON `notification_deliveries` (`status`);
--> statement-breakpoint
CREATE TABLE `events` (
  `id` text PRIMARY KEY NOT NULL,
  `kind` text NOT NULL,
  `title_sw` text NOT NULL,
  `title_en` text NOT NULL,
  `starts_at` integer NOT NULL,
  `ends_at` integer,
  `place` text,
  `preacher` text,
  `readings` text,
  `jumuiya_id` text REFERENCES `jumuiya`(`id`),
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `event_rsvps` (
  `id` text PRIMARY KEY NOT NULL,
  `event_id` text NOT NULL REFERENCES `events`(`id`),
  `member_id` text NOT NULL REFERENCES `members`(`id`),
  `status` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_rsvps_uidx` ON `event_rsvps` (`event_id`, `member_id`);
--> statement-breakpoint
CREATE TABLE `liturgical_calendar` (
  `id` text PRIMARY KEY NOT NULL,
  `starts_on` text NOT NULL,
  `ends_on` text NOT NULL,
  `season` text NOT NULL,
  `sunday_name_sw` text NOT NULL,
  `sunday_name_en` text NOT NULL,
  `readings` text,
  `color_override` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE INDEX `liturgical_range_idx` ON `liturgical_calendar` (`starts_on`, `ends_on`);
--> statement-breakpoint
CREATE TABLE `daily_verses` (
  `id` text PRIMARY KEY NOT NULL,
  `for_date` text NOT NULL,
  `reference` text NOT NULL,
  `text_sw` text NOT NULL,
  `text_en` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_verses_date_uidx` ON `daily_verses` (`for_date`);
--> statement-breakpoint
CREATE TABLE `giving_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `key` text NOT NULL,
  `name_sw` text NOT NULL,
  `name_en` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `giving_categories_key_uidx` ON `giving_categories` (`key`);
--> statement-breakpoint
CREATE TABLE `projects` (
  `id` text PRIMARY KEY NOT NULL,
  `name_sw` text NOT NULL,
  `name_en` text NOT NULL,
  `goal_tzs` integer NOT NULL,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `pledges` (
  `id` text PRIMARY KEY NOT NULL,
  `member_id` text NOT NULL REFERENCES `members`(`id`),
  `category_id` text NOT NULL REFERENCES `giving_categories`(`id`),
  `project_id` text REFERENCES `projects`(`id`),
  `promised_tzs` integer NOT NULL,
  `due_on` text,
  `anonymous` integer NOT NULL DEFAULT 0,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `transactions` (
  `id` text PRIMARY KEY NOT NULL,
  `member_id` text REFERENCES `members`(`id`),
  `category_id` text NOT NULL REFERENCES `giving_categories`(`id`),
  `project_id` text REFERENCES `projects`(`id`),
  `pledge_id` text REFERENCES `pledges`(`id`),
  `amount_tzs` integer NOT NULL,
  `status` text NOT NULL,
  `network` text,
  `provider` text,
  `provider_ref` text,
  `idempotency_key` text NOT NULL,
  `anonymous` integer NOT NULL DEFAULT 0,
  `note` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_idem_uidx` ON `transactions` (`idempotency_key`);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_provider_ref_uidx` ON `transactions` (`provider_ref`);
--> statement-breakpoint
CREATE INDEX `transactions_status_idx` ON `transactions` (`status`);
--> statement-breakpoint
CREATE TABLE `receipts` (
  `id` text PRIMARY KEY NOT NULL,
  `transaction_id` text NOT NULL REFERENCES `transactions`(`id`),
  `number` text NOT NULL,
  `pdf_uri` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `receipts_number_uidx` ON `receipts` (`number`);
--> statement-breakpoint
CREATE TABLE `audit_log` (
  `id` text PRIMARY KEY NOT NULL,
  `actor_user_id` text REFERENCES `users`(`id`),
  `action` text NOT NULL,
  `entity` text NOT NULL,
  `entity_id` text,
  `before_json` text,
  `after_json` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `audit_log` (`entity`, `entity_id`);
--> statement-breakpoint
CREATE TABLE `church_profile` (
  `id` text PRIMARY KEY NOT NULL,
  `name_sw` text NOT NULL,
  `name_en` text NOT NULL,
  `short_name` text NOT NULL,
  `city` text NOT NULL,
  `sms_sender_id` text,
  `office_phone` text,
  `office_email` text,
  `created_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer)),
  `updated_at` integer NOT NULL DEFAULT (cast(unixepoch('subsec') * 1000 as integer))
);
