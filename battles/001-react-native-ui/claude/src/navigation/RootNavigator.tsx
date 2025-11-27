import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types';

import { SplashScreen } from '@screens/SplashScreen';
import { PhoneAuthScreen } from '@screens/PhoneAuthScreen';
import { NotificationPermissionScreen } from '@screens/NotificationPermissionScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { MethodStatsScreen } from '@screens/MethodStatsScreen';
import { ChatScreen } from '@screens/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <Stack.Screen
        name="NotificationPermission"
        component={NotificationPermissionScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="MethodStats"
        component={MethodStatsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
