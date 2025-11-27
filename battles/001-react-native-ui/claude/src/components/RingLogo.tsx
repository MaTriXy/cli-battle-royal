import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Ellipse, Path } from 'react-native-svg';
import { colors } from '@theme';

interface RingLogoProps {
  size?: number;
}

export const RingLogo: React.FC<RingLogoProps> = ({ size = 120 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E879F9" />
            <Stop offset="50%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#7C3AED" />
          </LinearGradient>
          <LinearGradient id="innerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F5D0FE" />
            <Stop offset="100%" stopColor="#DDD6FE" />
          </LinearGradient>
        </Defs>
        {/* Outer ring */}
        <Ellipse
          cx="60"
          cy="60"
          rx="45"
          ry="25"
          stroke="url(#ringGradient)"
          strokeWidth="12"
          fill="none"
          transform="rotate(-30 60 60)"
        />
        {/* Inner highlight */}
        <Ellipse
          cx="60"
          cy="60"
          rx="38"
          ry="18"
          stroke="url(#innerGradient)"
          strokeWidth="4"
          fill="none"
          transform="rotate(-30 60 60)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
