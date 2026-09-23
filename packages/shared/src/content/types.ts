export type ParishSermon = {
  id: string;
  titleSw: string;
  titleEn: string;
  preacher: string;
  preachedOn: string;
  readings: string;
  notesSw: string;
  notesEn: string;
  seriesSw: string;
  seriesEn: string;
  minutes: number;
};

export type ParishJumuiya = {
  id: string;
  name: string;
  leader: string;
  day: string;
  place: string;
  members: number;
};

export type ParishHome = {
  source: 'network' | 'saved';
  season: {
    key: string;
    sw: string;
    en: string;
    hex: string;
    sundaySw: string;
    sundayEn: string;
    readings: string;
  };
  verse: { reference: string; textSw: string; textEn: string };
  live: {
    titleSw: string;
    titleEn: string;
    viewers: number;
    liturgySw: string;
    readings: string;
  } | null;
  nextService: {
    titleSw: string;
    titleEn: string;
    whenSw: string;
    whenEn: string;
    preacher: string;
    readings: string;
    place: string;
  };
  announcements: Array<{
    id: string;
    titleSw: string;
    titleEn: string;
    bodySw: string;
    bodyEn: string;
    whenSw: string;
  }>;
  reminders: Array<{ id: string; titleSw: string; titleEn: string; time: string }>;
  jumuiya: ParishJumuiya[];
  sermons: ParishSermon[];
  categories: Array<{ key: 'sadaka' | 'zaka' | 'shukrani' | 'ahadi' | 'mradi'; nameSw: string; nameEn: string }>;
};
