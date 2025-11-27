import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  title?: string;
  onBack?: () => void;
  action?: React.ReactNode;
};

export const TopNav: React.FC<Props> = ({title, onBack, action}) => {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.icon}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.action}>{action}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  back: {
    width: 40
  },
  spacer: {
    width: 40
  },
  icon: {
    fontSize: 26,
    color: colors.text
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.text,
    fontSize: 16
  },
  action: {
    width: 40,
    alignItems: 'flex-end'
  }
});
