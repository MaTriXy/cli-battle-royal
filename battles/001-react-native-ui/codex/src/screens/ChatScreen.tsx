import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Image, ScrollView, TextInput} from 'react-native';
import {ChatBubble} from '../components/ChatBubble';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {PrimaryButton} from '../components/PrimaryButton';

const messages = [
  {text: 'Yo Ben wassup', fromMe: false},
  {text: 'Wanna create this Method collab?', fromMe: false},
  {text: 'Not together this time', fromMe: false},
  {text: 'Am I invited??', fromMe: true},
  {text: "I'm in", fromMe: false},
  {text: 'Interested but where and when', fromMe: true},
  {text: '6pm my place, bring your camera', fromMe: false}
];

export const ChatScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.user}>
          <Image source={{uri: 'https://placekitten.com/80/80'}} style={styles.avatar} />
          <View>
            <Text style={styles.title}>Promote Instinct.so</Text>
            <Text style={styles.subtitle}>12 Creators</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.messages} contentContainerStyle={styles.messageContent}>
        {messages.map((msg, index) => (
          <ChatBubble key={msg.text + index} text={msg.text} fromMe={msg.fromMe} />
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput placeholder="Type message..." style={styles.input} />
        <PrimaryButton label="Send" onPress={() => {}} style={styles.send} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: spacing.md
  },
  title: {
    fontWeight: '700',
    color: colors.text
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 2
  },
  messages: {
    flex: 1
  },
  messageContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.sm
  },
  input: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  send: {
    minWidth: 80
  }
});
