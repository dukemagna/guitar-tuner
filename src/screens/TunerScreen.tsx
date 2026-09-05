import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GuitarHeadstock } from '../components/GuitarHeadstock';
import { GuitarMark } from '../components/GuitarMark';
import { NeedleGauge } from '../components/NeedleGauge';
import { TuningPicker } from '../components/TuningPicker';
import { TUNINGS, displayNote, type Tuning, type TuningCategory } from '../data/tunings';
import { usePitchDetection, type TunerMode } from '../hooks/usePitchDetection';
import { colors } from '../theme';

export function TunerScreen() {
  const [tuning, setTuning] = useState<Tuning>(TUNINGS[0]);
  const [category, setCategory] = useState<TuningCategory>('pest');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mode, setMode] = useState<TunerMode>('auto');
  const [manualIndex, setManualIndex] = useState(0);
  const [a4, setA4] = useState(440);
  const wasInTune = useRef(false);

  const { permission, listening, reading, error, start, stop } = usePitchDetection(
    tuning.strings,
    a4,
    mode,
    manualIndex,
  );

  const activeIndex = mode === 'manual' ? manualIndex : (reading?.stringIndex ?? null);
  const activeString = activeIndex != null ? tuning.strings[activeIndex] : null;
  const noteLabel = activeString
    ? `${displayNote(activeString.note)}${activeString.octave}`
    : reading
      ? `${displayNote(reading.noteName)}${reading.octave}`
      : '--';

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

  const selectString = (index: number) => {
    setManualIndex(index);
    setMode('manual');
    Haptics.selectionAsync();
  };

  return (
    <LinearGradient colors={['#141018', colors.bg, '#0B0D10']} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <GuitarMark />
              <Text style={styles.brand}>AKORT</Text>
            </View>
            <Text style={styles.tuningName}>{tuning.name}</Text>
          </View>
          <Pressable onPress={() => setA4((value) => (value >= 444 ? 432 : value + 2))} style={styles.a4}>
            <Text style={styles.a4Label}>A4</Text>
            <Text style={styles.a4Value}>{a4}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setPickerOpen(true)} style={styles.tuningBtn}>
          <Text style={styles.tuningBtnText}>{tuning.shortName}</Text>
          <Text style={styles.tuningBtnSub}>Akort değiştir</Text>
        </Pressable>

        <NeedleGauge
          cents={reading?.cents ?? null}
          noteLabel={noteLabel}
          frequency={reading?.frequency ?? null}
          inTune={Boolean(reading?.inTune)}
        />

        <GuitarHeadstock
          strings={tuning.strings}
          activeIndex={activeIndex}
          cents={reading?.cents ?? null}
          inTune={Boolean(reading?.inTune)}
          onSelect={selectString}
        />

        <View style={styles.modes}>
          {(['auto', 'manual'] as const).map((item) => {
            const active = mode === item;
            return (
              <Pressable
                key={item}
                onPress={() => setMode(item)}
                style={[styles.mode, active && styles.modeActive]}
              >
                <Text style={[styles.modeText, active && styles.modeTextActive]}>
                  {item === 'auto' ? 'Otomatik tel' : 'Manuel tel'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.warn}>{error}</Text> : null}
        {permission === 'denied' ? (
          <Text style={styles.warn}>
            Mikrofon izni kapalı. iOS veya Android ayarlarından izin vermen gerekiyor.
          </Text>
        ) : (
          <Pressable
            onPress={listening ? stop : start}
            style={[styles.listen, listening && styles.listenOn]}
          >
            <Text style={styles.listenText}>{listening ? 'Dinlemeyi durdur' : 'Dinlemeye başla'}</Text>
          </Pressable>
        )}
        </ScrollView>
      </SafeAreaView>

      <TuningPicker
        visible={pickerOpen}
        selectedId={tuning.id}
        category={category}
        onCategory={setCategory}
        onSelect={(next) => {
          setTuning(next);
          setCategory(next.category);
          setManualIndex(0);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tuningName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  a4: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.line,
  },
  a4Label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  a4Value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  tuningBtn: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  tuningBtnText: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 15,
  },
  tuningBtnSub: {
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 12,
  },
  modes: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
  },
  mode: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.line,
  },
  modeActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDim,
  },
  modeText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  modeTextActive: {
    color: colors.gold,
  },
  listen: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.gold,
  },
  listenOn: {
    backgroundColor: colors.inTune,
  },
  listenText: {
    color: '#16120C',
    fontSize: 16,
    fontWeight: '800',
  },
  warn: {
    marginHorizontal: 20,
    marginTop: 12,
    color: colors.sharp,
    textAlign: 'center',
  },
});
