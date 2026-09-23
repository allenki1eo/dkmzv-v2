import { getDictionary } from '@ebenezer/shared';
import { LiveButtons } from '@/components/office/forms';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function LivePage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const rows = await caller.office.live();
  return (
    <main>
      <h1 className="font-serif text-[32px]">{copy.admin.live}</h1>
      <ul className="mt-8 space-y-6">
        {rows.map((row) => (
          <li key={row.id} className="border-t border-line pt-4">
            <p className="font-serif text-[22px]">{row.titleSw}</p>
            <p className="mt-1 text-ink-muted">{row.readings}</p>
            <p className="tabular mt-2 text-[15px]">
              {copy.admin.viewersNow}: {row.viewerCount}
            </p>
            <div className="mt-4">
              <LiveButtons id={row.id} status={row.status} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
