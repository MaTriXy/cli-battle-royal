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
import { colors, typography, spacing, borderRadius } from '@theme';
import { RingLogo, StatCard } from '@components';

type AnalyticsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Analytics'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type AnalyticsScreenProps = {
  navigation: AnalyticsScreenNavigationProp;
};

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ navigation }) => {
  const analyticsData = {
    totalEarnings: 1245.67,
    thisMonth: 450.32,
    views: 4800000,
    engagementRate: 8.5,
    topMethods: [
      { id: '1', name: 'Product Showcase', date: 'Nov 20th', views: 1500000 },
      { id: '2', name: 'Tutorial Style', date: 'Nov 18th', views: 980000 },
      { id: '3', name: 'Lifestyle Content', date: 'Nov 15th', views: 750000 },
    ],
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <TouchableOpacity style={styles.periodSelector}>
            <Text style={styles.periodText}>This Month ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Card */}
        <TouchableOpacity
          style={styles.earningsCard}
          onPress={() => navigation.navigate('MethodStats', { methodId: '1' })}
        >
          <View style={styles.earningsHeader}>
            <RingLogo size={48} />
            <View style={styles.earningsInfo}>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsAmount}>
                ${analyticsData.totalEarnings.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.earningsFooter}>
            <View style={styles.earningsStat}>
              <Text style={styles.earnedThisMonth}>
                +${analyticsData.thisMonth.toFixed(2)}
              </Text>
              <Text style={styles.earnedLabel}>this month</Text>
            </View>
            <Text style={styles.viewDetails}>View details →</Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👁</Text>
            <Text style={styles.statValue}>{formatNumber(analyticsData.views)}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statValue}>{analyticsData.engagementRate}%</Text>
            <Text style={styles.statLabel}>Engagement</Text>
          </View>
        </View>

        {/* Top Performing Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing</Text>
          {analyticsData.topMethods.map((method) => (
            <StatCard
              key={method.id}
              title={method.name}
              subtitle={method.date}
              views={method.views}
            />
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  periodSelector: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  periodText: {
    ...typography.smallMedium,
    color: colors.text,
  },
  earningsCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundPink,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  earningsAmount: {
    ...typography.h1,
    color: colors.text,
  },
  earningsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
  },
  earningsStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  earnedThisMonth: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  earnedLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  viewDetails: {
    ...typography.smallMedium,
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
