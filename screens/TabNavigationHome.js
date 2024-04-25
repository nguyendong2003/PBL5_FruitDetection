import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  Image,
  Pressable,
  Button,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  FontAwesome,
  Ionicons,
  Entypo,
  Feather,
  AntDesign,
  Fontisto,
} from '@expo/vector-icons';

import { useState, useEffect } from 'react';

// Tab Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Screen
import StackNavigationHome from './StackNavigationHome';
import StackNavigationSetting from './StackNavigationSetting';
import DetectScreen from './DetectScreen';
import SettingScreen from './SettingScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigationHome({ navigation }) {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  // console.log({ windowWidth, windowHeight });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: 'below-icon',
        tabBarShowLabel: true,

        // tabBarActiveBackgroundColor: 'green', // đổi màu nền của tab item được click

        // tabBarInactiveTintColor: "blue",     // đổi màu chữ của tab item không được click
        // tabBarInactiveBackgroundColor: "purple", // đổi màu nền của tab item không được click
      }}
    >
      <Tab.Screen
        name="StackNavigationHome"
        component={StackNavigationHome}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: '#09B44C',
        }}
      />
      <Tab.Screen
        name="Detect"
        component={DetectScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Detect',
          tabBarIcon: ({ color }) => (
            <AntDesign name="scan1" size={24} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: '#09B44C',
        }}
      />
      <Tab.Screen
        name="StackNavigationSetting"
        component={StackNavigationSetting}
        options={{
          headerShown: false,
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color }) => (
            <Fontisto name="player-settings" size={24} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: '#09B44C',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // paddingTop: StatusBar.currentHeight + 16,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  //
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
  },
  cardText: {
    marginTop: 8,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  //
  inputSearch: {
    marginLeft: 8,
    fontSize: 22,
    width: '90%',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
