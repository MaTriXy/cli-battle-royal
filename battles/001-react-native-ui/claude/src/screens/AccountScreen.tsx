import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '@types';
import { colors, typography, spacing } from '@theme';
import { Avatar, SettingsRow } from '@components';
import {
  WalletIcon,
  SocialIcon,
  PaymentIcon,
  BellIcon,
  EditIcon,
} from '@components/icons/TabIcons';

type AccountScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Account'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type AccountScreenProps = {
  navigation: AccountScreenNavigationProp;
};

export const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const user = {
    name: 'Ben Aratame',
    avatar: 'https://i.pravatar.cc/150?img=33',
    walletBalance: 303.45,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <TouchableOpacity style={styles.editButton}>
            <EditIcon size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar uri={user.avatar} name={user.name} size="xlarge" />
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          <SettingsRow
            icon={<WalletIcon size={20} color={colors.text} />}
            label="Your wallet"
            value={`$${user.walletBalance.toFixed(2)}`}
            onPress={() => {}}
          />
          <SettingsRow
            icon={<SocialIcon size={20} color={colors.text} />}
            label="Social accounts"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<PaymentIcon size={20} color={colors.text} />}
            label="Payment method"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<BellIcon size={20} color={colors.text} />}
            label="Notifications"
            onPress={() => {}}
          />
        </View>

        {/* Links Section */}
        <View style={styles.linksSection}>
          <SettingsRow
            icon={<View style={styles.linkIconPlaceholder} />}
            label="Privacy Policy"
            showChevron={false}
            showExternalLink
            onPress={() => {}}
          />
          <SettingsRow
            icon={<View style={styles.linkIconPlaceholder} />}
            label="Support"
            showChevron={false}
            showExternalLink
            onPress={() => {}}
          />
          <SettingsRow
            icon={<View style={styles.linkIconPlaceholder} />}
            label="Report a bug"
            showChevron={false}
            showExternalLink
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
  },
  settingsList: {
    paddingHorizontal: spacing.xl,
  },
  linksSection: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  linkIconPlaceholder: {
    width: 20,
    height: 20,
  },
});
