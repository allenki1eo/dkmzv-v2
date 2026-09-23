export const sw = {
  appName: 'Ebenezer',
  churchName: 'KKKT Usharika wa Ebenezer',
  markLine: 'Hata sasa BWANA ametusaidia.',
  markCite: '1 Samweli 7:12',

  locale: {
    sw: 'Kiswahili',
    en: 'English',
  },

  theme: {
    system: 'Mfumo',
    light: 'Mwanga',
    dark: 'Giza',
    label: 'Muonekano',
  },

  tabs: {
    home: 'Nyumbani',
    sermons: 'Mahubiri',
    jumuiya: 'Jumuiya',
    giving: 'Sadaka',
    me: 'Mimi',
  },

  auth: {
    title: 'Karibu Ebenezer',
    subtitle: 'Ingia kwa namba ya simu uliyosajiliwa nayo usharikani.',
    phoneLabel: 'Namba ya simu',
    phonePlaceholder: '0712 000 000',
    sendCode: 'Pata namba ya siri',
    codeLabel: 'Namba ya siri',
    codeHint: 'Tumetuma namba ya siri kwa SMS.',
    verify: 'Thibitisha',
    nameLabel: 'Jina lako',
    namePlaceholder: 'Jina kamili',
    finish: 'Ingia usharikani',
    emailLabel: 'Barua pepe ya ofisi',
    passwordLabel: 'Nenosiri',
    officeLogin: 'Ingia kama ofisi',
    memberLogin: 'Ingia kwa simu',
    resend: 'Tuma tena',
    invalidPhone: 'Namba ya simu si sahihi. Tumia namba ya Tanzania.',
    invalidCode: 'Namba ya siri si sahihi. Jaribu tena.',
    expiredCode: 'Namba ya siri imeisha muda. Omba nyingine.',
    tooMany: 'Majaribio yamezidi. Omba namba mpya.',
    sessionExpired: 'Kikao kimeisha. Ingia tena.',
    officeOnly: 'Akaunti hii haina ruhusa ya ofisi.',
    signedOut: 'Umetoka.',
    signOut: 'Toka',
    devCodeHint: 'Mazingira ya majaribio. Namba ya siri ni {code}.',
  },

  home: {
    title: 'Nyumbani',
    verseTitle: 'Neno la Leo',
    shareVerse: 'Shiriki kama picha',
    liveNow: 'Ibada inaendelea',
    joinNow: 'Jiunge sasa',
    nextService: 'Ibada ijayo',
    announcements: 'Matangazo',
    seeAll: 'Ona yote',
    reminders: 'Vikumbusho vya leo',
    emptyAnnouncements: 'Hakuna tangazo jipya leo.',
  },

  sermons: {
    title: 'Mahubiri',
    video: 'Video',
    audio: 'Sauti',
    series: 'Mfululizo',
    download: 'Pakua hubiri',
    empty: 'Bado hakuna mahubiri yaliyochapishwa.',
  },

  jumuiya: {
    title: 'Jumuiya',
    pick: 'Chagua jumuiya yako',
    unknown: 'Sijui jumuiya yangu',
    empty: 'Bado hujajiunga na jumuiya. Chagua jumuiya yako.',
    attend: 'Nitahudhuria',
  },

  giving: {
    title: 'Sadaka',
    give: 'Toa sadaka',
    confirm: 'Thibitisha malipo',
    waiting: 'Tunasubiri M-Pesa',
    failed: 'Malipo hayakukamilika. Angalia salio la M-Pesa kisha ujaribu tena.',
    receipt: 'Risiti',
    anonymous: 'Toa bila jina kwenye orodha ya umma',
  },

  me: {
    title: 'Mimi',
    language: 'Lugha',
    textSize: 'Ukubwa wa maandishi',
    lowData: 'Hifadhi data',
    downloads: 'Vipakuliwa',
    contactOffice: 'Wasiliana na ofisi',
    design: 'Alama na rangi',
  },

  design: {
    title: 'Alama za Ebenezer',
    subtitle: 'Jiwe, mwanga, na rangi ya kipindi cha kanisa.',
    tokens: 'Rangi',
    type: 'Herufi',
    radius: 'Pembetatu za umbo',
    seasons: 'Kalenda ya liturujia',
    contrast: 'Ulinganifu wa rangi',
    verseSample: 'Hata sasa BWANA ametusaidia.',
    serifUse: 'Andiko, kichwa cha hubiri, kichwa cha ukurasa',
    sansUse: 'Vitufe, orodha, fomu, namba',
    seasonUse:
      'Rangi ya kipindi inaonekana sehemu tatu tu: bendi ya Nyumbani, kichupo hai, na beji ya ibada mubashara.',
  },

  roles: {
    mchungaji: 'Mchungaji',
    katibu: 'Katibu',
    mhazini: 'Mhazini',
    media: 'Timu ya midia',
    kiongozi_jumuiya: 'Kiongozi wa jumuiya',
    msomaji: 'Msomaji',
  },

  admin: {
    office: 'Ofisi ya usharika',
    command: 'Tafuta au nenda',
    dashboard: 'Dashibodi',
    members: 'Waumini',
    jumuiya: 'Jumuiya',
    sermons: 'Mahubiri',
    live: 'Mubashara',
    finance: 'Sadaka na fedha',
    announcements: 'Matangazo',
    calendar: 'Kalenda na liturgia',
    settings: 'Mipangilio',
    design: 'Chumba cha alama',
    audit: 'Kumbukumbu',
  },

  states: {
    loading: 'Inapakia…',
    offline: 'Huna mtandao. Tunaonyesha ulichotunza.',
    error: 'Imeshindikana. Jaribu tena.',
    retry: 'Jaribu tena',
    empty: 'Hakuna kitu hapa bado.',
  },

  categories: {
    sadaka: 'Sadaka',
    zaka: 'Zaka',
    shukrani: 'Shukrani',
    ahadi: 'Ahadi',
    mradi: 'Michango ya miradi',
  },
};

export type Dictionary = {
  [K in keyof typeof sw]: (typeof sw)[K] extends string
    ? string
    : { [P in keyof (typeof sw)[K]]: string };
};
