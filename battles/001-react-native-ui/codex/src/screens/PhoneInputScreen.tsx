import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {TopNav} from '../components/TopNav';
import {TextInputField} from '../components/TextInputField';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneInput'>;

export const PhoneInputScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <TopNav onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={[typography.h2, styles.title]}>What&apos;s your phone number?</Text>
        <Text style={styles.subtitle}>Enter your number to create an account.</Text>
        <View style={styles.inputContainer}>
          <TextInputField
            placeholder="+1 555 123 4567"
            keyboardType="phone-pad"
            accessibilityLabel="Phone number"
          />
        </View>
      </View>
      <View style={styles.cta}>
        <PrimaryButton label="Next" onPress={() => navigation.navigate('NotificationPrompt')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl
  },
  title: {
    marginTop: spacing.lg
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15
  },
  inputContainer: {
    marginTop: spacing.xl
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl
  }
});
