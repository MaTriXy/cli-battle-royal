import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme';

interface MessageBubbleProps {
  text: string;
  senderName?: string;
  timestamp?: string;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  senderName,
  timestamp,
  isOwn,
}) => {
  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      {!isOwn && senderName && (
        <Text style={styles.senderName}>● {senderName} {timestamp}</Text>
      )}
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  senderName: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  otherBubble: {
    backgroundColor: colors.messageBubbleOther,
    borderBottomLeftRadius: spacing.xs,
  },
  text: {
    ...typography.body,
  },
  ownText: {
    color: colors.textOnPrimary,
  },
  otherText: {
    color: colors.text,
  },
});
