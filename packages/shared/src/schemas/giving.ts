import { z } from 'zod';
import { tzPhoneSchema } from '../utils/phone';

export const givingCategoryKeys = ['sadaka', 'zaka', 'shukrani', 'ahadi', 'mradi'] as const;
export const paymentNetworks = ['mpesa', 'mixx', 'airtel', 'cash'] as const;

export const startGivingSchema = z.object({
  categoryKey: z.enum(givingCategoryKeys),
  amountTzs: z.number().int().positive().max(10_000_000),
  network: z.enum(paymentNetworks),
  phone: tzPhoneSchema,
  idempotencyKey: z.string().trim().min(8).max(80),
  anonymous: z.boolean().default(false),
});

export const webhookSchema = z.object({
  providerRef: z.string().min(3),
  idempotencyKey: z.string().min(8),
  status: z.enum(['pending', 'success', 'failed', 'reversed']),
  amountTzs: z.number().int().positive(),
});
