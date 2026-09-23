# KKKT Usharika wa Ebenezer

Swahili-first member app and parish office for KKKT Usharika wa Ebenezer.

The member app (Nyumbani, mahubiri with audio, jumuiya, sadaka, mimi) and the parish office on the web share one backend. Swahili is the default language. Liturgical season colour appears only on the home band, the active tab, and the live badge.

## What changed from a generic church template

- **Standing stone mark**, not a clip-art cross or dove. The name is a marker: *hata sasa BWANA ametusaidia*.
- **Liturgical season is the only chromatic accent.** Everything else stays limestone / evening stone.
- **Phone + OTP first** (Africa's Talking when keys exist, local code `255255` in development). Office email is an overlay, not the front door.
- **`@ebenezer/*` packages**, not a SaaS `@repo` kit. No Clerk, Stripe, Inter, or Geist.
- **Jumuiya, sadaka, mahubiri, liturgia** are first-class tables — not “small groups” and “donations”.
- **Success / danger** are clay and garden green, not Material red/green.
- Design pages are a **chumba cha alama** (vestry sample board), not a Storybook token dump.

## Folder tree

```
ebenezer/
├─ apps/
│  ├─ mobile/          Expo, expo-router, NativeWind, Reanimated
│  └─ admin/           Next.js App Router, token CSS, tRPC
├─ packages/
│  ├─ tokens/          semantic colour, type, radius, contrast
│  ├─ shared/          i18n (sw default), zod, phone / TZS / season
│  ├─ db/              Drizzle + Turso/libSQL, schema, seed
│  └─ api/             tRPC routers + OTP providers
├─ turbo.json
└─ pnpm-workspace.yaml
```

## Android APK

The member app is built as a **sideloadable APK** (`tz.kkkt.ebenezer`), not an Expo Go project and not a Play Store AAB by default.

```bash
pnpm apk
```

That installs a local Android SDK if needed, runs `expo prebuild`, and writes:

`apps/mobile/dist/ebenezer-0.2.0.apk`

Download the current build (versionCode 2):

https://github.com/allenki1eo/dkmzv-v2/raw/refs/heads/cursor/phase-1-foundation-567a/apps/mobile/dist/ebenezer-0.2.0.apk

Install on a phone with:

```bash
adb install -r apps/mobile/dist/ebenezer-0.2.0.apk
```

Or copy the file to the phone and open it. On first install Android will ask to allow apps from this source. This build is signed with the Android debug key so it can be installed for review. A parish release key is still needed before a public store listing.

The parish office web build is `pnpm --filter @ebenezer/admin build`. The member app in a browser is `pnpm --filter @ebenezer/mobile export:web` (`apps/mobile/dist-web`).

Cloud build (needs an Expo login):

```bash
pnpm --filter @ebenezer/mobile apk:eas
```

`eas.json` profiles `preview` and `production` both set `android.buildType` to `apk`. Use `store` only if you later want an AAB for Play Console.

## Run the web office

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm --filter @ebenezer/admin build
pnpm --filter @ebenezer/admin start
```

- Office: http://localhost:3000/ofisi
- Door: http://localhost:3000/ingia
- Design room: http://localhost:3000/design
- Parish JSON: http://localhost:3000/api/parish
- Seed office login: `mchungaji@ebenezer.or.tz` / `JiweLaMsaada2026`
- Same password for `katibu@`, `mhazini@`, and `media@ebenezer.or.tz`
- Dev OTP: `255255` for `0712000001`

The office covers the dashboard, waumini, jumuiya, mahubiri (draft and publish), live service, sadaka ledger with CSV, matangazo, liturgical calendar, and parish settings.

## Member app in a browser

```bash
pnpm --filter @ebenezer/mobile export:web
```

Static files land in `apps/mobile/dist-web`. On the phone, open the app and choose **Ingia bila mtandao** when the API is not reachable. With `EXPO_PUBLIC_API_URL` set, Nyumbani reads `GET /api/parish`.

## Token file

See `packages/tokens/src/colors.ts`. Semantic names only: `bg`, `surface`, `ink`, `ink-muted`, `line`, `gold`, `season`, `success`, `danger`.

## Schema

See `packages/db/src/schema/index.ts`. ULIDs, integer TZS, application-layer roles, OTP + sessions, liturgical calendar, giving ledger.

## Wireframes

### Nyumbani

```
┌ season band: Majilio / Jumapili ya 3 ya Majilio ─┐
│                                                  │
│  Neno la Leo                                     │
│  Hata sasa BWANA                                 │
│  ametusaidia.                                    │
│  1 Samweli 7:12                                  │
│  [Shiriki kama picha]                            │
│                                                  │
│  Ibada inaendelea          (only if live)        │
│  beji ya season · Jiunge sasa                    │
│                                                  │
│  Ibada ijayo                                     │
│  Jumapili 07:00                                  │
│  Mchungaji Yohana Mwanga                         │
│  Zaburi 121                                      │
│                                                  │
│  Matangazo                                       │
│  Kipaimara cha vijana                            │
│  Siku ya kufunga                                 │
│  Ona yote                                        │
│                                                  │
│  ┌ mini player ────────────────────────────────┐ │
│  Nyumbani  Mahubiri  Jumuiya  Sadaka  Mimi       │
└──────────────────────────────────────────────────┘
```

### Sermon detail

```
┌ player (video / sauti)                           ┐
│ kichwa cha hubiri — Literata                     │
│ mhubiri                                          │
│ tarehe                                           │
│ masomo                                           │
│ maelezo                                          │
│ [Pakua hubiri]   kasi 1x   usingizi              │
└──────────────────────────────────────────────────┘
```

### Sadaka

```
1. Aina        2. Kiasi         3. Mtandao
   Sadaka         TSh 25,000       M-Pesa
   Zaka           [5k 10k 20k]     Mixx
   Shukrani       keypad           Airtel Money
   Ahadi
   Mradi

4. Thibitisha   5. Subiri STK    6. Risiti
   Toa sadaka      hali wazi        namba + kiasi
```

Later phases: content, jumuiya, giving, live, polish. Stop after each phase.
