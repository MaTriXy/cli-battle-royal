import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme';

interface CountryCodePickerProps {
  countryCode: string;
  flagEmoji: string;
  onPress?: () => void;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  countryCode,
  flagEmoji,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.flag}>{flagEmoji}</Text>
      <Text style={styles.code}>{countryCode}</Text>
      <Text style={styles.chevron}>▼</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    marginRight: spacing.md,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    ...typography.body,
    color: colors.text,
  },
  chevron: {
    fontSize: 10,
    color: colors.textTertiary,
  },
});
