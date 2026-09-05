import type { GuitarString, NoteName } from '../data/tunings';

export const NOTE_NAMES: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export function noteToMidi(note: NoteName, octave: number): number {
  return NOTE_NAMES.indexOf(note) + (octave + 1) * 12;
}

export function midiToFrequency(midi: number, a4 = 440): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

export function frequencyToMidi(frequency: number, a4 = 440): number {
  return 69 + 12 * Math.log2(frequency / a4);
}

export function stringFrequency(string: GuitarString, a4 = 440): number {
  return midiToFrequency(noteToMidi(string.note, string.octave), a4);
}

export function centsBetween(frequency: number, target: number): number {
  return 1200 * Math.log2(frequency / target);
}

export function nearestNote(frequency: number, a4 = 440): {
  name: NoteName;
  octave: number;
  midi: number;
  cents: number;
} {
  const rawMidi = frequencyToMidi(frequency, a4);
  const midi = Math.round(rawMidi);
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return {
    name,
    octave,
    midi,
    cents: (rawMidi - midi) * 100,
  };
}

export function closestStringIndex(
  frequency: number,
  strings: GuitarString[],
  a4 = 440,
): number {
  let best = 0;
  let bestDistance = Infinity;
  strings.forEach((string, index) => {
    const distance = Math.abs(centsBetween(frequency, stringFrequency(string, a4)));
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}
