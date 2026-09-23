/** Integer TZS in, never a float. */
export function formatTzs(amount: number, locale: 'sw' | 'en' = 'sw'): string {
  const formatted = new Intl.NumberFormat(locale === 'sw' ? 'sw-TZ' : 'en-TZ', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `TSh ${formatted}`;
}

export function parseTzsInput(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  return Number.parseInt(digits, 10);
}
