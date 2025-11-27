import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  body: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text
  },
  bodyMuted: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted
  }
});
