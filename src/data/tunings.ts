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

export type InstrumentId = 'auto' | 'guitar' | 'bass' | 'saz' | 'ukulele';

export type TuningCategory = 'pest' | 'drop' | 'open' | 'modal' | 'standard';

export type GuitarString = {
  note: NoteName;
  octave: number;
  label?: string;
};

export type Tuning = {
  id: string;
  instrument: Exclude<InstrumentId, 'auto'>;
  name: string;
  shortName: string;
  subtitle: string;
  category: TuningCategory;
  strings: GuitarString[];
};

export const INSTRUMENTS: { id: InstrumentId; name: string }[] = [
  { id: 'auto', name: 'Auto' },
  { id: 'guitar', name: 'Gitar' },
  { id: 'bass', name: 'Bass' },
  { id: 'saz', name: 'Saz' },
  { id: 'ukulele', name: 'Ukulele' },
];

export const CATEGORIES: { id: TuningCategory; label: string }[] = [
  { id: 'pest', label: 'Standart / Pest' },
  { id: 'drop', label: 'Drop' },
  { id: 'open', label: 'Açık akort' },
  { id: 'modal', label: 'Modal / Diğer' },
  { id: 'standard', label: 'Akortlar' },
];

const s = (note: NoteName, octave: number, label?: string): GuitarString => ({
  note,
  octave,
  label,
});

