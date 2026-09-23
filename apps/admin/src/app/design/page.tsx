import { getDictionary } from '@ebenezer/shared';
import { auditTheme, dark, light, seasons, type ColorToken } from '@ebenezer/tokens';
import { House, User } from '@phosphor-icons/react/dist/ssr';
import { StoneMark } from '@/components/brand/stone-mark';
import { ThemeSwitch } from '@/components/theme-switch';
import { getServerCaller } from '@/server/trpc';
import Link from 'next/link';

const tokenOrder: ColorToken[] = [
  'bg',
  'surface',
  'ink',
  'inkMuted',
  'line',
  'gold',
  'season',
  'success',
  'danger',
  'goldLeaf',
];

const tokenLabel: Record<ColorToken, string> = {
  bg: 'bg',
  surface: 'surface',
  ink: 'ink',
  inkMuted: 'ink-muted',
  line: 'line',
  gold: 'gold',
  season: 'season',
  success: 'success',
  danger: 'danger',
  goldLeaf: 'gold-leaf',
};

export default async function DesignPage() {
  const copy = getDictionary('sw');
  const { caller, user } = await getServerCaller();
  const liturgy = await caller.liturgy.today();
  const verse = await caller.liturgy.verseToday();

  return (
    <main className="min-h-dvh bg-bg">
      <header
        className="h-1.5 w-full"
        style={{ background: liturgy.season.hex }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <StoneMark size={52} />
            <div>
              <p className="text-[13px] text-ink-muted">{copy.admin.design}</p>
              <h1 className="font-serif text-[32px] leading-tight">{copy.design.title}</h1>
              <p className="mt-2 max-w-xl text-ink-muted">{copy.design.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ThemeSwitch />
            <Link href="/ingia" className="text-[13px] text-gold">
              {user ? user.displayName : copy.auth.officeLogin}
            </Link>
          </div>
        </div>

        <section
          className="mt-8 overflow-hidden rounded-[var(--radius-sheet)]"
          style={{ background: liturgy.season.hex }}
        >
          <div className="flex items-center justify-between px-5 py-3 text-[15px] text-[#F6F4F0]">
            <p className="font-medium">{liturgy.season.sw}</p>
            <p>{liturgy.today?.sundayNameSw ?? copy.design.seasons}</p>
          </div>
        </section>
        <p className="mt-3 max-w-2xl text-[15px] text-ink-muted">{copy.design.seasonUse}</p>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <PaletteBoard title="Limestone asubuhi" tokens={light} mode="light" />
          <PaletteBoard title="Jiwe la jioni" tokens={dark} mode="dark" />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <p className="text-[13px] text-ink-muted">{copy.home.verseTitle}</p>
            <p className="mt-4 font-serif text-[32px] leading-[1.35]">
              {verse?.textSw ?? copy.design.verseSample}
            </p>
            <p className="mt-4 text-ink-muted">{verse?.reference ?? copy.markCite}</p>
            <p className="mt-6 text-[13px] text-ink-muted">{copy.design.serifUse}</p>
          </article>
          <article className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <p className="text-[13px] text-ink-muted">{copy.design.type}</p>
            <p className="mt-3 text-[20px]">{copy.design.sansUse}</p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="flex h-12 items-center rounded-[var(--radius-control)] bg-gold px-4 text-surface"
              >
                {copy.giving.give}
              </button>
              <p className="tabular text-[20px] text-ink">TSh 25,000</p>
              <div className="flex items-center gap-4 text-[13px] text-ink-muted">
                <span className="flex items-center gap-1 text-season">
                  <House weight="duotone" size={22} />
                  {copy.tabs.home}
                </span>
                <span className="flex items-center gap-1">
                  <User weight="regular" size={22} />
                  {copy.tabs.me}
                </span>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-[24px]">{copy.design.seasons}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(seasons).map(([key, season]) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3"
              >
                <span
                  className="h-12 w-12 rounded-[var(--radius-control)] border border-line"
                  style={{ background: season.hex }}
                />
                <div>
                  <p className="text-[15px]">{season.sw}</p>
                  <p className="text-[13px] text-ink-muted">{season.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { name: 'sheet', radius: 20 },
            { name: 'card', radius: 14 },
            { name: 'control', radius: 10 },
            { name: 'chip', radius: 999 },
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div
                className="mx-auto flex h-24 items-center justify-center bg-surface text-[13px] text-ink-muted"
                style={{
                  borderRadius: item.radius,
                  border: '1px solid var(--line)',
                }}
              >
                {item.radius}
              </div>
              <p className="mt-2 text-[13px] text-ink-muted">{item.name}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-[24px]">{copy.design.contrast}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-ink-muted">
                  <th className="py-2 font-medium">Jozi</th>
                  <th className="py-2 font-medium">Mwanga</th>
                  <th className="py-2 font-medium">Giza</th>
                </tr>
              </thead>
              <tbody>
                {auditTheme('light').map((row, index) => {
                  const darkRow = auditTheme('dark')[index];
                  return (
                    <tr key={row.name} className="border-b border-line">
                      <td className="py-2">{row.name}</td>
                      <td className={row.pass ? 'text-success' : 'text-danger'}>
                        {row.ratio} {row.pass ? 'AA' : 'fail'}
                      </td>
                      <td className={darkRow?.pass ? 'text-success' : 'text-danger'}>
                        {darkRow?.ratio} {darkRow?.pass ? 'AA' : 'fail'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function PaletteBoard({
  title,
  tokens,
  mode,
}: {
  title: string;
  tokens: { [K in ColorToken]: string };
  mode: 'light' | 'dark';
}) {
  return (
    <div
      className="rounded-[var(--radius-sheet)] p-5"
      style={{ background: tokens.bg, color: tokens.ink }}
    >
      <p className="font-serif text-[22px]">{title}</p>
      <p className="mt-1 text-[13px]" style={{ color: tokens.inkMuted }}>
        {mode === 'light' ? 'Limestone at morning' : 'Stone at evening service'}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {tokenOrder.map((key) => (
          <div key={key} className="flex items-end gap-3">
            <span
              className="h-16 w-14 shrink-0"
              style={{
                background: tokens[key],
                border: `1px solid ${tokens.line}`,
                borderRadius: key === 'bg' ? 20 : key === 'surface' ? 14 : 10,
              }}
            />
            <div>
              <p className="text-[13px]">{tokenLabel[key]}</p>
              <p className="text-[12px]" style={{ color: tokens.inkMuted }}>
                {tokens[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
