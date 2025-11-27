import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@theme';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  showExternalLink?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  showExternalLink = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        {showChevron && !showExternalLink && (
          <Text style={styles.chevron}>›</Text>
        )}
        {showExternalLink && (
          <Text style={styles.externalLink}>↗</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.body,
    color: colors.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  externalLink: {
    fontSize: 16,
    color: colors.textTertiary,
  },
});