export const TUNINGS: Tuning[] = [
  {
    id: 'standard',
    instrument: 'guitar',
    name: 'Standard',
    shortName: 'EADGBE',
    subtitle: 'Klasik E standart',
    category: 'pest',
    strings: [s('E', 2), s('A', 2), s('D', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'half-down',
    instrument: 'guitar',
    name: 'Yarım ses pest',
    shortName: 'Eb Standard',
    subtitle: 'Eb Ab Db Gb Bb Eb',
    category: 'pest',
    strings: [s('D#', 2), s('G#', 2), s('C#', 3), s('F#', 3), s('A#', 3), s('D#', 4)],
  },
  {
    id: 'full-down',
    instrument: 'guitar',
    name: 'Tam ses pest',
    shortName: 'D Standard',
    subtitle: 'D G C F A D',
    category: 'pest',
    strings: [s('D', 2), s('G', 2), s('C', 3), s('F', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'three-half-down',
    instrument: 'guitar',
    name: '1.5 ses pest',
    shortName: 'C# Standard',
    subtitle: 'C# F# B E G# C#',
    category: 'pest',
    strings: [s('C#', 2), s('F#', 2), s('B', 2), s('E', 3), s('G#', 3), s('C#', 4)],
  },
  {
    id: 'two-down',
    instrument: 'guitar',
    name: 'İki ses pest',
    shortName: 'C Standard',
    subtitle: 'C F Bb Eb G C',
    category: 'pest',
    strings: [s('C', 2), s('F', 2), s('A#', 2), s('D#', 3), s('G', 3), s('C', 4)],
  },
  {
    id: 'b-standard',
    instrument: 'guitar',
    name: 'B Standard',
    shortName: 'BEADF#B',
    subtitle: 'Bariton / 6 tel B',
    category: 'pest',
    strings: [s('B', 1), s('E', 2), s('A', 2), s('D', 3), s('F#', 3), s('B', 3)],
  },
  {
    id: 'drop-d',
    instrument: 'guitar',
    name: 'Drop D',
    shortName: 'DADGBE',
    subtitle: 'Sadece 6. tel bir ses pest',
    category: 'drop',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'drop-db',
    instrument: 'guitar',
    name: 'Drop C#',
    shortName: 'C#G#C#F#A#D#',
    subtitle: 'Yarım ses pest + drop',
    category: 'drop',
    strings: [s('C#', 2), s('G#', 2), s('C#', 3), s('F#', 3), s('A#', 3), s('D#', 4)],
  },
  {
    id: 'drop-c',
    instrument: 'guitar',
    name: 'Drop C',
    shortName: 'CGCFAD',
    subtitle: 'Tam ses pest + drop',
    category: 'drop',
    strings: [s('C', 2), s('G', 2), s('C', 3), s('F', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'drop-b',
    instrument: 'guitar',
    name: 'Drop B',
    shortName: 'BF#BEG#C#',
    subtitle: '1.5 ses pest + drop',
    category: 'drop',
    strings: [s('B', 1), s('F#', 2), s('B', 2), s('E', 3), s('G#', 3), s('C#', 4)],
  },
  {
    id: 'drop-a',
    instrument: 'guitar',
    name: 'Drop A',
    shortName: 'AEADF#B',
    subtitle: 'B standard + 6. tel drop',
    category: 'drop',
    strings: [s('A', 1), s('E', 2), s('A', 2), s('D', 3), s('F#', 3), s('B', 3)],
  },
  {
    id: 'double-drop-d',
    instrument: 'guitar',
    name: 'Double Drop D',
    shortName: 'DADGBD',
    subtitle: '1. ve 6. tel D',
    category: 'drop',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('G', 3), s('B', 3), s('D', 4)],
  },
  {
    id: 'open-d',
    instrument: 'guitar',
    name: 'Open D',
    shortName: 'DADF#AD',
    subtitle: 'Açık D majör',
    category: 'open',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('F#', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'open-dm',
    instrument: 'guitar',
    name: 'Open Dm',
    shortName: 'DADFAD',
    subtitle: 'Açık D minör',
    category: 'open',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('F', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'open-g',
    instrument: 'guitar',
    name: 'Open G',
    shortName: 'DGDGBD',
    subtitle: 'Açık G majör · slide',
    category: 'open',
    strings: [s('D', 2), s('G', 2), s('D', 3), s('G', 3), s('B', 3), s('D', 4)],
  },
  {
    id: 'open-gm',
    instrument: 'guitar',
    name: 'Open Gm',
    shortName: 'DGDGBbD',
    subtitle: 'Açık G minör',
    category: 'open',
    strings: [s('D', 2), s('G', 2), s('D', 3), s('G', 3), s('A#', 3), s('D', 4)],
  },
  {
    id: 'open-c',
    instrument: 'guitar',
    name: 'Open C',
    shortName: 'CGCGCE',
    subtitle: 'Açık C majör',
    category: 'open',
    strings: [s('C', 2), s('G', 2), s('C', 3), s('G', 3), s('C', 4), s('E', 4)],
  },
  {
    id: 'open-c6',
    instrument: 'guitar',
    name: 'Open C6',
    shortName: 'CACGCE',
    subtitle: 'C6 / Joni Mitchell',
    category: 'open',
    strings: [s('C', 2), s('A', 2), s('C', 3), s('G', 3), s('C', 4), s('E', 4)],
  },
  {
    id: 'open-e',
    instrument: 'guitar',
    name: 'Open E',
    shortName: 'EBEG#BE',
    subtitle: 'Açık E majör',
    category: 'open',
    strings: [s('E', 2), s('B', 2), s('E', 3), s('G#', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'open-em',
    instrument: 'guitar',
    name: 'Open Em',
    shortName: 'EBEGEE',
    subtitle: 'Açık E minör',
    category: 'open',
    strings: [s('E', 2), s('B', 2), s('E', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'open-a',
    instrument: 'guitar',
    name: 'Open A',
    shortName: 'EAEAC#E',
    subtitle: 'Açık A majör',
    category: 'open',
    strings: [s('E', 2), s('A', 2), s('E', 3), s('A', 3), s('C#', 4), s('E', 4)],
  },
  {
    id: 'open-am',
    instrument: 'guitar',
    name: 'Open Am',
    shortName: 'EAEACE',
    subtitle: 'Açık A minör',
    category: 'open',
    strings: [s('E', 2), s('A', 2), s('E', 3), s('A', 3), s('C', 4), s('E', 4)],
  },
  {
    id: 'dadgad',
    instrument: 'guitar',
    name: 'DADGAD',
    shortName: 'DADGAD',
    subtitle: 'Kelt / modal D',
    category: 'modal',
    strings: [s('D', 2), s('A', 2), s('D', 3), s('G', 3), s('A', 3), s('D', 4)],
  },
  {
    id: 'all-fourths',
    instrument: 'guitar',
    name: 'All Fourths',
    shortName: 'EADGCF',
    subtitle: 'Simetrik dörtlüler',
    category: 'modal',
    strings: [s('E', 2), s('A', 2), s('D', 3), s('G', 3), s('C', 4), s('F', 4)],
  },
  {
    id: 'nst',
    instrument: 'guitar',
    name: 'New Standard',
    shortName: 'CGDAEG',
    subtitle: 'King Crimson NST',
    category: 'modal',
    strings: [s('C', 2), s('G', 2), s('D', 3), s('A', 3), s('E', 4), s('G', 4)],
  },
  {
    id: 'nashville',
    instrument: 'guitar',
    name: 'Nashville',
    shortName: 'EADGBE 12',
    subtitle: 'İnce oktav (high-strung)',
    category: 'modal',
    strings: [s('E', 3), s('A', 3), s('D', 4), s('G', 4), s('B', 3), s('E', 4)],
  },
  {
    id: 'lute',
    instrument: 'guitar',
    name: 'Lute',
    shortName: 'EADF#BE',
    subtitle: 'Rönesans / lute',
    category: 'modal',
    strings: [s('E', 2), s('A', 2), s('D', 3), s('F#', 3), s('B', 3), s('E', 4)],
  },
  {
    id: 'bass-4',
    instrument: 'bass',
    name: '4 tel Standard',
    shortName: 'EADG',
    subtitle: 'Klasik 4 tel bass',
    category: 'standard',
    strings: [s('E', 1), s('A', 1), s('D', 2), s('G', 2)],
  },
  {
    id: 'bass-drop-d',
    instrument: 'bass',
    name: 'Drop D',
    shortName: 'DADG',
    subtitle: '4 tel drop D',
    category: 'standard',
    strings: [s('D', 1), s('A', 1), s('D', 2), s('G', 2)],
  },
  {
    id: 'bass-half-down',
    instrument: 'bass',
    name: 'Yarım ses pest',
    shortName: 'Eb Ab Db Gb',
    subtitle: '4 tel yarım ses pest',
    category: 'standard',
    strings: [s('D#', 1), s('G#', 1), s('C#', 2), s('F#', 2)],
  },
  {
    id: 'bass-d-standard',
    instrument: 'bass',
    name: 'D Standard',
    shortName: 'DGCF',
    subtitle: '4 tel tam ses pest',
    category: 'standard',
    strings: [s('D', 1), s('G', 1), s('C', 2), s('F', 2)],
  },
  {
    id: 'bass-5',
    instrument: 'bass',
    name: '5 tel Standard',
    shortName: 'BEADG',
    subtitle: 'B0 ekli 5 tel',
    category: 'standard',
    strings: [s('B', 0), s('E', 1), s('A', 1), s('D', 2), s('G', 2)],
  },
  {
    id: 'bass-5-drop-a',
    instrument: 'bass',
    name: '5 tel Drop A',
    shortName: 'AEADG',
    subtitle: 'Kalın tel A',
    category: 'standard',
    strings: [s('A', 0), s('E', 1), s('A', 1), s('D', 2), s('G', 2)],
  },
  {
    id: 'bass-6',
    instrument: 'bass',
    name: '6 tel Standard',
    shortName: 'BEADGC',
    subtitle: 'B0–C3',
    category: 'standard',
    strings: [s('B', 0), s('E', 1), s('A', 1), s('D', 2), s('G', 2), s('C', 3)],
  },
  {
    id: 'saz-bozuk',
    instrument: 'saz',
    name: 'Bozuk / Kara düzen',
    shortName: 'A D G',
    subtitle: 'En yaygın bağlama akordu · La Re Sol',
    category: 'standard',
    strings: [s('A', 2, 'Bam'), s('D', 3, 'Orta'), s('G', 3, 'Üst')],
  },
  {
    id: 'saz-baglama',
    instrument: 'saz',
    name: 'Bağlama düzeni',
    shortName: 'A D A',
    subtitle: 'La Re La',
    category: 'standard',
    strings: [s('A', 2, 'Bam'), s('D', 3, 'Orta'), s('A', 3, 'Üst')],
  },
  {
    id: 'saz-misket',
    instrument: 'saz',
    name: 'Misket düzeni',
    shortName: 'E D A',
    subtitle: 'Mi Re La',
    category: 'standard',
    strings: [s('E', 3, 'Bam'), s('D', 4, 'Orta'), s('A', 4, 'Üst')],
  },
  {
    id: 'saz-müstezat',
    instrument: 'saz',
    name: 'Müstezat',
    shortName: 'F D A',
    subtitle: 'Fa Re La',
    category: 'standard',
    strings: [s('F', 3, 'Bam'), s('D', 4, 'Orta'), s('A', 4, 'Üst')],
  },
  {
    id: 'saz-abdal',
    instrument: 'saz',
    name: 'Abdal düzeni',
    shortName: 'A G D',
    subtitle: 'La Sol Re',
    category: 'standard',
    strings: [s('A', 2, 'Bam'), s('G', 3, 'Orta'), s('D', 4, 'Üst')],
  },
  {
    id: 'saz-cura',
    instrument: 'saz',
    name: 'Cura (bozuk)',
    shortName: 'A D G',
    subtitle: 'Cura oktavı · La Re Sol',
    category: 'standard',
    strings: [s('A', 3, 'Bam'), s('D', 4, 'Orta'), s('G', 4, 'Üst')],
  },
  {
    id: 'uke-c',
    instrument: 'ukulele',
    name: 'C Standard',
    shortName: 'GCEA',
    subtitle: 'Soprano / konser · reentrant G',
    category: 'standard',
    strings: [s('G', 4), s('C', 4), s('E', 4), s('A', 4)],
  },
  {
    id: 'uke-low-g',
    instrument: 'ukulele',
    name: 'Low G',
    shortName: 'GCEA',
    subtitle: 'Do akort, kalın G',
    category: 'standard',
    strings: [s('G', 3), s('C', 4), s('E', 4), s('A', 4)],
  },
  {
    id: 'uke-d',
    instrument: 'ukulele',
    name: 'D Standard',
    shortName: 'ADF#B',
    subtitle: 'Re akort',
    category: 'standard',
    strings: [s('A', 4), s('D', 4), s('F#', 4), s('B', 4)],
  },
  {
    id: 'uke-baritone',
    instrument: 'ukulele',
    name: 'Bariton',
    shortName: 'DGBE',
    subtitle: 'Gitarın üst 4 teli',
    category: 'standard',
    strings: [s('D', 3), s('G', 3), s('B', 3), s('E', 4)],
  },
];

export function tuningsFor(instrument: Exclude<InstrumentId, 'auto'>): Tuning[] {
  return TUNINGS.filter((tuning) => tuning.instrument === instrument);
}

export function defaultTuning(instrument: Exclude<InstrumentId, 'auto'>): Tuning {
  return tuningsFor(instrument)[0];
}

export function displayNote(note: NoteName): string {
  const flats: Partial<Record<NoteName, string>> = {
    'A#': 'Bb',
    'D#': 'Eb',
    'G#': 'Ab',
  };
  return flats[note] ?? note;
}

export function stringLabel(index: number, total: number): string {
  return `${total - index}`;
}
