# KKKT Usharika wa Ebenezer

Swahili-first member app and parish office for KKKT Usharika wa Ebenezer.

Phase 1 is the foundation: monorepo, tokens, both themes, i18n, Drizzle schema + seed, phone OTP, and the two design rooms (`/design` on admin, `/design` on mobile).

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

`apps/mobile/dist/ebenezer-0.1.0.apk`

Install on a phone with:

```bash
adb install apps/mobile/dist/ebenezer-0.1.0.apk
```

Or copy the file to the phone and open it. On first install Android will ask to allow apps from this source.

Cloud build (needs an Expo login):

```bash
pnpm --filter @ebenezer/mobile apk:eas
```

`eas.json` profiles `preview` and `production` both set `android.buildType` to `apk`. Use `store` only if you later want an AAB for Play Console.

## Run Phase 1

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev:admin
```

- Design room: http://localhost:3000/design
- Office door: http://localhost:3000/ingia
- Seed office login: `mchungaji@ebenezer.or.tz` / `JiweLaMsaada2026`
- Dev OTP: `255255` for `0712000001`

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
