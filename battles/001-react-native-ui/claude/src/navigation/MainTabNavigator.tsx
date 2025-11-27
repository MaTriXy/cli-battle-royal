import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { colors, typography, spacing } from '@theme';
import { MainTabParamList } from '@types';
import {
  ExploreIcon,
  AnalyticsIcon,
  IdeasIcon,
  AccountIcon,
} from '@components/icons/TabIcons';

import { ExploreScreen } from '@screens/ExploreScreen';
import { AnalyticsScreen } from '@screens/AnalyticsScreen';
import { IdeasScreen } from '@screens/IdeasScreen';
import { AccountScreen } from '@screens/AccountScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) => <ExploreIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnalyticsIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Ideas"
        component={IdeasScreen}
        options={{
          tabBarIcon: ({ focused }) => <IdeasIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused }) => <AccountIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    height: 85,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  tabLabel: {
    ...typography.captionMedium,
    marginTop: spacing.xs,
  },
});
