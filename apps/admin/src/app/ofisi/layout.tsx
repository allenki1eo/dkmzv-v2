import { redirect } from 'next/navigation';
import { OfficeFrame } from '@/components/office/frame';
import { getServerCaller } from '@/server/trpc';

export const dynamic = 'force-dynamic';

export default async function OfficeLayout({ children }: { children: React.ReactNode }) {
  const { caller, user } = await getServerCaller();
  if (!user || user.roles.length === 0) redirect('/ingia');
  const liturgy = await caller.liturgy.today();
  return (
    <OfficeFrame name={user.displayName} season={liturgy.season.hex}>
      {children}
    </OfficeFrame>
  );
}
