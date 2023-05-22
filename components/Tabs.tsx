import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardStack from '../navigation/dashboardStack';
import Profile from './Profile';

const Tab = createMaterialBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    barStyle={{ backgroundColor: 'white' }}
    labeled={false}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = 'account-outline';
        }

        return (
          <MaterialCommunityIcons
            name={iconName}
            size={25}
            color={focused ? '#54D14D' : '#AFB2B5'}
          />
        );
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name='Dashboard' component={DashboardStack} />
    <Tab.Screen name='Profile' component={Profile} />
  </Tab.Navigator>
);

export default Tabs;
