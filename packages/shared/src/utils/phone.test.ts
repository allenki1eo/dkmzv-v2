import { describe, expect, it } from 'vitest';
import { formatPhoneDisplay, isTzMobile, normalizeTzPhone } from './phone';

describe('normalizeTzPhone', () => {
  it('accepts local 0-prefixed numbers', () => {
    expect(normalizeTzPhone('0712 345 678')).toBe('+255712345678');
  });

  it('accepts nine-digit mobile numbers', () => {
    expect(normalizeTzPhone('712345678')).toBe('+255712345678');
  });

  it('accepts international form', () => {
    expect(normalizeTzPhone('+255712345678')).toBe('+255712345678');
  });

  it('rejects landline-looking prefixes', () => {
    expect(isTzMobile(normalizeTzPhone('0222123456'))).toBe(false);
  });

  it('formats for reading aloud', () => {
    expect(formatPhoneDisplay('0712345678')).toBe('+255 712 345 678');
  });
});
