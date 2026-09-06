export const inTuneCents = 5;
export const closeCents = 18;

export type ThemeMode = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  bg: string;
  glow: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  ink: string;
  inkSoft: string;
  grid: string;
  pill: string;
  pillBorder: string;
  line: string;
  accent: string;
  accentMuted: string;
  flat: string;
  sharp: string;
  dock: string;
  dockOn: string;
  headerBtn: string;
};

export const lightTheme: Theme = {
  mode: 'light',
  bg: '#FFFFFF',
  glow: 'rgba(255,255,255,0.0)',
  card: '#FFFFFF',
  cardBorder: 'rgba(28,28,28,0.06)',
  text: '#1C1C1C',
  textMuted: '#8A8A84',
  ink: '#242424',
  inkSoft: '#9A9A94',
  grid: 'rgba(28,28,28,0.10)',
  pill: 'rgba(255,255,255,0.88)',
  pillBorder: 'rgba(28,28,28,0.08)',
  line: 'rgba(28,28,28,0.10)',
  accent: '#2F9E4F',
  accentMuted: 'rgba(47,158,79,0.14)',
  flat: '#3D7EEA',
  sharp: '#E05A4F',
  dock: '#1C1C1C',
  dockOn: '#FFFFFF',
  headerBtn: '#FFFFFF',
};

export const darkTheme: Theme = {
  mode: 'dark',
  bg: '#121212',
  glow: 'rgba(40, 38, 32, 0.95)',
  card: '#1C1C1C',
  cardBorder: 'rgba(255,255,255,0.06)',
  text: '#F3F2EC',
  textMuted: '#8E8E88',
  ink: '#E8E6DF',
  inkSoft: '#6E6E68',
  grid: 'rgba(255,255,255,0.07)',
  pill: 'rgba(28,28,28,0.78)',
  pillBorder: 'rgba(255,255,255,0.10)',
  line: 'rgba(255,255,255,0.08)',
  accent: '#4CC86A',
  accentMuted: 'rgba(76,200,106,0.16)',
  flat: '#6EA8FF',
  sharp: '#FF7A6E',
  dock: '#F3F2EC',
  dockOn: '#121212',
  headerBtn: 'rgba(28,28,28,0.82)',
};
