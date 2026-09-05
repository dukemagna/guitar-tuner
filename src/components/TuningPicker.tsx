import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES, TUNINGS, type Tuning, type TuningCategory } from '../data/tunings';
import { colors } from '../theme';

type Props = {
  visible: boolean;
  selectedId: string;
  category: TuningCategory;
  onCategory: (category: TuningCategory) => void;
  onSelect: (tuning: Tuning) => void;
  onClose: () => void;
};

export function TuningPicker({
  visible,
  selectedId,
  category,
  onCategory,
  onSelect,
  onClose,
}: Props) {
  const items = TUNINGS.filter((tuning) => tuning.category === category);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.handle} />
          <Text style={styles.title}>Akort seç</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cats}
          >
            {CATEGORIES.map((item) => {
              const active = item.id === category;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => onCategory(item.id)}
                  style={[styles.cat, active && styles.catActive]}
                >
                  <Text style={[styles.catText, active && styles.catTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
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
                  style={[styles.row, selected && styles.rowActive]}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.name}>{tuning.name}</Text>
                    <Text style={styles.sub}>{tuning.subtitle}</Text>
                  </View>
                  <Text style={[styles.short, selected && { color: colors.gold }]}>
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
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    maxHeight: '78%',
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginTop: 10,
    marginBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
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
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.line,
  },
  catActive: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  catText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  catTextActive: {
    color: colors.gold,
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
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDim,
  },
  rowText: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 12,
  },
  short: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 110,
    textAlign: 'right',
  },
});
