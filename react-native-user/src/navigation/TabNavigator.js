import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import AIGuideScreen from '../screens/main/AIGuideScreen';
import RewardsScreen from '../screens/main/RewardsScreen';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 5, backgroundColor: COLORS.white },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Units') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'AI Guide') iconName = focused ? 'scan-circle' : 'scan-circle-outline';
          else if (route.name === 'Impact') iconName = focused ? 'leaf' : 'leaf-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Units" component={HomeScreen} />
      <Tab.Screen name="AI Guide" component={AIGuideScreen} />
      <Tab.Screen name="Impact" component={RewardsScreen} />
    </Tab.Navigator>
  );
}