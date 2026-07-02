/**
 * Khmer alphabet dataset — typed port of the prototype's data.js.
 * Consonants in canonical order (matches audio file index 01–33).
 * register: 'a' = 1st register (â-series, inherent ââ), 'o' = 2nd register (ô-series, inherent ôô)
 * NOTE: example words & mnemonics are a learning aid — worth a native review pass.
 */

export type SeriesKey =
  | 'velar'
  | 'palatal'
  | 'retroflex'
  | 'dental'
  | 'labial'
  | 'misc';

export type RegisterKey = 'a' | 'o';

export interface Series {
  key: SeriesKey;
  label: string;
  place: string;
}

export interface Register {
  key: RegisterKey;
  label: string;
  sub: string;
  vowel: string;
  ipa: string;
  blurb: string;
}

export interface WordExample {
  km: string;
  roman: string;
  en: string;
}

export interface Consonant {
  idx: number;
  id: string;
  pad: string;
  glyph: string;
  series: SeriesKey;
  register: RegisterKey;
  roman: string;
  ipa: string;
  name: string;
  pronounce: string;
  mnemonic: string;
  words: WordExample[];
  confusables: string[];
  kind: 'consonant';
}

export interface Vowel {
  idx: number;
  id: string;
  glyph: string; // combining mark
  base: string; // shown on a base consonant so it renders
  dotted: string; // shown on a dotted circle
  aRead: string;
  oRead: string;
  roman: string;
  note: string;
  kind: 'vowel';
}

export type Item = Consonant | Vowel;

export const SERIES: Record<SeriesKey, Series> = {
  velar: { key: 'velar', label: 'Velar', place: 'Back of tongue · soft palate' },
  palatal: { key: 'palatal', label: 'Palatal', place: 'Mid tongue · hard palate' },
  retroflex: { key: 'retroflex', label: 'Retroflex', place: 'Tongue tip curled back' },
  dental: { key: 'dental', label: 'Dental', place: 'Tongue behind the teeth' },
  labial: { key: 'labial', label: 'Labial', place: 'Lips' },
  misc: {
    key: 'misc',
    label: 'Other consonants',
    place: 'Outside the five series · liquids, glides, s, h & ʼ',
  },
};

export const SERIES_ORDER: SeriesKey[] = [
  'velar',
  'palatal',
  'retroflex',
  'dental',
  'labial',
  'misc',
];

export const REGISTER: Record<RegisterKey, Register> = {
  a: {
    key: 'a',
    label: 'â-series',
    sub: '1st register',
    vowel: 'ââ',
    ipa: '/ɑː/',
    blurb:
      'Inherent vowel ââ — like the “a” in “father” drifting toward “aw”. Attached vowels take their first reading.',
  },
  o: {
    key: 'o',
    label: 'ô-series',
    sub: '2nd register',
    vowel: 'ôô',
    ipa: '/ɔː/',
    blurb:
      'Inherent vowel ôô — like the “o” in “or”. The same attached vowels shift to their second reading.',
  },
};

// idx, glyph, series, register, roman, ipa, name, pronounce, mnemonic, words[], confusables[]
type ConsonantRow = [
  number,
  string,
  SeriesKey,
  RegisterKey,
  string,
  string,
  string,
  string,
  string,
  [string, string, string][],
  string[],
];

