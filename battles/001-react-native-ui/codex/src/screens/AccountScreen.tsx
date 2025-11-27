import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Image} from 'react-native';
import {TopNav} from '../components/TopNav';
import {ListRow} from '../components/ListRow';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export const AccountScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TopNav title="Account" />
      <View style={styles.profileRow}>
        <Image
          source={{uri: 'https://placekitten.com/200/200'}}
          style={styles.avatar}
          accessibilityLabel="User avatar"
        />
        <View>
          <Text style={styles.name}>Ben Aratame</Text>
          <Text style={styles.email}>ben@methods.app</Text>
        </View>
      </View>
      <View style={styles.card}>
        <ListRow label="Your wallet" value="$303.45" />
        <ListRow label="Social accounts" />
        <ListRow label="Payment methods" />
        <ListRow label="Privacy Policy" />
        <ListRow label="Support" />
        <ListRow label="Report a bug" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text
  },
  email: {
    color: colors.textMuted,
    marginTop: 4
  },
  card: {
    marginHorizontal: spacing.xl,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border
  }
});
