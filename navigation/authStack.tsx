import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { responsiveHeight } from '../utils/dimensionHelpers';
import Login from '../components/Login';
import Register from '../components/Register';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white',
            height: responsiveHeight(150),
          },
          headerTitleStyle: {
            fontSize: 34,
            fontWeight: 'bold',
          },
          headerTitleContainerStyle: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 10,
          },
          headerLeft: () => null,
        }}
      >
        <Stack.Screen
          name='Register'
          component={Register}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ title: 'Sign In' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