const C: ConsonantRow[] = [
  [1, 'ក', 'velar', 'a', 'kâ', '/kɑː/', 'kâ', 'Hard “k”, no puff of air, on the ââ vowel.',
    'A little chair seen from the side — sit down and say “kâ”.',
    [['ក្បាល', 'kbal', 'head'], ['កុមារ', 'ko-maa', 'child']], ['គ', 'ត']],
  [2, 'ខ', 'velar', 'a', 'khâ', '/kʰɑː/', 'khâ', 'Breathy “k” — a puff of air, like “kh”.',
    'ក wearing a flag — that flag is the puff of air in “kh”.',
    [['ខ្លា', 'khlaa', 'tiger'], ['ខែ', 'khae', 'month']], ['គ', 'ឃ']],
  [3, 'គ', 'velar', 'o', 'kô', '/kɔː/', 'kô', 'Like “k” but on the deeper ôô vowel.',
    'Round and full like a “g” bubble — the voiced-sounding “kô”.',
    [['គោ', 'koo', 'cow'], ['គ្រូ', 'kruu', 'teacher']], ['ត', 'ក']],
  [4, 'ឃ', 'velar', 'o', 'khô', '/kʰɔː/', 'khô', 'Breathy “kh” on the ôô vowel.',
    'គ wearing a hat — heavy and breathy: “khô”.',
    [['ឃ្លាន', 'khlian', 'hungry'], ['ឃ្លាំង', 'khleang', 'warehouse']], ['ឍ', 'គ']],
  [5, 'ង', 'velar', 'o', 'ngô', '/ŋɔː/', 'ngô', 'The “ng” in “sing”, humming through the nose.',
    'A coiled spring that hums — “ng…”.',
    [['ងាយ', 'ngeay', 'easy'], ['ងូតទឹក', 'ngoot tɨk', 'to bathe']], ['យ']],

  [6, 'ច', 'palatal', 'a', 'châ', '/cɑː/', 'châ', 'Light “ch” as in “chair”, on ââ.',
    'A hook that catches the “ch”.',
    [['ចេក', 'chek', 'banana'], ['ចាន', 'chaan', 'bowl']], ['ប', 'ផ']],
  [7, 'ឆ', 'palatal', 'a', 'chhâ', '/cʰɑː/', 'chhâ', 'Breathy “ch” — extra air.',
    'ច grown a curl on top — that curl is the extra puff of air.',
    [['ឆ្មា', 'chhmaa', 'cat'], ['ឆ្នាំ', 'chhnam', 'year']], ['ច']],
  [8, 'ជ', 'palatal', 'o', 'chô', '/cɔː/', 'chô', '“Ch” on the deeper ôô vowel.',
    'A flag bending in the wind — soft “chô”.',
    [['ជ្រូក', 'chruuk', 'pig'], ['ជើង', 'cheung', 'foot / leg']], ['ឈ']],
  [9, 'ឈ', 'palatal', 'o', 'chhô', '/cʰɔː/', 'chhô', 'Breathy “ch” on ôô.',
    'ជ doubled up — twice the air: “chhô”.',
    [['ឈើ', 'chheu', 'tree / wood'], ['ឈ្មោះ', 'chhmuah', 'name']], ['ជ']],
  [10, 'ញ', 'palatal', 'o', 'nhô', '/ɲɔː/', 'nhô', 'The “ny” in “canyon”.',
    'Two loops curving like a smile — “nh”.',
    [['ញ៉ាំ', 'nyam', 'to eat'], ['ញញឹម', 'nho-nhɨm', 'to smile']], ['ឈ']],

  [11, 'ដ', 'retroflex', 'a', 'dâ', '/ɗɑː/', 'dâ', 'A crisp “d” with the tongue tip up.',
    'A flamingo standing on one leg — “dâ”.',
    [['ដៃ', 'day', 'hand / arm'], ['ដើរ', 'daə', 'to walk']], ['ត', 'ឌ']],
  [12, 'ឋ', 'retroflex', 'a', 'thâ', '/tʰɑː/', 'thâ', 'Breathy “t” — rare, mostly in old loanwords.',
    'A little throne — rare and regal: “thâ”.',
    [['ឋាន', 'thaan', 'place / realm']], ['ឌ']],
  [13, 'ឌ', 'retroflex', 'o', 'dô', '/ɗɔː/', 'dô', '“D” on the ôô vowel.',
    'ដ that grew a belly — the voiced-feeling “dô”.',
    [['ឌុយ', 'duy', '(light) socket']], ['ដ', 'ឋ']],
  [14, 'ឍ', 'retroflex', 'o', 'thô', '/tʰɔː/', 'thô', 'Breathy “th” — very rare in everyday Khmer.',
    'The rare twin of ឌ wearing a crown — “thô”.',
    [], ['ឃ']],
  [15, 'ណ', 'retroflex', 'a', 'nâ', '/nɑː/', 'nâ', 'An “n” — but on ââ (the only â-series nasal).',
    'A curly retroflex “n” — the tongue curls back.',
    [['ណាស់', 'nas', 'very'], ['ករុណា', 'ka-ru-naa', 'mercy · “please”']], ['ន']],

  [16, 'ត', 'dental', 'a', 'tâ', '/tɑː/', 'tâ', 'A clean “t”, tongue at the teeth.',
    'Almost a twin of ដ — but flat-footed: “tâ”.',
    [['ត្រី', 'trey', 'fish'], ['តុ', 'tok', 'table']], ['ដ', 'គ']],
  [17, 'ថ', 'dental', 'a', 'thâ', '/tʰɑː/', 'thâ', 'Breathy “t” on ââ.',
    'ត holding a balloon of air — “thâ”.',
    [['ថ្ងៃ', 'thngay', 'day · sun'], ['ថ្ម', 'thmâ', 'stone']], ['ត']],
  [18, 'ទ', 'dental', 'o', 'tô', '/tɔː/', 'tô', '“T” on the deeper ôô vowel.',
    'ត’s rounder cousin — “tô”; think ទឹក (water).',
    [['ទឹក', 'tɨk', 'water'], ['ទា', 'tea', 'duck']], ['ធ']],
  [19, 'ធ', 'dental', 'o', 'thô', '/tʰɔː/', 'thô', 'Breathy “th” on ôô.',
    'ទ with a topknot — breathy “thô”.',
    [['ធំ', 'thom', 'big'], ['ធ្មេញ', 'thmeñ', 'tooth']], ['ទ']],
  [20, 'ន', 'dental', 'o', 'nô', '/nɔː/', 'nô', 'A soft “n” on ôô.',
    'A wave — “nô” rolls in like water.',
    [['នំ', 'num', 'cake'], ['នាង', 'neang', 'she · lady']], ['ណ']],

  [21, 'ប', 'labial', 'a', 'bâ', '/ɓɑː/', 'bâ', 'A “b” (almost “p”), on ââ.',
    'A box you put things in — “bâ”.',
    [['បាយ', 'bay', 'cooked rice'], ['ប្រាក់', 'prak', 'money']], ['ផ', 'ច']],
  [22, 'ផ', 'labial', 'a', 'phâ', '/pʰɑː/', 'phâ', 'Breathy “p” — a puff of air.',
    'ប with a sail raised — the sail is the puff: “phâ”.',
    [['ផ្ទះ', 'phteah', 'house'], ['ផ្កា', 'phka', 'flower']], ['ប']],
  [23, 'ព', 'labial', 'o', 'pô', '/pɔː/', 'pô', 'A “p” on the deeper ôô vowel.',
    'Two posts side by side — “pô”.',
    [['ពេល', 'pel', 'time'], ['ពាក្យ', 'peak', 'word']], ['ភ']],
  [24, 'ភ', 'labial', 'o', 'phô', '/pʰɔː/', 'phô', 'Breathy “ph” on ôô.',
    'ព carrying a load on top — “phô”; think ភ្នំ (mountain).',
    [['ភ្នំ', 'phnom', 'mountain'], ['ភ្នែក', 'phnek', 'eye']], ['ព']],
  [25, 'ម', 'labial', 'o', 'mô', '/mɔː/', 'mô', 'An “m” humming through the lips.',
    'A humped camel — “mô” hums through the nose.',
    [['មាន់', 'moan', 'chicken'], ['ម្ហូប', 'mhoup', 'food']], ['ឃ']],

  [26, 'យ', 'misc', 'o', 'yô', '/jɔː/', 'yô', 'The “y” in “yes”, on ôô.',
    'A wishbone — pull it and say “yô”.',
    [['យប់', 'yup', 'night'], ['យើង', 'yeung', 'we']], ['ង']],
  [27, 'រ', 'misc', 'o', 'rô', '/rɔː/', 'rô', 'A trilled / tapped “r”.',
    'A rolling wave — trill the “rô”.',
    [['រត់', 'rut', 'to run'], ['រូប', 'ruup', 'picture']], ['វ']],
  [28, 'ល', 'misc', 'o', 'lô', '/lɔː/', 'lô', 'A soft “l” on ôô.',
    'A loop like a lasso — “lô”.',
    [['ល្អ', 'lʼâ', 'good'], ['លក់', 'luak', 'to sell']], ['ឡ']],
  [29, 'វ', 'misc', 'o', 'vô', '/ʋɔː/', 'vô', 'Between “v” and “w”, on ôô.',
    'A “v” valley dips down — “vô”.',
    [['វត្ត', 'voat', 'temple · pagoda'], ['វាល', 'veal', 'field']], ['រ']],
  [30, 'ស', 'misc', 'a', 'sâ', '/sɑː/', 'sâ', 'A hissing “s” on ââ.',
    'A snake hissing — “sss… sâ”.',
    [['សៀវភៅ', 'siev-pheu', 'book'], ['ស្អាត', 'sʼat', 'clean · pretty']], ['ហ']],
  [31, 'ហ', 'misc', 'a', 'hâ', '/hɑː/', 'hâ', 'A breathy “h” on ââ.',
    'An open mouth breathing out — “hâ”.',
    [['ហាង', 'hang', 'shop'], ['ហើយ', 'haey', 'already · and']], ['ស']],
  [32, 'ឡ', 'misc', 'a', 'lâ', '/lɑː/', 'lâ', 'An “l” — but on ââ (the â-series partner of ល).',
    'ល up on a platform, standing tall — “lâ”; think ឡាន (car).',
    [['ឡាន', 'laan', 'car'], ['ឡើង', 'laəng', 'to go up']], ['ល']],
  [33, 'អ', 'misc', 'a', 'ʼâ', '/ʔɑː/', 'ʼâ', 'A glottal stop + ââ — the catch in “uh-oh”.',
    'An open throat — the silent catch before “â”.',
    [['អ្នក', 'neak', 'you · person'], ['អាហារ', 'ʼa-haa', 'food · meal']], []],
];

