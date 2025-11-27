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
import { RingLogo } from '@components';

type IdeasScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Ideas'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type IdeasScreenProps = {
  navigation: IdeasScreenNavigationProp;
};

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  potentialEarnings: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const ideas: Idea[] = [
  {
    id: '1',
    title: 'Day in My Life',
    description: 'Authentic content showing your daily routine while using products',
    category: 'Lifestyle',
    potentialEarnings: '$50-150',
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Product Comparison',
    description: 'Compare similar products and give honest reviews',
    category: 'Review',
    potentialEarnings: '$100-300',
    difficulty: 'Medium',
  },
  {
    id: '3',
    title: 'Tutorial Style',
    description: 'How-to content demonstrating product features',
    category: 'Educational',
    potentialEarnings: '$75-200',
    difficulty: 'Medium',
  },
  {
    id: '4',
    title: 'Transformation',
    description: 'Before and after content showing product results',
    category: 'Results',
    potentialEarnings: '$150-400',
    difficulty: 'Hard',
  },
];

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return colors.success;
    case 'Medium':
      return colors.warning;
    case 'Hard':
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

export const IdeasScreen: React.FC<IdeasScreenProps> = ({ navigation }) => {
  const renderIdeaCard = ({ item }: { item: Idea }) => (
    <TouchableOpacity style={styles.ideaCard}>
      <View style={styles.ideaHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) + '20' },
          ]}
        >
          <Text
            style={[
              styles.difficultyText,
              { color: getDifficultyColor(item.difficulty) },
            ]}
          >
            {item.difficulty}
          </Text>
        </View>
      </View>
      <Text style={styles.ideaTitle}>{item.title}</Text>
      <Text style={styles.ideaDescription}>{item.description}</Text>
      <View style={styles.ideaFooter}>
        <Text style={styles.earningsLabel}>Potential</Text>
        <Text style={styles.earningsValue}>{item.potentialEarnings}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ideas</Text>
          <Text style={styles.subtitle}>Content inspiration for your next Method</Text>
        </View>

        {/* Featured Idea */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredCard}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>💡 Featured</Text>
              </View>
              <Text style={styles.featuredTitle}>AI-Generated Ideas</Text>
              <Text style={styles.featuredDescription}>
                Get personalized content ideas based on your niche and past performance
              </Text>
              <TouchableOpacity style={styles.generateButton}>
                <Text style={styles.generateButtonText}>Generate Ideas</Text>
              </TouchableOpacity>
            </View>
            <RingLogo size={60} />
          </View>
        </View>

        {/* Ideas List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Ideas</Text>
          <FlatList
            data={ideas}
            renderItem={renderIdeaCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.ideasList}
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
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  featuredSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  featuredCard: {
    backgroundColor: colors.backgroundPink,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  featuredBadgeText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  featuredTitle: {
    ...typography.h3,
    color: colors.text,
  },
  featuredDescription: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  generateButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  generateButtonText: {
    ...typography.smallMedium,
    color: colors.textOnPrimary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  ideasList: {
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  ideaCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  ideaHeader: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  difficultyText: {
    ...typography.captionMedium,
  },
  ideaTitle: {
    ...typography.bodySemibold,
    color: colors.text,
  },
  ideaDescription: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  ideaFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  earningsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  earningsValue: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
