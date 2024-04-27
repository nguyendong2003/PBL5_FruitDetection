import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// screen

import HomeScreen from './HomeScreen';
import FruitDetailScreen from './FruitDetailScreen';
import PersonalInformationScreen from './PersonalInformationScreen';

const Stack = createStackNavigator();

export default function StackNavigationHome() {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FruitDetail"
        component={FruitDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
        options={{
          title: 'Personal information',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          // headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
