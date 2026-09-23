import { getDictionary } from '@ebenezer/shared';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const profile = await caller.office.profile();
  return (
    <main>
      <h1 className="font-serif text-[32px]">{copy.admin.settings}</h1>
      <p className="mt-4 font-serif text-[22px]">{profile.church?.nameSw}</p>
      <p className="text-ink-muted">{profile.church?.city}</p>
      <p className="mt-2 text-[15px]">{profile.church?.officePhone}</p>
      <h2 className="mt-10 font-serif text-[22px]">{copy.admin.audit}</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {profile.log.map((row) => (
          <li key={row.id} className="py-3">
            <p>
              {row.action} · {row.entity}
            </p>
            <p className="text-[13px] text-ink-muted">{row.entityId}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
