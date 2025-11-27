import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types';
import { colors, typography, spacing, borderRadius } from '@theme';
import { Button, RingLogo } from '@components';

type NotificationPermissionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NotificationPermission'>;
};

export const NotificationPermissionScreen: React.FC<NotificationPermissionScreenProps> = ({
  navigation,
}) => {
  const handleAllow = () => {
    // Request notification permission
    navigation.replace('MainTabs');
  };

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Preview Notifications */}
        <View style={styles.previewContainer}>
          <View style={styles.notificationPreview}>
            <View style={styles.notificationContent}>
              <RingLogo size={32} />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>
                  You recieved your payout 🎉
                </Text>
                <Text style={styles.notificationBody}>
                  $35 credited to your wallet
                </Text>
              </View>
              <Text style={styles.notificationTime}>9:41 AM</Text>
            </View>
          </View>

          <View style={[styles.notificationPreview, styles.notificationSecond]}>
            <View style={styles.notificationContent}>
              <RingLogo size={32} />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>
                  You recieved your payout 🎉
                </Text>
                <Text style={styles.notificationBody}>
                  $35 credited to your wallet
                </Text>
              </View>
              <Text style={styles.notificationTime}>9:41 AM</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Never miss trending Methods</Text>
          <Text style={styles.subtitle}>
            Get notified for important alerts, payouts, Methods and more...
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Allow Notifications"
              onPress={handleAllow}
              icon={<Text style={styles.bellIcon}>🔔</Text>}
            />
            <Button
              title="Not right now"
              onPress={handleSkip}
              variant="outline"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPink,
  },
  content: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
  },
  notificationPreview: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationSecond: {
    marginLeft: spacing.xl,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    ...typography.smallMedium,
    color: colors.text,
  },
  notificationBody: {
    ...typography.small,
    color: colors.textSecondary,
  },
  notificationTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  mainContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.huge,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  bellIcon: {
    fontSize: 18,
  },
});
