import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Message } from '@types';
import { colors, typography, spacing, borderRadius } from '@theme';
import { MessageBubble, Avatar } from '@components';

type ChatScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Ben',
    text: 'Hey Guys',
    timestamp: new Date(),
    isOwn: true,
  },
  {
    id: '2',
    senderId: 'user2',
    senderName: 'Dris Elamri',
    text: 'Yo Ben wassup',
    timestamp: new Date(),
    isOwn: false,
  },
  {
    id: '3',
    senderId: 'user1',
    senderName: 'Ben',
    text: 'Wanna create this Method',
    timestamp: new Date(),
    isOwn: true,
  },
  {
    id: '4',
    senderId: 'user1',
    senderName: 'Ben',
    text: 'but together this time',
    timestamp: new Date(),
    isOwn: true,
  },
  {
    id: '5',
    senderId: 'user3',
    senderName: 'Jay',
    text: 'Am I invited???',
    timestamp: new Date(),
    isOwn: false,
  },
  {
    id: '6',
    senderId: 'user3',
    senderName: 'Jay',
    text: 'nvm in in',
    timestamp: new Date(),
    isOwn: false,
  },
  {
    id: '7',
    senderId: 'user3',
    senderName: 'Jay',
    text: 'Interested but where and what time',
    timestamp: new Date(),
    isOwn: false,
  },
  {
    id: '8',
    senderId: 'user1',
    senderName: 'Ben',
    text: '10 PM my place, bring your camera',
    timestamp: new Date(),
    isOwn: true,
  },
];

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const chatInfo = {
    name: 'Promote instinct.so',
    memberCount: 12,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user1',
      senderName: 'Ben',
      text: message,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showSender = !item.isOwn && prevMessage?.senderId !== item.senderId;

    return (
      <MessageBubble
        text={item.text}
        senderName={showSender ? item.senderName : undefined}
        timestamp={showSender ? '9 min' : undefined}
        isOwn={item.isOwn}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Cover Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: chatInfo.coverImage }}
          style={styles.coverImage}
          blurRadius={2}
        />
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <View style={styles.avatarGroup}>
              <Avatar size="small" name="A" />
              <View style={styles.avatarOverlap}>
                <Avatar size="small" name="B" />
              </View>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.chatName}>{chatInfo.name}</Text>
              <Text style={styles.memberCount}>
                {chatInfo.memberCount} Creators
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.messagesContainer}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type message..."
            placeholderTextColor={colors.textTertiary}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() && styles.sendButtonActive,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Text style={styles.sendIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    height: 120,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  chatName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  memberCount: {
    ...typography.small,
    color: colors.textSecondary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendIcon: {
    fontSize: 18,
  },
});
