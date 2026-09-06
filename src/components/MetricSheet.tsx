import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { IconExpand } from './Icons';

type Metric = {
  label: string;
  value: string;
};

type Row = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  status: string;
  active: boolean;
  metrics: Metric[];
  rows: Row[];
  onExpand?: () => void;
};

export function MetricSheet({ title, status, active, metrics, rows, onExpand }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: active ? theme.accent : theme.textMuted }]} />
            <Text style={[styles.status, { color: theme.textMuted }]}>{status}</Text>
          </View>
        </View>
        {onExpand ? (
          <Pressable onPress={onExpand} hitSlop={12}>
            <IconExpand color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.metrics}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.rows}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{row.label}</Text>
            <View style={[styles.dots, { borderColor: theme.line }]} />
            <Text style={[styles.rowValue, { color: theme.text }]}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 92,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  status: {
    fontSize: 13,
  },
  metrics: {
    flexDirection: 'row',
    marginTop: 22,
    marginBottom: 8,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  rows: {
    marginTop: 18,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowLabel: {
    fontSize: 14,
  },
  dots: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
