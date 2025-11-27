import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {gradients} from '../theme/colors';

// Simple ring illustration using nested gradients to avoid missing assets.
export const Ring: React.FC<{size?: number}> = ({size = 160}) => {
  const outerSize = size;
  const innerSize = size * 0.55;

  return (
    <View style={[styles.outer, {width: outerSize, height: outerSize, borderRadius: outerSize / 2}]}>
      <LinearGradient
        colors={[gradients.soft[0], gradients.primary[1]]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.outer, {borderRadius: outerSize / 2}]}>
        <View
          style={[
            styles.inner,
            {width: innerSize, height: innerSize, borderRadius: innerSize / 2}
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    backgroundColor: '#fff',
    opacity: 0.9
  }
});
