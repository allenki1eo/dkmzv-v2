import { getDictionary } from '@ebenezer/shared';
import { seasons } from '@ebenezer/tokens';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function KalendaPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const data = await caller.office.calendar();
  return (
    <main>
      <h1 className="font-serif text-[32px]">{copy.admin.calendar}</h1>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {data.liturgy.map((row) => (
          <li key={row.id} className="flex items-center gap-4 py-3">
            <span
              className="h-10 w-3"
              style={{ background: row.colorOverride ?? seasons[row.season].hex }}
            />
            <div>
              <p>{row.sundayNameSw}</p>
              <p className="text-[13px] text-ink-muted">
                {row.startsOn} – {row.endsOn}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-[22px]">Matukio</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {data.events.map((event) => (
          <li key={event.id} className="flex justify-between gap-4 py-3">
            <span>{event.titleSw}</span>
            <span className="text-ink-muted">{event.place}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
