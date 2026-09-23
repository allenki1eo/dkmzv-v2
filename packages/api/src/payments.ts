import { createHmac, timingSafeEqual } from 'node:crypto';

export type StkRequest = {
  phone: string;
  amountTzs: number;
  idempotencyKey: string;
  reference: string;
};

export type StkResult = {
  providerRef: string;
  status: 'pending' | 'success' | 'failed';
};

/** Aggregator boundary. Selcom or AzamPay can implement this later. */
export interface PaymentProvider {
  readonly name: string;
  stkPush(input: StkRequest): Promise<StkResult>;
}

export class DevPaymentProvider implements PaymentProvider {
  readonly name = 'ebenezer-dev';

  async stkPush(input: StkRequest): Promise<StkResult> {
    return {
      providerRef: `DEV-${input.idempotencyKey.slice(0, 12)}`,
      status: 'pending',
    };
  }
}

export function paymentProvider(): PaymentProvider {
  return new DevPaymentProvider();
}

export function signWebhook(body: string, secret = process.env.PAYMENTS_WEBHOOK_SECRET ?? 'ebenezer-dev'): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

export function verifyWebhook(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = signWebhook(body);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
