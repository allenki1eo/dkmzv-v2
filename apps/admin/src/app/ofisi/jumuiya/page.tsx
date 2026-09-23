import { getDictionary } from '@ebenezer/shared';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function JumuiyaPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const rows = await caller.office.jumuiya();
  return (
    <main>
      <h1 className="font-serif text-[32px]">{copy.admin.jumuiya}</h1>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.id} className="grid gap-1 py-4 md:grid-cols-[1fr_1fr_auto]">
            <p className="font-serif text-[20px]">{row.name}</p>
            <p className="text-ink-muted">
              {row.meetingDay}
              <span className="mt-1 block">{row.meetingPlace}</span>
            </p>
            <p className="tabular text-[15px]">{row.members}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
