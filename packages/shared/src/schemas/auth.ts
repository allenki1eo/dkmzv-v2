import { z } from 'zod';
import { tzPhoneSchema } from '../utils/phone';

export const requestOtpSchema = z.object({
  phone: tzPhoneSchema,
  locale: z.enum(['sw', 'en']).default('sw'),
});

export const verifyOtpSchema = z.object({
  phone: tzPhoneSchema,
  code: z.string().regex(/^\d{6}$/),
  displayName: z.string().trim().min(2).max(80).optional(),
});

export const officeLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const roleKeys = [
  'mchungaji',
  'katibu',
  'mhazini',
  'media',
  'kiongozi_jumuiya',
  'msomaji',
] as const;

export type RoleKey = (typeof roleKeys)[number];

export const officeRoles: RoleKey[] = [
  'mchungaji',
  'katibu',
  'mhazini',
  'media',
  'kiongozi_jumuiya',
  'msomaji',
];
