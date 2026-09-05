import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { colors, closeCents, inTuneCents } from '../theme';

type Props = {
  cents: number | null;
  noteLabel: string;
  frequency: number | null;
  inTune: boolean;
};

function statusColor(cents: number | null, inTune: boolean): string {
  if (cents == null) {
    return colors.textMuted;
  }
  if (inTune || Math.abs(cents) <= inTuneCents) {
    return colors.inTune;
  }
  if (cents < 0) {
    return colors.flat;
  }
  return colors.sharp;
}

function statusText(cents: number | null, inTune: boolean): string {
  if (cents == null) {
    return 'Tel çek';
  }
  if (inTune || Math.abs(cents) <= inTuneCents) {
    return 'Tam';
  }
  if (Math.abs(cents) <= closeCents) {
    return cents < 0 ? 'Biraz pest' : 'Biraz tiz';
  }
  return cents < 0 ? 'Pest' : 'Tiz';
}

export function NeedleGauge({ cents, noteLabel, frequency, inTune }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const accent = statusColor(cents, inTune);
  const clamped = Math.max(-50, Math.min(50, cents ?? 0));

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: cents == null ? 0 : clamped,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [clamped, cents, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [-50, 50],
    outputRange: ['-72deg', '72deg'],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.dial}>
        <Svg width="280" height="132" viewBox="0 0 280 132">
          <Path
            d="M28 120 A112 112 0 0 1 252 120"
            stroke={colors.line}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M28 120 A112 112 0 0 1 252 120"
            stroke={accent}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="176"
            strokeDashoffset={cents == null ? 176 : Math.max(0, 176 - (1 - Math.abs(clamped) / 50) * 176)}
            opacity={0.85}
          />
          {[-40, -20, 0, 20, 40].map((mark) => {
            const angle = ((mark / 50) * 72 * Math.PI) / 180;
            const inner = mark === 0 ? 86 : 92;
            const x1 = 140 + Math.sin(angle) * inner;
            const y1 = 120 - Math.cos(angle) * inner;
            const x2 = 140 + Math.sin(angle) * 108;
            const y2 = 120 - Math.cos(angle) * 108;
            return (
              <Line
                key={mark}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={mark === 0 ? colors.gold : colors.textMuted}
                strokeWidth={mark === 0 ? 3 : 1.5}
              />
            );
          })}
          <Circle cx="140" cy="120" r="6" fill={colors.gold} />
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.needle,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <View style={[styles.needleArm, { backgroundColor: accent }]} />
        </Animated.View>
      </View>

      <Text style={[styles.note, { color: accent }]}>{noteLabel}</Text>
      <Text style={styles.status}>{statusText(cents, inTune)}</Text>
      <Text style={styles.meta}>
        {cents == null
          ? 'Mikrofon dinliyor'
          : `${cents > 0 ? '+' : ''}${cents.toFixed(1)} cent  ·  ${frequency?.toFixed(1)} Hz`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  dial: {
    width: 280,
    height: 132,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  needle: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 92,
    alignItems: 'center',
  },
  needleArm: {
    width: 3,
    height: 84,
    borderRadius: 2,
  },
  note: {
    marginTop: 8,
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 1,
  },
  status: {
    marginTop: 2,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 13,
  },
});
