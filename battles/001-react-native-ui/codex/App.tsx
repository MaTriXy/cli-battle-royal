import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {SplashScreen} from './src/screens/SplashScreen';
import {PhoneInputScreen} from './src/screens/PhoneInputScreen';
import {NotificationPromptScreen} from './src/screens/NotificationPromptScreen';
import {AccountScreen} from './src/screens/AccountScreen';
import {ChatScreen} from './src/screens/ChatScreen';
import {EarningsScreen} from './src/screens/EarningsScreen';
import {colors} from './src/theme/colors';
import {RootStackParamList} from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const tabBarLabel = (label: string) => () =>
  <Text style={{fontSize: 12, color: colors.text}}>{label}</Text>;

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 70,
        paddingBottom: 12,
        paddingTop: 10
      }
    }}>
    <Tab.Screen name="Account" component={AccountScreen} options={{tabBarLabel: tabBarLabel('Account')}} />
    <Tab.Screen name="Chat" component={ChatScreen} options={{tabBarLabel: tabBarLabel('Chat')}} />
    <Tab.Screen
      name="Earnings"
      component={EarningsScreen}
      options={{tabBarLabel: tabBarLabel('Methods')}}
    />
  </Tab.Navigator>
);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surface
  }
};

const App = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
        <Stack.Screen name="NotificationPrompt" component={NotificationPromptScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
