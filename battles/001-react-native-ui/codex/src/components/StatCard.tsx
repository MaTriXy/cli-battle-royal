import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
};

export const StatCard: React.FC<Props> = ({label, value, sublabel, highlight}) => {
  return (
    <View style={[styles.container, highlight && styles.highlight]}>
      <Text style={[styles.value, highlight && styles.valueHighlight]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm
  },
  highlight: {
    backgroundColor: colors.secondary,
    borderColor: 'transparent'
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text
  },
  valueHighlight: {
    color: colors.primary
  },
  label: {
    marginTop: 4,
    color: colors.textMuted
  },
  sublabel: {
    marginTop: 4,
    color: colors.text
  }
});
