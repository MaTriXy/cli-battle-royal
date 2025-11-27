import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
};

export const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  disabled,
  variant = 'primary',
  style
}) => {
  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
        onPress={onPress}
        style={[styles.ghostButton, disabled && styles.disabled, style]}>
        <Text style={styles.ghostLabel}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} disabled={disabled} onPress={onPress} style={style}>
      <LinearGradient
        colors={gradients.primary}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.button, disabled && styles.disabled]}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    paddingVertical: spacing.md,
    alignItems: 'center'
  },
  ghostButton: {
    borderRadius: 28,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  ghostLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.6
  }
});
