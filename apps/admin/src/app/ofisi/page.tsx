import { formatTzs, getDictionary } from '@ebenezer/shared';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const dash = await caller.office.dashboard();

  const figures = [
    { label: copy.admin.members, value: String(dash.members) },
    { label: copy.admin.finance, value: formatTzs(dash.receivedTzs, 'sw') },
    { label: copy.admin.viewersNow, value: String(dash.viewers) },
  ];

  return (
    <main>
      <p className="text-[13px] text-ink-muted">{copy.admin.thisSunday}</p>
      <h1 className="font-serif text-[32px] leading-tight">{copy.admin.dashboard}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {figures.map((item) => (
          <section key={item.label} className="border-t border-line pt-3">
            <p className="text-[13px] text-ink-muted">{item.label}</p>
            <p className="tabular mt-2 font-serif text-[28px]">{item.value}</p>
          </section>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="font-serif text-[22px]">{copy.admin.calendar}</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {dash.upcoming.map((event) => (
            <li key={event.id} className="flex items-baseline justify-between gap-4 py-3">
              <span>{event.titleSw}</span>
              <span className="text-[13px] text-ink-muted">{event.place}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
