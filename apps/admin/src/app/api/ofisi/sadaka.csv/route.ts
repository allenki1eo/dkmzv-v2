import { formatTzs } from '@ebenezer/shared';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { user, caller } = await getServerCaller();
  if (!user?.roles.some((role) => role === 'mchungaji' || role === 'mhazini' || role === 'msomaji')) {
    return new Response('Huna ruhusa.', { status: 403 });
  }
  const ledger = await caller.office.ledger();
  const lines = [
    'aina,mtandao,hali,kiasi',
    ...ledger.rows.map(
      (row) =>
        `${row.category},${row.network ?? ''},${row.status},${formatTzs(row.amountTzs, 'sw')}`,
    ),
  ];
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="sadaka-ebenezer.csv"',
    },
  });
}
