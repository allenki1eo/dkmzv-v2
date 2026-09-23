import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/server/trpc';

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string | null };
  const jar = await cookies();
  if (!body.token) {
    jar.delete(SESSION_COOKIE);
    return Response.json({ ok: true });
  }
  jar.set(SESSION_COOKIE, body.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
