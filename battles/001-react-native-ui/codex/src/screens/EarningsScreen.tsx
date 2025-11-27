import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Ring} from '../components/Ring';
import {PrimaryButton} from '../components/PrimaryButton';
import {StatCard} from '../components/StatCard';
import {colors, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

const stats = [
  {label: 'Methods App UGC', value: '1.5M'},
  {label: 'Methods App UGC', value: '300k'},
  {label: 'Methods App UGC', value: '100k'}
];

export const EarningsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={gradients.soft} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.ringContainer}>
            <Ring size={120} />
          </View>
          <Text style={styles.amount}>$450.32</Text>
          <Text style={styles.caption}>You&apos;ve raised 82 of all creators for this Method.</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>$450.32</Text>
            <Text style={styles.progressLabel}>Top 5%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.statsSection}>
            <Text style={[typography.h3, styles.statsTitle]}>Your stats</Text>
            {stats.map(item => (
              <StatCard key={item.label + item.value} label={item.label} value={item.value} />
            ))}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton label="Cashout" onPress={() => {}} />
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
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  amount: {
    ...typography.h1,
    textAlign: 'center'
  },
  caption: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 20
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg
  },
  progressLabel: {
    fontWeight: '700',
    color: colors.text
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
    marginTop: spacing.sm
  },
  progressFill: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4
  },
  statsSection: {
    marginTop: spacing.xl,
    gap: spacing.sm
  },
  statsTitle: {
    marginBottom: spacing.sm
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl
  }
});
