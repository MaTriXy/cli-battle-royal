import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types';
import { colors, typography, spacing, borderRadius } from '@theme';
import { Button, Input, CountryCodePicker, RingLogo } from '@components';
import { ChevronLeftIcon } from '@components/icons/TabIcons';

type PhoneAuthScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhoneAuth'>;
};

export const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (phoneNumber.length < 10) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('NotificationPermission');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>
          Enter you number to create an account.
        </Text>

        {/* Phone Input */}
        <View style={styles.phoneInputContainer}>
          <View style={styles.inputWrapper}>
            <CountryCodePicker
              countryCode={countryCode}
              flagEmoji="🇺🇸"
              onPress={() => {}}
            />
            <Input
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder=""
              keyboardType="phone-pad"
              containerStyle={styles.phoneInput}
              autoFocus
            />
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <RingLogo size={200} />
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleContinue}
            loading={isLoading}
            disabled={phoneNumber.length < 10}
            icon={<Text style={styles.buttonIcon}>›</Text>}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    marginTop: spacing.lg,
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  phoneInputContainer: {
    marginTop: spacing.xxl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingBottom: spacing.xxxl,
  },
  buttonIcon: {
    fontSize: 24,
    color: colors.textOnPrimary,
    marginLeft: spacing.xs,
  },
});
