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
import SettingScreen from './SettingScreen';

const Stack = createStackNavigator();

export default function StackNavigationSetting() {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="Setting">
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name="FruitDetail"
        component={FruitDetailScreen}
        options={{ headerShown: false }}
      /> */}
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
