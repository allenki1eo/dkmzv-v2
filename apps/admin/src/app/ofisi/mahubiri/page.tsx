import { getDictionary } from '@ebenezer/shared';
import { PublishButton, SermonDraftForm } from '@/components/office/forms';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function MahubiriPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const rows = await caller.office.sermons();
  return (
    <main>
      <h1 className="font-serif text-[32px]">{copy.admin.sermons}</h1>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="font-serif text-[18px]">{row.titleSw}</p>
              <p className="text-[13px] text-ink-muted">
                {row.preacher}
                <span className="mt-1 block">{row.preachedOn}</span>
              </p>
            </div>
            <PublishButton id={row.id} status={row.status} />
          </li>
        ))}
      </ul>
      <SermonDraftForm />
    </main>
  );
}
