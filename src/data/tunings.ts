export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

export type TuningCategory = 'pest' | 'drop' | 'open' | 'modal';

export type GuitarString = {
  note: NoteName;
  octave: number;
};

export type Tuning = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  category: TuningCategory;
  strings: GuitarString[];
};

export const CATEGORIES: { id: TuningCategory; label: string }[] = [
  { id: 'pest', label: 'Standart / Pest' },
  { id: 'drop', label: 'Drop' },
  { id: 'open', label: 'Açık akort' },
  { id: 'modal', label: 'Modal / Diğer' },
];

const s = (note: NoteName, octave: number): GuitarString => ({ note, octave });

export const TUNINGS: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    shortName: 'EADGBE',
    subtitle: 'Klasik E standart',
    category: 'pest',
    strings: [s('E', 2), s('A', 2), s('D', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'half-down',
    name: 'Yarım ses pest',
    shortName: 'Eb Standard',
    subtitle: 'Eb Ab Db Gb Bb Eb',
    category: 'pest',
    strings: [s('D#', 2), s('G#', 2), s('C#', 3), s('F#', 3), s('A#', 3), s('D#', 4)],
  },
  {
    id: 'full-down',
    name: 'Tam ses pest',
    shortName: 'D Standard',
    subtitle: 'D G C F A D',
    category: 'pest',
    strings: [s('D', 2), s('G', 2), s('C', 3), s('F', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'three-half-down',
    name: '1.5 ses pest',
    shortName: 'C# Standard',
    subtitle: 'C# F# B E G# C#',
    category: 'pest',
    strings: [s('C#', 2), s('F#', 2), s('B', 2), s('E', 3), s('G#', 3), s('C#', 4)],
  },
  {
    id: 'two-down',
    name: 'İki ses pest',
    shortName: 'C Standard',
    subtitle: 'C F Bb Eb G C',
    category: 'pest',
    strings: [s('C', 2), s('F', 2), s('A#', 2), s('D#', 3), s('G', 3), s('C', 4)],
  },
  {
    id: 'b-standard',
    name: 'B Standard',
    shortName: 'BEADF#B',
    subtitle: 'Bariton / 6 tel B',
    category: 'pest',
    strings: [s('B', 1), s('E', 2), s('A', 2), s('D', 3), s('F#', 3), s('B', 3)],
  },
  {
    id: 'drop-d',
    name: 'Drop D',
    shortName: 'DADGBE',
    subtitle: 'Sadece 6. tel bir ses pest',
    category: 'drop',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'drop-db',
    name: 'Drop C#',
    shortName: 'C#G#C#F#A#D#',
    subtitle: 'Yarım ses pest + drop',
    category: 'drop',
    strings: [s('C#', 2), s('G#', 2), s('C#', 3), s('F#', 3), s('A#', 3), s('D#', 4)],
  },
  {
    id: 'drop-c',
    name: 'Drop C',
    shortName: 'CGCFAD',
    subtitle: 'Tam ses pest + drop',
    category: 'drop',
    strings: [s('C', 2), s('G', 2), s('C', 3), s('F', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'drop-b',
    name: 'Drop B',
    shortName: 'BF#BEG#C#',
    subtitle: '1.5 ses pest + drop',
    category: 'drop',
    strings: [s('B', 1), s('F#', 2), s('B', 2), s('E', 3), s('G#', 3), s('C#', 4)],
  },
  {
    id: 'drop-a',
    name: 'Drop A',
    shortName: 'AEADF#B',
    subtitle: 'B standard + 6. tel drop',
    category: 'drop',
    strings: [s('A', 1), s('E', 2), s('A', 2), s('D', 3), s('F#', 3), s('B', 3)],
  },
  {
    id: 'double-drop-d',
    name: 'Double Drop D',
    shortName: 'DADGBD',
    subtitle: '1. ve 6. tel D',
    category: 'drop',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('G', 3), s('B', 3), s('D', 4)],
  },
  {
    id: 'open-d',
    name: 'Open D',
    shortName: 'DADF#AD',
    subtitle: 'Açık D majör',
    category: 'open',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('F#', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'open-dm',
    name: 'Open Dm',
    shortName: 'DADFAD',
    subtitle: 'Açık D minör',
    category: 'open',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('F', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'open-g',
    name: 'Open G',
    shortName: 'DGDGBD',
    subtitle: 'Açık G majör · slide',
    category: 'open',
    strings: [s('D', 2), s('G', 2), s('D', 3), s('G', 3), s('B', 3), s('D', 4)],
  },
  {
    id: 'open-gm',
    name: 'Open Gm',
    shortName: 'DGDGBbD',
    subtitle: 'Açık G minör',
    category: 'open',
    strings: [s('D', 2), s('G', 2), s('D', 3), s('G', 3), s('A#', 3), s('D', 4)],
  },
  {
    id: 'open-c',
    name: 'Open C',
    shortName: 'CGCGCE',
    subtitle: 'Açık C majör',
    category: 'open',
    strings: [s('C', 2), s('G', 2), s('C', 3), s('G', 3), s('C', 4), s('E', 4)],
  },
  {
    id: 'open-c6',
    name: 'Open C6',
    shortName: 'CACGCE',
    subtitle: 'C6 / Joni Mitchell',
    category: 'open',
    strings: [s('C', 2), s('A', 2), s('C', 3), s('G', 3), s('C', 4), s('E', 4)],
  },
  {
    id: 'open-e',
    name: 'Open E',
    shortName: 'EBEG#BE',
    subtitle: 'Açık E majör',
    category: 'open',
    strings: [s('E', 2), s('B', 2), s('E', 3), s('G#', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'open-em',
    name: 'Open Em',
    shortName: 'EBEGEE',
    subtitle: 'Açık E minör',
    category: 'open',
    strings: [s('E', 2), s('B', 2), s('E', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'open-a',
    name: 'Open A',
    shortName: 'EAEAC#E',
    subtitle: 'Açık A majör',
    category: 'open',
    strings: [s('E', 2), s('A', 2), s('E', 3), s('A', 3), s('C#', 4), s('E', 4)],
  },
  {
    id: 'open-am',
    name: 'Open Am',
    shortName: 'EAEACE',
    subtitle: 'Açık A minör',
    category: 'open',
    strings: [s('E', 2), s('A', 2), s('E', 3), s('A', 3), s('C', 4), s('E', 4)],
  },
  {
    id: 'dadgad',
    name: 'DADGAD',
    shortName: 'DADGAD',
    subtitle: 'Kelt / modal D',
    category: 'modal',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('G', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'all-fourths',
    name: 'All Fourths',
    shortName: 'EADGCF',
    subtitle: 'Simetrik dörtlüler',
    category: 'modal',
    strings: [s('E', 2), s('A', 2), s('D', 3), s('G', 3), s('C', 4), s('F', 4)],
  },
  {
    id: 'nst',
    name: 'New Standard',
    shortName: 'CGDAEG',
    subtitle: 'King Crimson NST',
    category: 'modal',
    strings: [s('C', 2), s('G', 2), s('D', 3), s('A', 3), s('E', 4), s('G', 4)],
  },
  {
    id: 'nashville',
    name: 'Nashville',
    shortName: 'EADGBE 12',
    subtitle: 'İnce oktav (high-strung)',
    category: 'modal',
    strings: [s('E', 3), s('A', 3), s('D', 4), s('G', 4), s('B', 3), s('E', 4)],
  },
  {
    id: 'lute',
    name: 'Lute',
    shortName: 'EADF#BE',
    subtitle: 'Rönesans / lute',
    category: 'modal',
    strings: [s('E', 2), s('A', 2), s('D', 3), s('F#', 3), s('B', 3), s('E', 4)],
  },
];

export function displayNote(note: NoteName): string {
  const flats: Partial<Record<NoteName, string>> = {
    'A#': 'Bb',
    'C#': 'C#',
    'D#': 'Eb',
    'F#': 'F#',
    'G#': 'Ab',
  };
  return flats[note] ?? note;
}

export function stringLabel(index: number): string {
  return `${6 - index}`;
}
