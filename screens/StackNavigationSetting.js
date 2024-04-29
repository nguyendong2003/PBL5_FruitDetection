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

import { Ionicons } from '@expo/vector-icons';
// screen
import SettingScreen from './SettingScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import DetectHistoryScreen from './DetectHistoryScreen';
import DetectFruitDetailScreen from './DetectFruitDetailScreen';
import PersonalInformationScreen from './PersonalInformationScreen';
import FavouriteFruitScreen from './FavouriteFruitScreen';
import FavouriteFruitDetailScreen from './FavouriteFruitDetailScreen';

const Stack = createStackNavigator();

export default function StackNavigationSetting({ navigation }) {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="Setting">
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: 'Change Password',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 12 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.navigate('Setting')}
            />
          ),
        }}
      />

      <Stack.Screen
        name="DetectHistory"
        component={DetectHistoryScreen}
        options={{
          title: 'Detect History',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 12 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.navigate('Setting')}
            />
          ),
        }}
      />

      <Stack.Screen
        name="DetectFruitDetail"
        component={DetectFruitDetailScreen}
        options={{
          title: 'Detect fruit detail',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 12 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.navigate('Setting')}
            />
          ),
        }}
      />

      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
        options={{
          title: 'Personal information',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 12 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.navigate('Setting')}
            />
          ),
        }}
      />
      <Stack.Screen
        name="FavouriteFruit"
        component={FavouriteFruitScreen}
        options={{
          title: 'Favourite fruit',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 12 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.navigate('Setting')}
            />
          ),
        }}
      />
      <Stack.Screen
        name="FavouriteFruitDetail"
        component={FavouriteFruitDetailScreen}
        options={{
          title: 'Favourite fruit detail',
          headerStyle: {
            backgroundColor: '#09B44C',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <Ionicons
              style={{ marginLeft: 12 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.navigate('FavouriteFruit')}
            />
          ),
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
