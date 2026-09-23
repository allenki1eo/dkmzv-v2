export const seasonKeys = [
  'advent',
  'christmas',
  'epiphany',
  'ordinary',
  'lent',
  'easter',
  'pentecost',
] as const;

export type SeasonKey = (typeof seasonKeys)[number];

export type LiturgicalDay = {
  startsOn: string;
  endsOn: string;
  season: SeasonKey;
  sundayNameSw: string;
  sundayNameEn: string;
  readings?: string | null;
};

export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function resolveLiturgicalDay(
  days: LiturgicalDay[],
  on: Date = new Date(),
): LiturgicalDay | null {
  const key = toDateOnly(on);
  const covering = days.filter((day) => day.startsOn <= key && day.endsOn >= key);
  covering.sort((a, b) => (a.startsOn < b.startsOn ? 1 : -1));
  return covering[0] ?? null;
}

export function isWhiteSeason(season: SeasonKey): boolean {
  return season === 'christmas' || season === 'easter';
}
