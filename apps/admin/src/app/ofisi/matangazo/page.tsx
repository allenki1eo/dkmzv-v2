import { getDictionary } from '@ebenezer/shared';
import { AnnouncementForm } from '@/components/office/forms';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function MatangazoPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const rows = await caller.office.announcements();
  return (
    <main className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="font-serif text-[32px]">{copy.admin.announcements}</h1>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <li key={row.id} className="py-4">
              <p className="font-serif text-[20px]">{row.titleSw}</p>
              <p className="mt-1 text-ink-muted">{row.bodySw}</p>
              <p className="mt-2 text-[13px] text-ink-muted">{row.channel}</p>
            </li>
          ))}
        </ul>
      </section>
      <AnnouncementForm />
    </main>
  );
}
