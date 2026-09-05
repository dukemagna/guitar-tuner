import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { displayNote, type GuitarString } from '../data/tunings';
import { colors, inTuneCents } from '../theme';

type Props = {
  strings: GuitarString[];
  activeIndex: number | null;
  cents: number | null;
  inTune: boolean;
  onSelect: (index: number) => void;
};

const TUNERS = [
  { x: 48, y: 168, string: 0 },
  { x: 40, y: 118, string: 1 },
  { x: 46, y: 68, string: 2 },
  { x: 174, y: 68, string: 3 },
  { x: 180, y: 118, string: 4 },
  { x: 172, y: 168, string: 5 },
];

const NUT = [
  { x: 86, y: 236 },
  { x: 97, y: 236 },
  { x: 108, y: 236 },
  { x: 119, y: 236 },
  { x: 130, y: 236 },
  { x: 141, y: 236 },
];

function pegColor(index: number, activeIndex: number | null, cents: number | null, inTune: boolean) {
  if (activeIndex !== index) {
    return colors.string;
  }
  if (cents == null) {
    return colors.gold;
  }
  if (inTune || Math.abs(cents) <= inTuneCents) {
    return colors.inTune;
  }
  return cents < 0 ? colors.flat : colors.sharp;
}

export function GuitarHeadstock({ strings, activeIndex, cents, inTune, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="268" viewBox="0 0 220 280">
        <Defs>
          <LinearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8A5330" />
            <Stop offset="0.5" stopColor="#5C321C" />
            <Stop offset="1" stopColor="#3A1E10" />
          </LinearGradient>
          <LinearGradient id="neck" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4A2A16" />
            <Stop offset="1" stopColor="#24140C" />
          </LinearGradient>
        </Defs>

        <Path d="M86 236 H141 V280 H86 Z" fill="url(#neck)" />
        <Path
          d="M78 236
             C68 210 22 198 28 168
             C32 138 18 112 32 78
             C42 48 72 28 110 22
             C148 28 178 48 188 78
             C202 112 188 138 192 168
             C198 198 152 210 142 236
             Z"
          fill="url(#wood)"
        />
        <Path
          d="M78 236
             C68 210 22 198 28 168
             C32 138 18 112 32 78
             C42 48 72 28 110 22
             C148 28 178 48 188 78
             C202 112 188 138 192 168
             C198 198 152 210 142 236"
          fill="none"
          stroke="#C9A06A"
          strokeWidth="2.2"
        />
        <Path d="M84 236 H143" stroke="#E8D5A8" strokeWidth="5" strokeLinecap="round" />
        <Circle cx="110" cy="44" r="7" fill="#1A120C" stroke="#C9A06A" strokeWidth="1.4" />

        {TUNERS.map((tuner) => {
          const color = pegColor(tuner.string, activeIndex, cents, inTune);
          const nut = NUT[tuner.string];
          return (
            <Path
              key={`string-${tuner.string}`}
              d={`M${nut.x} ${nut.y} Q ${tuner.string < 3 ? 70 : 150} ${tuner.y + 24} ${tuner.x} ${tuner.y}`}
              stroke={color}
              strokeWidth={3.2 - tuner.string * 0.28}
              fill="none"
              strokeLinecap="round"
              opacity={activeIndex == null || activeIndex === tuner.string ? 1 : 0.35}
            />
          );
        })}

        {TUNERS.map((tuner) => {
          const color = pegColor(tuner.string, activeIndex, cents, inTune);
          const left = tuner.string < 3;
          return (
            <G key={`peg-${tuner.string}`}>
              <Circle
                cx={left ? tuner.x - 18 : tuner.x + 18}
                cy={tuner.y}
                r="11"
                fill="#2A2A2E"
                stroke={color}
                strokeWidth={activeIndex === tuner.string ? 2.4 : 1.2}
              />
              <Circle cx={tuner.x} cy={tuner.y} r="5.5" fill="#D9D3C4" stroke={color} strokeWidth="1.2" />
            </G>
          );
        })}
      </Svg>

      <View style={styles.row}>
        {strings.map((string, index) => {
          const color = pegColor(index, activeIndex, cents, inTune);
          const selected = activeIndex === index;
          return (
            <Pressable
              key={`${string.note}-${string.octave}-${index}`}
              onPress={() => onSelect(index)}
              style={[
                styles.chip,
                selected && { borderColor: color, backgroundColor: `${color}22` },
              ]}
            >
              <Text style={styles.chipIndex}>{6 - index}</Text>
              <Text style={[styles.chipNote, { color: selected ? color : colors.text }]}>
                {displayNote(string.note)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 4,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipIndex: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  chipNote: {
    fontSize: 16,
    fontWeight: '700',
  },
});
