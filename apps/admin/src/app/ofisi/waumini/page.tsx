import { getDictionary } from '@ebenezer/shared';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function WauminiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const copy = getDictionary('sw');
  const { q } = await searchParams;
  const { caller } = await getServerCaller();
  const rows = await caller.office.members({ q });

  return (
    <main>
      <h1 className="font-serif text-[32px]">{copy.admin.members}</h1>
      <form className="mt-6" action="/ofisi/waumini">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tafuta kwa jina la ukoo"
          className="h-12 w-full max-w-sm rounded-[var(--radius-control)] border border-line bg-surface px-3"
        />
      </form>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={`${row.id}-${row.jumuiya}`} className="grid grid-cols-[1.4fr_1fr_auto] gap-3 py-3">
            <span>
              {row.firstName} {row.lastName}
            </span>
            <span className="text-ink-muted">{row.jumuiya ?? 'Bila jumuiya'}</span>
            <span className="text-[13px] text-ink-muted">{row.status}</span>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? <p className="mt-6 text-ink-muted">{copy.states.empty}</p> : null}
    </main>
  );
}
