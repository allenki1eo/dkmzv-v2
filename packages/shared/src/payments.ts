export type LedgerStatus = 'pending' | 'success' | 'failed' | 'reversed';

/**
 * A confirmed gift is never rewritten by a late or repeated webhook.
 * Pending may become success or failed. Failed may be retried into pending.
 */
export function nextLedgerStatus(current: LedgerStatus, incoming: LedgerStatus): LedgerStatus {
  if (current === 'success' || current === 'reversed') return current;
  if (current === 'failed' && incoming === 'success') return 'failed';
  return incoming;
}

export function receiptNumber(sequence: number, year = new Date().getFullYear()): string {
  return `EB-${year}-${String(sequence).padStart(4, '0')}`;
}
