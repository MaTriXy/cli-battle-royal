import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NotificationPill} from '../components/NotificationPill';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationPrompt'>;

const sampleNotifications = [
  {title: 'You received your payout', amount: '$12 credited to your wallet', timestamp: '10m ago'},
  {title: 'You received your payout', amount: '$33 credited to your wallet', timestamp: '23m ago'}
];

export const NotificationPromptScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[colors.surface, gradients.soft[1]]}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.pills}>
            {sampleNotifications.map(item => (
              <NotificationPill
                key={item.timestamp + item.amount}
                title={item.title}
                amount={item.amount}
                timestamp={item.timestamp}
              />
            ))}
          </View>
          <View style={styles.textBlock}>
            <Text style={[typography.h2, styles.title]}>Never miss trending Methods</Text>
            <Text style={styles.subtitle}>
              Get notified for important alerts, payouts, Methods news, and more.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <PrimaryButton label="Allow Notifications" onPress={() => navigation.replace('MainTabs')} />
          <PrimaryButton
            variant="ghost"
            label="Not right now"
            onPress={() => navigation.replace('MainTabs')}
            style={styles.secondary}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface
  },
  container: {
    flex: 1
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg
  },
  pills: {
    marginTop: spacing.md
  },
  textBlock: {
    marginTop: spacing.xl
  },
  title: {
    lineHeight: 32
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md
  },
  secondary: {
    marginTop: spacing.sm
  }
});
