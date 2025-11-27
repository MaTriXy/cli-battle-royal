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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@types';
import { colors, typography, spacing, borderRadius } from '@theme';
import { Button, RingLogo, StatCard } from '@components';
import { ChevronLeftIcon } from '@components/icons/TabIcons';

type MethodStatsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MethodStats'>;
  route: RouteProp<RootStackParamList, 'MethodStats'>;
};

export const MethodStatsScreen: React.FC<MethodStatsScreenProps> = ({
  navigation,
}) => {
  const stats = {
    totalEarnings: 450.32,
    rank: 67,
    totalCreators: 1000,
    percentile: 5,
    methods: [
      { id: '1', name: 'Methods App UGC', date: 'October 17th', views: 1500000 },
      { id: '2', name: 'Methods App UGC', date: 'October 15th', views: 300000 },
      { id: '3', name: 'Methods App UGC', date: 'October 16th', views: 100000 },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Earnings Section */}
        <View style={styles.earningsSection}>
          <RingLogo size={80} />
          <Text style={styles.earningsAmount}>
            ${stats.totalEarnings.toFixed(2)}
          </Text>
          <Text style={styles.rankText}>
            You're ranked #{stats.rank} out of all creators for this Method.
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressAmount}>
              ${stats.totalEarnings.toFixed(2)}
            </Text>
            <Text style={styles.progressPercentile}>
              Top {stats.percentile}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${100 - stats.percentile}%` },
              ]}
            />
          </View>
        </View>

        {/* Your Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your stats</Text>
          {stats.methods.map((method) => (
            <StatCard
              key={method.id}
              title={method.name}
              subtitle={method.date}
              views={method.views}
            />
          ))}
        </View>

        {/* Cashout Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Cashout"
            onPress={() => {}}
            icon={<Text style={styles.cashoutIcon}>↑</Text>}
            iconPosition="left"
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  earningsSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  earningsAmount: {
    ...typography.largeAmount,
    color: colors.primary,
    marginTop: spacing.lg,
  },
  rankText: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xxxl,
  },
  progressContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressAmount: {
    ...typography.smallMedium,
    color: colors.text,
  },
  progressPercentile: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  statsSection: {
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  cashoutIcon: {
    fontSize: 18,
    color: colors.textOnPrimary,
  },
});
