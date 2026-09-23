import { loadParishHome } from '@ebenezer/api';
import { getDb } from '@ebenezer/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const home = await loadParishHome(getDb());
  return Response.json(home);
}
