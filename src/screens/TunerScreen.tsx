import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DotGrid } from '../components/DotGrid';
import { GlassPill } from '../components/GlassPill';
import { IconMoon, IconSun } from '../components/Icons';
import { MetricSheet } from '../components/MetricSheet';
import { SoundLines } from '../components/SoundLines';
import {
  INSTRUMENTS,
  defaultTuning,
  displayNote,
  tuningsFor,
  type InstrumentId,
  type Tuning,
} from '../data/tunings';
import { usePitchDetection } from '../hooks/usePitchDetection';
import { useTheme } from '../theme/ThemeContext';

type DockMenu = 'instrument' | 'tuning' | null;
type PlayableId = Exclude<InstrumentId, 'auto'>;

const PLAYABLE = INSTRUMENTS.filter((item) => item.id !== 'auto') as {
  id: PlayableId;
  name: string;
}[];

export function TunerScreen() {
  const { theme, mode, toggle } = useTheme();
  const [instrument, setInstrument] = useState<InstrumentId>('auto');
  const [lastPlayable, setLastPlayable] = useState<PlayableId>('guitar');
  const [tuning, setTuning] = useState<Tuning>(defaultTuning('guitar'));
  const [menu, setMenu] = useState<DockMenu>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [a4, setA4] = useState(440);
  const wasInTune = useRef(false);

  const isAuto = instrument === 'auto';
  const { permission, listening, reading, error } = usePitchDetection(
    tuning.strings,
    a4,
    instrument,
    isAuto ? null : lockedIndex,
  );

  const activeIndex = isAuto ? null : (lockedIndex ?? reading?.stringIndex ?? null);
  const activeString = !isAuto && activeIndex != null ? tuning.strings[activeIndex] : null;
  const noteName = reading ? displayNote(reading.noteName) : '--';
  const noteWithOctave = reading ? `${displayNote(reading.noteName)}${reading.octave}` : '--';
  const centsLabel =
    reading == null ? '--' : `${reading.cents > 0 ? '+' : ''}${Math.round(reading.cents)}`;
  const hzLabel = reading ? `${reading.frequency.toFixed(1)}` : '--';
  const centsTone =
    reading == null ? 'default' : reading.inTune ? 'accent' : reading.cents < 0 ? 'flat' : 'sharp';

  useEffect(() => {
    if (listening) {
      activateKeepAwakeAsync();
      return () => {
        deactivateKeepAwake();
      };
    }
    return undefined;
  }, [listening]);

  useEffect(() => {
    const inTune = Boolean(reading?.inTune);
    if (inTune && !wasInTune.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasInTune.current = inTune;
  }, [reading?.inTune]);

  const toggleMenu = (next: DockMenu) => {
    setMenu((current) => (current === next ? null : next));
  };

  const selectInstrument = (next: PlayableId) => {
    setInstrument(next);
    setLastPlayable(next);
    setLockedIndex(null);
    const first = defaultTuning(next);
    setTuning(first);
    setMenu(null);
    Haptics.selectionAsync();
  };

  const selectAuto = () => {
    setInstrument('auto');
    setLockedIndex(null);
    setMenu(null);
    Haptics.selectionAsync();
  };

  const selectTuning = (next: Tuning) => {
    if (isAuto) {
      setInstrument(lastPlayable);
    }
    setTuning(next);
    setLockedIndex(null);
    setMenu(null);
    Haptics.selectionAsync();
  };

  const openTuning = () => {
    if (isAuto) {
      setInstrument(lastPlayable);
      setTuning(defaultTuning(lastPlayable));
    }
    toggleMenu('tuning');
  };

  const instrumentName = INSTRUMENTS.find((item) => item.id === instrument)?.name ?? 'Auto';
  const sheetTitle = isAuto ? 'AUTO' : instrumentName.toUpperCase();
  const status = permission === 'denied' ? 'İzin yok' : listening ? 'Dinleniyor' : 'Açılıyor';
  const playableId = (isAuto ? lastPlayable : instrument) as PlayableId;
  const tuningOptions = tuningsFor(playableId);

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setA4((value) => (value >= 444 ? 432 : value + 2))}
            style={[styles.headerBtn, { backgroundColor: theme.headerBtn, borderColor: theme.pillBorder }]}
          >
            <Text style={[styles.headerBtnText, { color: theme.text }]}>A4</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Akort</Text>
          <Pressable
            onPress={toggle}
            style={[styles.headerBtn, { backgroundColor: theme.headerBtn, borderColor: theme.pillBorder }]}
          >
            {mode === 'dark' ? <IconSun color={theme.text} size={16} /> : <IconMoon color={theme.text} size={16} />}
          </Pressable>
        </View>

        <Pressable style={styles.stage} onPress={() => setMenu(null)}>
          <DotGrid />
          <SoundLines cents={reading?.cents ?? null} inTune={Boolean(reading?.inTune)} />

          <View pointerEvents="none" style={styles.autoCenter}>
            <Text style={[styles.autoNote, { color: theme.text }]}>{noteName}</Text>
            <Text style={[styles.autoOctave, { color: theme.textMuted }]}>
              {reading ? (isAuto ? `Oktav ${reading.octave}` : `${centsLabel} cent`) : 'Ses ver'}
            </Text>
          </View>

          <View style={[styles.pills, styles.pillTL]} pointerEvents="none">
            <GlassPill label={isAuto ? 'Auto' : tuning.shortName} />
          </View>
          <View style={[styles.pills, styles.pillTR]} pointerEvents="none">
            <GlassPill label={`${centsLabel} cent`} tone={centsTone} />
          </View>
          <View style={[styles.pills, styles.pillBL]} pointerEvents="none">
            <GlassPill label={noteWithOctave} />
          </View>
          <View style={[styles.pills, styles.pillBR]} pointerEvents="none">
            <GlassPill label={`${hzLabel} Hz`} />
          </View>
        </Pressable>
      </SafeAreaView>

      <MetricSheet
        title={sheetTitle}
        status={error ? 'Hata' : status}
        active={listening && permission !== 'denied'}
        metrics={[
          { label: 'Sapma', value: centsLabel },
          { label: isAuto ? 'Nota' : 'Tel', value: isAuto ? noteName : (activeString ? displayNote(activeString.note) : noteName) },
          { label: isAuto ? 'Oktav' : 'Hz', value: isAuto ? (reading ? String(reading.octave) : '--') : hzLabel },
        ]}
        rows={[
          { label: 'Enstrüman', value: instrumentName },
          { label: 'Akort', value: isAuto ? 'Kromatik' : tuning.name },
          { label: 'A4', value: `${a4} Hz` },
        ]}
      />

      {permission === 'denied' ? (
        <Pressable style={styles.warnWrap} onPress={() => Linking.openSettings()}>
          <Text style={[styles.warn, { color: theme.sharp }]}>Mikrofon kapalı · ayarlara dokun</Text>
        </Pressable>
      ) : null}

      <SafeAreaView edges={['bottom']} style={styles.dockWrap}>
        <View style={styles.dock}>
          <View style={styles.dockCol}>
            <Pressable
              onPress={selectAuto}
              style={[
                styles.dockBtn,
                {
                  backgroundColor: isAuto && menu == null ? theme.dock : theme.headerBtn,
                  borderColor: theme.pillBorder,
                },
              ]}
            >
              <Text style={[styles.dockText, { color: isAuto && menu == null ? theme.dockOn : theme.text }]}>
                Auto
              </Text>
            </Pressable>
          </View>

          <View style={styles.dockCol}>
            {menu === 'instrument' ? (
              <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.pillBorder }]}>
                <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                  {PLAYABLE.map((item) => {
                    const active = !isAuto && instrument === item.id;
                    return (
                      <Pressable key={item.id} onPress={() => selectInstrument(item.id)} style={styles.dropItem}>
                        <Text style={[styles.dropText, { color: active ? theme.accent : theme.text }]}>
                          {item.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
            <Pressable
              onPress={() => toggleMenu('instrument')}
              style={[
                styles.dockBtn,
                {
                  backgroundColor: menu === 'instrument' || !isAuto ? theme.dock : theme.headerBtn,
                  borderColor: theme.pillBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.dockText,
                  { color: menu === 'instrument' || !isAuto ? theme.dockOn : theme.text },
                ]}
              >
                Enstrüman
              </Text>
            </Pressable>
          </View>

          <View style={styles.dockCol}>
            {menu === 'tuning' ? (
              <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.pillBorder }]}>
                <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                  {tuningOptions.map((item) => {
                    const active = !isAuto && tuning.id === item.id;
                    return (
                      <Pressable key={item.id} onPress={() => selectTuning(item)} style={styles.dropItem}>
                        <Text style={[styles.dropText, { color: active ? theme.accent : theme.text }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.dropSub, { color: theme.textMuted }]}>{item.shortName}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
            <Pressable
              onPress={openTuning}
              style={[
                styles.dockBtn,
                {
                  backgroundColor: menu === 'tuning' ? theme.dock : theme.headerBtn,
                  borderColor: theme.pillBorder,
                },
              ]}
            >
              <Text style={[styles.dockText, { color: menu === 'tuning' ? theme.dockOn : theme.text }]}>
                Akort
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stage: {
    flex: 1,
    marginTop: 8,
  },
  autoCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  autoNote: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
  autoOctave: {
    marginTop: 2,
    fontSize: 14,
  },
  pills: {
    position: 'absolute',
  },
  pillTL: {
    top: 18,
    left: 18,
  },
  pillTR: {
    top: 18,
    right: 18,
  },
  pillBL: {
    bottom: 24,
    left: 18,
  },
  pillBR: {
    bottom: 24,
    right: 18,
  },
  warnWrap: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 168,
  },
  warn: {
    fontSize: 12,
    fontWeight: '600',
  },
  dockWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 8,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dockCol: {
    flex: 1,
    alignItems: 'stretch',
  },
  dockBtn: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dockText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dropdown: {
    marginBottom: 8,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 240,
  },
  dropdownScroll: {
    maxHeight: 240,
  },
  dropItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropSub: {
    marginTop: 2,
    fontSize: 11,
  },
});