export const CONSONANTS: Consonant[] = C.map((r) => {
  const idx = r[0];
  return {
    idx,
    id: 'c' + idx,
    pad: String(idx).padStart(2, '0'),
    glyph: r[1],
    series: r[2],
    register: r[3],
    roman: r[4],
    ipa: r[5],
    name: r[6],
    pronounce: r[7],
    mnemonic: r[8],
    words: (r[9] || []).map((w) => ({ km: w[0], roman: w[1], en: w[2] })),
    confusables: r[10] || [],
    kind: 'consonant',
  };
});

// Dependent vowels — read differently depending on the consonant's register.
// [glyph, a-series reading, o-series reading, note]
const V: [string, string, string, string][] = [
  ['ា', 'aa', 'ie', 'long open vowel'],
  ['ិ', 'e', 'i', 'short, high'],
  ['ី', 'ei', 'i', 'long “ee”'],
  ['ឹ', 'œ', 'ɨ', 'tense, unrounded'],
  ['ឺ', 'œœ', 'ɨɨ', 'long, unrounded'],
  ['ុ', 'o', 'u', 'short, rounded'],
  ['ូ', 'ou', 'uu', 'long “oo”'],
  ['ួ', 'uo', 'uo', 'gliding “uo”'],
  ['ើ', 'aə', 'əə', '“er”-like glide'],
  ['ឿ', 'ɨə', 'ɨə', 'centring glide'],
  ['ៀ', 'iə', 'iə', '“ia” glide'],
  ['េ', 'ei', 'e', 'mid front'],
  ['ែ', 'ae', 'ɛɛ', 'open “ae”'],
  ['ៃ', 'ai', 'ey', 'diphthong'],
  ['ោ', 'ao', 'oo', '“ow”-ish'],
  ['ៅ', 'au', 'ou', 'diphthong'],
  ['ុំ', 'om', 'um', '+ final m'],
  ['ំ', 'am', 'um', '+ final m'],
  ['ាំ', 'am', 'oam', '+ final m'],
  ['ះ', 'ah', 'eah', '+ glottal'],
  ['ុះ', 'oh', 'uh', '+ glottal'],
  ['េះ', 'eh', 'ih', '+ glottal'],
  ['ោះ', 'aoh', 'uoh', '+ glottal'],
];

export const VOWELS: Vowel[] = V.map((r, i) => ({
  idx: i + 1,
  id: 'v' + (i + 1),
  glyph: r[0],
  base: 'ក' + r[0],
  dotted: '◌' + r[0],
  aRead: r[1],
  oRead: r[2],
  roman: r[1] + ' · ' + r[2],
  note: r[3],
  kind: 'vowel',
}));

// Flip to true once vowel audio is recorded.
export const VOWEL_AUDIO_AVAILABLE = false;

export function byGlyph(g: string): Consonant | undefined {
  return CONSONANTS.find((c) => c.glyph === g);
}

export function itemKey(item: Item): string {
  return item.kind === 'vowel' ? item.id : item.glyph;
}

export function itemGlyph(item: Item): string {
  return item.kind === 'vowel' ? item.base : item.glyph;
}

export function itemRoman(item: Item): string {
  return item.kind === 'vowel' ? item.aRead + ' · ' + item.oRead : item.roman;
}

export function siblings(item: Item): Item[] {
  return item.kind === 'vowel' ? VOWELS : CONSONANTS;
}
