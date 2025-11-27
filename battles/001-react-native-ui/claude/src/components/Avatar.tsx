import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borderRadius } from '@theme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 64,
  xlarge: 80,
};

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'medium',
  style,
}) => {
  const dimension = sizeMap[size];
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const containerStyle = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
    },
    style,
  ];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[containerStyle, styles.image]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[containerStyle, styles.placeholder]}>
      <Text
        style={[
          styles.initials,
          { fontSize: dimension * 0.4 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {},
  placeholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
});
