import type { ParishHome } from './types';

/** Saved parish content so the app still opens on a slow or empty network. */
export const bundledParish: ParishHome = {
  source: 'saved',
  season: {
    key: 'ordinary',
    sw: 'Kipindi cha Kawaida',
    en: 'Ordinary time',
    hex: '#4F6B3A',
    sundaySw: 'Jumapili ya 16 baada ya Pentekoste',
    sundayEn: '16th Sunday after Pentecost',
    readings: 'Zaburi 121; Warumi 12:1-8; Mathayo 16:13-20',
  },
  verse: {
    reference: 'Mathayo 11:28',
    textSw: 'Njoni kwangu, ninyi nyote msumbukao na kulemewa, nami nitawapumzisha.',
    textEn: 'Come to me, all who labour and are heavy laden, and I will give you rest.',
  },
  live: {
    titleSw: 'Ibada ya Jumapili',
    titleEn: 'Sunday service',
    viewers: 86,
    liturgySw: 'Utangulizi, kukiri, Neno, mahubiri, sadaka, baraka',
    readings: 'Zaburi 121; Warumi 12:1-8; Mathayo 16:13-20',
  },
  nextService: {
    titleSw: 'Ibada ya Jumapili',
    titleEn: 'Sunday service',
    whenSw: 'Jumapili, saa 1:00 asubuhi',
    whenEn: 'Sunday, 7:00 in the morning',
    preacher: 'Mchungaji Yohana Mwanga',
    readings: 'Zaburi 121; Warumi 12:1-8; Mathayo 16:13-20',
    place: 'Kanisa kuu',
  },
  announcements: [
    {
      id: 'tangazo-kipaimara',
      titleSw: 'Kipaimara cha vijana',
      titleEn: 'Youth confirmation',
      bodySw: 'Mazoezi ya mwisho ni Jumamosi saa 4 asubuhi. Waumini wote mnakaribishwa.',
      bodyEn: 'Final rehearsal is Saturday at 10 in the morning. The whole parish is welcome.',
      whenSw: 'Jana',
    },
    {
      id: 'tangazo-funga',
      titleSw: 'Siku ya kufunga',
      titleEn: 'Fasting day',
      bodySw: 'Jumatano hii ni siku ya kufunga na kuomba kwa ajili ya familia za usharika.',
      bodyEn: 'This Wednesday is a day of fasting and prayer for parish families.',
      whenSw: 'Leo',
    },
    {
      id: 'tangazo-paa',
      titleSw: 'Mchango wa paa',
      titleEn: 'Roof fund',
      bodySw: 'Mhazini atatoa taarifa ya paa baada ya ibada. Asante kwa ahadi zenu.',
      bodyEn: 'The treasurer will report on the roof after the service. Thank you for your pledges.',
      whenSw: 'Wiki hii',
    },
  ],
  reminders: [
    { id: 'sala', titleSw: 'Sala ya asubuhi', titleEn: 'Morning prayer', time: '06:00' },
    { id: 'jumuiya', titleSw: 'Kikao cha Jumuiya ya Amani', titleEn: 'Amani jumuiya meeting', time: '16:00' },
    { id: 'funga', titleSw: 'Siku ya kufunga', titleEn: 'Fasting day', time: 'Jumatano' },
  ],
  jumuiya: [
    { id: 'amani', name: 'Amani', leader: 'Neema Mwanga', day: 'Jumatano', place: 'Nyumba ya Mama Neema, Mbezi', members: 7 },
    { id: 'upendo', name: 'Upendo', leader: 'Amani Kimaro', day: 'Alhamisi', place: 'Ukumbi mdogo, kanisa', members: 7 },
    { id: 'imani', name: 'Imani', leader: 'Baraka Ngowi', day: 'Jumanne', place: 'Nyumba ya Ndugu Petro, Tegeta', members: 7 },
    { id: 'tumaini', name: 'Tumaini', leader: 'Rehema Mushi', day: 'Ijumaa', place: 'Shule ya awali, Goba', members: 7 },
    { id: 'neema', name: 'Neema', leader: 'Yohana Lyimo', day: 'Jumatano', place: 'Nyumba ya Mama Joyce, Makongo', members: 6 },
    { id: 'mwanga', name: 'Mwanga', leader: 'Maria Swai', day: 'Alhamisi', place: 'Chumba cha kwaya', members: 6 },
  ],
  sermons: [
    ['Jiwe lililosimama', 'The stone that was set up', '1 Samweli 7:12', 'Jiwe la msaada'],
    ['Usisahau yaliyopita', 'Do not forget what has passed', '1 Samweli 7:3-12', 'Jiwe la msaada'],
    ['BWANA ametusaidia', 'The LORD has helped us', 'Zaburi 46', 'Jiwe la msaada'],
    ['Mwanga asubuhi', 'Light in the morning', 'Zaburi 5', 'Jiwe la msaada'],
    ['Simama mahali pako', 'Stand in your place', 'Waefeso 6:10-18', 'Jiwe la msaada'],
    ['Msaada wa siri', 'Help in secret', 'Mathayo 6:6', 'Jiwe la msaada'],
    ['Neno likawa mwili', 'The Word became flesh', 'Yohana 1:1-14', 'Neno linakaa kwetu'],
    ['Nuru inang’aa gizani', 'Light shines in the dark', 'Yohana 1:5', 'Neno linakaa kwetu'],
    ['Njoo uone', 'Come and see', 'Yohana 1:39', 'Neno linakaa kwetu'],
    ['Maji ya uzima', 'Living water', 'Yohana 4:7-15', 'Neno linakaa kwetu'],
    ['Mimi ni mkate', 'I am the bread', 'Yohana 6:35', 'Neno linakaa kwetu'],
    ['Amani nawaachieni', 'Peace I leave with you', 'Yohana 14:27', 'Neno linakaa kwetu'],
  ].map((row, index) => {
    const titleSw = row[0] ?? '';
    const titleEn = row[1] ?? '';
    const readings = row[2] ?? '';
    const seriesSw = row[3] ?? '';
    return {
      id: `hubiri-${index + 1}`,
      titleSw,
      titleEn,
      preacher: index % 3 === 0 ? 'Mchungaji Yohana Mwanga' : 'Mchungaji Msaidizi Asha Lyimo',
      preachedOn: `2026-0${(index % 6) + 1}-14`,
      readings,
      notesSw:
        'Hubiri hili linatualika tukumbuke msaada wa Mungu katika maisha ya usharika, si kama wazo, bali kama jiwe tulilosimamisha.',
      notesEn:
        'This sermon asks us to remember God’s help in parish life as a stone we have set up, not as an idea.',
      seriesSw,
      seriesEn: seriesSw === 'Jiwe la msaada' ? 'Stone of help' : 'The Word dwells with us',
      minutes: 18,
    };
  }),
  categories: [
    { key: 'sadaka', nameSw: 'Sadaka', nameEn: 'Offering' },
    { key: 'zaka', nameSw: 'Zaka', nameEn: 'Tithe' },
    { key: 'shukrani', nameSw: 'Shukrani', nameEn: 'Thanksgiving' },
    { key: 'ahadi', nameSw: 'Ahadi', nameEn: 'Pledge' },
    { key: 'mradi', nameSw: 'Michango ya miradi', nameEn: 'Project gift' },
  ],
};
