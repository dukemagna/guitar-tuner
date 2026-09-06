import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';

type Props = {
  label: string;
  tone?: 'default' | 'accent' | 'flat' | 'sharp';
};

export function GlassPill({ label, tone = 'default' }: Props) {
  const { theme } = useTheme();
  const color =
    tone === 'accent' ? theme.accent : tone === 'flat' ? theme.flat : tone === 'sharp' ? theme.sharp : theme.text;

  return (
    <View style={[styles.pill, { backgroundColor: theme.pill, borderColor: theme.pillBorder }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
