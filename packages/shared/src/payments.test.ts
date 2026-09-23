import { describe, expect, it } from 'vitest';
import { nextLedgerStatus, receiptNumber } from './payments';

describe('ledger', () => {
  it('ignores a second success webhook', () => {
    expect(nextLedgerStatus('success', 'success')).toBe('success');
    expect(nextLedgerStatus('success', 'failed')).toBe('success');
  });

  it('does not turn a failed gift into a success without a new attempt', () => {
    expect(nextLedgerStatus('failed', 'success')).toBe('failed');
    expect(nextLedgerStatus('pending', 'success')).toBe('success');
  });

  it('prints a parish receipt number', () => {
    expect(receiptNumber(12, 2026)).toBe('EB-2026-0012');
  });
});
