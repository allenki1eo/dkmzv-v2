import { describe, expect, it } from 'vitest';
import { resolveLiturgicalDay } from './season';

describe('resolveLiturgicalDay', () => {
  it('prefers the most specific covering window', () => {
    const day = resolveLiturgicalDay(
      [
        {
          startsOn: '2026-05-25',
          endsOn: '2026-11-28',
          season: 'ordinary',
          sundayNameSw: 'Kipindi cha Kawaida',
          sundayNameEn: 'Ordinary time',
        },
        {
          startsOn: '2026-09-20',
          endsOn: '2026-09-26',
          season: 'ordinary',
          sundayNameSw: 'Jumapili ya 16 baada ya Pentekoste',
          sundayNameEn: '16th Sunday after Pentecost',
        },
      ],
      new Date('2026-09-23T08:00:00.000Z'),
    );
    expect(day?.sundayNameSw).toBe('Jumapili ya 16 baada ya Pentekoste');
  });
});
