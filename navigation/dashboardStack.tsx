import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../components/Dashboard';
import FoodSearch from '../components/FoodSearch';
import FoodsPage from '../components/FoodsPage';

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name='Dashboard' component={Dashboard} />
        <Stack.Screen name='FoodSearch' component={FoodSearch} />
        <Stack.Screen name='FoodsPage' component={FoodsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default DashboardStack;
