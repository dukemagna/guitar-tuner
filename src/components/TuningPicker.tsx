import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  CATEGORIES,
  tuningsFor,
  type InstrumentId,
  type Tuning,
  type TuningCategory,
} from '../data/tunings';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  visible: boolean;
  instrument: Exclude<InstrumentId, 'auto'>;
  selectedId: string;
  category: TuningCategory;
  onCategory: (category: TuningCategory) => void;
  onSelect: (tuning: Tuning) => void;
  onClose: () => void;
};

export function TuningPicker({
  visible,
  instrument,
  selectedId,
  category,
  onCategory,
  onSelect,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const all = tuningsFor(instrument);
  const categoryIds = [...new Set(all.map((item) => item.category))];
  const showCats = categoryIds.length > 1;
  const activeCategory = categoryIds.includes(category) ? category : categoryIds[0];
  const items = showCats ? all.filter((tuning) => tuning.category === activeCategory) : all;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.card }]} onPress={() => undefined}>
          <View style={[styles.handle, { backgroundColor: theme.line }]} />
          <Text style={[styles.title, { color: theme.text }]}>Akort seç</Text>
          {showCats ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cats}
            >
              {CATEGORIES.filter((item) => categoryIds.includes(item.id)).map((item) => {
                const active = item.id === activeCategory;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => onCategory(item.id)}
                    style={[
                      styles.cat,
                      {
                        backgroundColor: theme.pill,
                        borderColor: active ? theme.ink : theme.pillBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.catText, { color: active ? theme.text : theme.textMuted }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map((tuning) => {
              const selected = tuning.id === selectedId;
              return (
                <Pressable
                  key={tuning.id}
                  onPress={() => {
                    onSelect(tuning);
                    onClose();
                  }}
                  style={[
                    styles.row,
                    {
                      backgroundColor: theme.bg,
                      borderColor: selected ? theme.ink : theme.line,
                    },
                  ]}
                >
                  <View style={styles.rowText}>
                    <Text style={[styles.name, { color: theme.text }]}>{tuning.name}</Text>
                    <Text style={[styles.sub, { color: theme.textMuted }]}>{tuning.subtitle}</Text>
                  </View>
                  <Text style={[styles.short, { color: selected ? theme.text : theme.textMuted }]}>
                    {tuning.shortName}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    maxHeight: '78%',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  cats: {
    gap: 8,
    paddingBottom: 12,
  },
  cat: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  catText: {
    fontWeight: '600',
  },
  list: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginBottom: 8,
    borderWidth: 1,
  },
  rowText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    marginTop: 2,
    fontSize: 12,
  },
  short: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 110,
    textAlign: 'right',
  },
});
