import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  text: string;
  fromMe?: boolean;
  time?: string;
};

export const ChatBubble: React.FC<Props> = ({text, fromMe, time}) => {
  return (
    <View style={[styles.container, fromMe ? styles.fromMe : styles.fromOther]}>
      <Text style={[styles.text, fromMe && styles.textMe]}>{text}</Text>
      {time ? <Text style={styles.time}>{time}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.sm
  },
  fromMe: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary
  },
  fromOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7'
  },
  text: {
    color: colors.text,
    fontSize: 15
  },
  textMe: {
    color: '#fff'
  },
  time: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted
  }
});
