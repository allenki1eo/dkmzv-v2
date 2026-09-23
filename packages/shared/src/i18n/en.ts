import type { Dictionary } from './sw';

export const en: Dictionary = {
  appName: 'Ebenezer',
  churchName: 'KKKT Ebenezer Parish',
  markLine: 'Thus far the LORD has helped us.',
  markCite: '1 Samuel 7:12',

  locale: {
    sw: 'Kiswahili',
    en: 'English',
  },

  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    label: 'Appearance',
  },

  tabs: {
    home: 'Home',
    sermons: 'Sermons',
    jumuiya: 'Jumuiya',
    giving: 'Giving',
    me: 'Me',
  },

  auth: {
    title: 'Welcome to Ebenezer',
    subtitle: 'Sign in with the phone number registered at the parish.',
    phoneLabel: 'Phone number',
    phonePlaceholder: '0712 000 000',
    sendCode: 'Get a sign-in code',
    codeLabel: 'Sign-in code',
    codeHint: 'We sent a code by SMS.',
    verify: 'Confirm',
    nameLabel: 'Your name',
    namePlaceholder: 'Full name',
    finish: 'Enter the parish',
    emailLabel: 'Office email',
    passwordLabel: 'Password',
    officeLogin: 'Office sign-in',
    memberLogin: 'Sign in with phone',
    resend: 'Send again',
    invalidPhone: 'That phone number is not a Tanzanian mobile number.',
    invalidCode: 'That code is not correct. Try again.',
    expiredCode: 'That code has expired. Request a new one.',
    tooMany: 'Too many attempts. Request a new code.',
    sessionExpired: 'Your session ended. Sign in again.',
    officeOnly: 'This account cannot open the office.',
    signedOut: 'You have signed out.',
    signOut: 'Sign out',
    devCodeHint: 'Development mode. The sign-in code is {code}.',
  },

  home: {
    title: 'Home',
    verseTitle: 'Word for today',
    shareVerse: 'Share as image',
    liveNow: 'Service is live',
    joinNow: 'Join now',
    nextService: 'Next service',
    announcements: 'Announcements',
    seeAll: 'See all',
    reminders: 'Today’s reminders',
    emptyAnnouncements: 'No new announcement today.',
  },

  sermons: {
    title: 'Sermons',
    video: 'Video',
    audio: 'Audio',
    series: 'Series',
    download: 'Download sermon',
    empty: 'No sermons have been published yet.',
  },

  jumuiya: {
    title: 'Jumuiya',
    pick: 'Choose your jumuiya',
    unknown: 'I do not know my jumuiya',
    empty: 'You have not joined a jumuiya yet. Choose yours.',
    attend: 'I will attend',
  },

  giving: {
    title: 'Giving',
    give: 'Give an offering',
    confirm: 'Confirm payment',
    waiting: 'Waiting for M-Pesa',
    failed: 'The payment did not finish. Check your M-Pesa balance, then try again.',
    receipt: 'Receipt',
    anonymous: 'Keep my name off public totals',
  },

  me: {
    title: 'Me',
    language: 'Language',
    textSize: 'Text size',
    lowData: 'Save data',
    downloads: 'Downloads',
    contactOffice: 'Contact the office',
    design: 'Marks and colour',
  },

  design: {
    title: 'Ebenezer marks',
    subtitle: 'Stone, light, and the colour of the church year.',
    tokens: 'Colour',
    type: 'Type',
    radius: 'Shape',
    seasons: 'Liturgical calendar',
    contrast: 'Contrast',
    verseSample: 'Thus far the LORD has helped us.',
    serifUse: 'Scripture, sermon titles, screen titles',
    sansUse: 'Buttons, lists, forms, numbers',
    seasonUse:
      'Season colour appears in three places only: the Home band, the active tab, and the live-service badge.',
  },

  roles: {
    mchungaji: 'Pastor',
    katibu: 'Secretary',
    mhazini: 'Treasurer',
    media: 'Media team',
    kiongozi_jumuiya: 'Jumuiya leader',
    msomaji: 'Reader',
  },

  admin: {
    office: 'Parish office',
    command: 'Search or go',
    dashboard: 'Dashboard',
    members: 'Members',
    jumuiya: 'Jumuiya',
    sermons: 'Sermons',
    live: 'Live',
    finance: 'Giving and finance',
    announcements: 'Announcements',
    calendar: 'Calendar and liturgy',
    settings: 'Settings',
    design: 'Mark room',
    audit: 'Audit log',
  },

  states: {
    loading: 'Loading…',
    offline: 'You are offline. Showing what we saved.',
    error: 'That failed. Try again.',
    retry: 'Try again',
    empty: 'Nothing here yet.',
  },

  categories: {
    sadaka: 'Offering',
    zaka: 'Tithe',
    shukrani: 'Thanksgiving',
    ahadi: 'Pledge',
    mradi: 'Project gift',
  },
};
