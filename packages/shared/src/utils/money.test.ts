import { describe, expect, it } from 'vitest';
import { formatTzs } from './money';

describe('formatTzs', () => {
  it('uses tabular TSh copy, never a currency symbol soup', () => {
    expect(formatTzs(25000, 'en')).toBe('TSh 25,000');
  });
});
