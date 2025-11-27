import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  label: string;
  value?: string;
};

export const ListRow: React.FC<Props> = ({label, value}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : <Text style={styles.chevron}>›</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  label: {
    fontSize: 15,
    color: colors.text
  },
  value: {
    color: colors.text,
    fontWeight: '600'
  },
  chevron: {
    fontSize: 18,
    color: colors.textMuted
  }
});
