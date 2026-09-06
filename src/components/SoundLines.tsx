import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { useTheme } from '../theme/ThemeContext';

type Props = {
  cents: number | null;
  inTune: boolean;
};

const COUNT = 49;
const WIDTH = 320;
const HEIGHT = 168;

function SoundLinesComponent({ cents, inTune }: Props) {
  const { theme } = useTheme();
  const lines = useMemo(() => {
    const mid = (COUNT - 1) / 2;
    const peak = cents == null ? 0 : Math.max(-mid, Math.min(mid, (cents / 50) * 16));
    const items: { x: number; y1: number; y2: number; color: string; width: number }[] = [];

    for (let i = 0; i < COUNT; i += 1) {
      const x = 8 + (i * (WIDTH - 16)) / (COUNT - 1);
      const dist = Math.abs(i - mid - peak);
      const envelope = cents == null ? 0.18 : Math.exp(-(dist * dist) / 22);
      const height = 10 + envelope * 118;
      const y1 = (HEIGHT - height) / 2;
      const y2 = y1 + height;
      const near = dist < 1.2;
      const color = inTune && near ? theme.accent : near ? theme.ink : theme.inkSoft;
      items.push({
        x,
        y1,
        y2,
        color,
        width: near ? 1.6 : 0.85,
      });
    }
    return items;
  }, [cents, inTune, theme.accent, theme.ink, theme.inkSoft]);

  const centerX = WIDTH / 2;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Line
          x1={centerX}
          y1={8}
          x2={centerX}
          y2={HEIGHT - 8}
          stroke={theme.line}
          strokeWidth="0.8"
          strokeDasharray="2 3"
        />
        {lines.map((line) => (
          <Line
            key={line.x}
            x1={line.x}
            y1={line.y1}
            x2={line.x}
            y2={line.y2}
            stroke={line.color}
            strokeWidth={line.width}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}

export const SoundLines = memo(SoundLinesComponent);

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
