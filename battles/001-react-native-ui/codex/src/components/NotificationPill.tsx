import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  title: string;
  amount: string;
  timestamp: string;
};

export const NotificationPill: React.FC<Props> = ({title, amount, timestamp}) => {
  return (
    <LinearGradient
      colors={gradients.soft}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <View style={styles.dot} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <Text style={styles.amount}>{amount}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 18,
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 4
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: spacing.md
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 12
  },
  amount: {
    fontWeight: '700',
    color: colors.text
  }
});
