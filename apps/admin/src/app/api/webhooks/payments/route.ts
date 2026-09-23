import { appRouter, createContext, verifyWebhook } from '@ebenezer/api';
import { webhookSchema } from '@ebenezer/shared';

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhook(raw, request.headers.get('x-ebenezer-signature'))) {
    return Response.json({ error: 'Sahihi haikubaliwa.' }, { status: 401 });
  }
  const parsed = webhookSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    return Response.json({ error: 'Ujumbe si sahihi.' }, { status: 400 });
  }
  const caller = appRouter.createCaller(await createContext({}));
  const result = await caller.giving.applyWebhook(parsed.data);
  return Response.json({ ok: true, status: result?.transaction?.status ?? null });
}
