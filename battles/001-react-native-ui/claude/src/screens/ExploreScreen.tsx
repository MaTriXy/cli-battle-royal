import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '@types';
import { colors, typography, spacing, borderRadius } from '@theme';
import { Avatar, RingLogo } from '@components';

type ExploreScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Explore'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type ExploreScreenProps = {
  navigation: ExploreScreenNavigationProp;
};

interface TrendingMethod {
  id: string;
  title: string;
  creator: string;
  creatorAvatar?: string;
  earnings: number;
  views: number;
}

const trendingMethods: TrendingMethod[] = [
  {
    id: '1',
    title: 'Product Showcase UGC',
    creator: 'Sarah Chen',
    earnings: 2450,
    views: 3200000,
  },
  {
    id: '2',
    title: 'Before/After Content',
    creator: 'Mike Torres',
    earnings: 1890,
    views: 1800000,
  },
  {
    id: '3',
    title: 'Unboxing Experience',
    creator: 'Emma Wilson',
    earnings: 1650,
    views: 2100000,
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const renderMethodCard = ({ item }: { item: TrendingMethod }) => (
    <TouchableOpacity
      style={styles.methodCard}
      onPress={() => navigation.navigate('MethodStats', { methodId: item.id })}
    >
      <View style={styles.methodHeader}>
        <RingLogo size={48} />
        <View style={styles.methodBadge}>
          <Text style={styles.badgeText}>🔥 Trending</Text>
        </View>
      </View>
      <Text style={styles.methodTitle}>{item.title}</Text>
      <View style={styles.creatorInfo}>
        <Avatar size="small" name={item.creator} />
        <Text style={styles.creatorName}>{item.creator}</Text>
      </View>
      <View style={styles.methodStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>${formatNumber(item.earnings)}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatNumber(item.views)}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.title}>Explore Methods</Text>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('Chat', { groupId: '1' })}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Join Creator Groups</Text>
              <Text style={styles.featuredSubtitle}>
                Collaborate with other creators and share Methods together
              </Text>
              <View style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Explore Groups →</Text>
              </View>
            </View>
            <RingLogo size={80} />
          </TouchableOpacity>
        </View>

        {/* Trending Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Methods</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingMethods}
            renderItem={renderMethodCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.methodsList}
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.xs,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAll: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  featuredCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundPink,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    ...typography.h3,
    color: colors.text,
  },
  featuredSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  featuredButton: {
    marginTop: spacing.md,
  },
  featuredButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  methodsList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  methodCard: {
    width: 200,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: spacing.md,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  methodBadge: {
    backgroundColor: colors.backgroundPink,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary,
  },
  methodTitle: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  creatorName: {
    ...typography.small,
    color: colors.textSecondary,
  },
  methodStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
  },
  statValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
});
