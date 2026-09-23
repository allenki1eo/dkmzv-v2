import { z } from 'zod';

/** Tanzania mobile: +255 6xx / 7xx, eight digits after the country code. */
const TZ_MOBILE = /^\+255[67]\d{8}$/;

export function normalizeTzPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('255') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+255${digits.slice(1)}`;
  }
  if (digits.length === 9 && (digits.startsWith('6') || digits.startsWith('7'))) {
    return `+255${digits}`;
  }
  if (input.trim().startsWith('+255')) {
    return `+${digits}`;
  }
  return input.trim();
}

export function isTzMobile(phone: string): boolean {
  return TZ_MOBILE.test(normalizeTzPhone(phone));
}

export const tzPhoneSchema = z
  .string()
  .trim()
  .min(9)
  .transform(normalizeTzPhone)
  .refine(isTzMobile, { message: 'Namba ya simu si sahihi. Tumia namba ya Tanzania.' });

export function maskPhone(phone: string): string {
  const normalized = normalizeTzPhone(phone);
  if (!isTzMobile(normalized)) return phone;
  return `${normalized.slice(0, 6)}***${normalized.slice(-3)}`;
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizeTzPhone(phone);
  if (!isTzMobile(normalized)) return phone;
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7, 10)} ${normalized.slice(10)}`;
}
