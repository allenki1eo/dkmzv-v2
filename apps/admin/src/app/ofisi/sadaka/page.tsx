import { formatTzs, getDictionary } from '@ebenezer/shared';
import Link from 'next/link';
import { CashForm } from '@/components/office/forms';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function SadakaPage() {
  const copy = getDictionary('sw');
  const { caller } = await getServerCaller();
  const ledger = await caller.office.ledger();
  const max = Math.max(...ledger.byCategory.map((row) => row.total), 1);

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-[32px]">{copy.admin.finance}</h1>
        <Link href="/api/ofisi/sadaka.csv" className="text-gold">
          {copy.admin.exportCsv}
        </Link>
      </div>
      <section className="mt-8 grid gap-3">
        {ledger.byCategory.map((row) => (
          <div key={row.category}>
            <div className="flex justify-between text-[13px] text-ink-muted">
              <span>{row.category}</span>
              <span className="tabular">{formatTzs(row.total, 'sw')}</span>
            </div>
            <div className="mt-1 h-2 bg-line">
              <div className="h-2 bg-gold" style={{ width: `${Math.round((row.total / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </section>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {ledger.rows.map((row) => (
          <li key={row.id} className="grid grid-cols-[1fr_auto_auto] gap-3 py-3">
            <span>{row.category}</span>
            <span className="text-[13px] text-ink-muted">{row.network}</span>
            <span className="tabular">{formatTzs(row.amountTzs, 'sw')}</span>
          </li>
        ))}
      </ul>
      <section className="mt-10 max-w-md">
        <h2 className="font-serif text-[22px]">{copy.admin.cashEntry}</h2>
        <div className="mt-4">
          <CashForm />
        </div>
      </section>
    </main>
  );
}
