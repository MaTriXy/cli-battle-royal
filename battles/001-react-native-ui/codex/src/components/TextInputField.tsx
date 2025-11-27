import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = TextInputProps & {
  label?: string;
  helperText?: string;
};

export const TextInputField: React.FC<Props> = ({label, helperText, style, ...inputProps}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text
  },
  helper: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12
  }
});
