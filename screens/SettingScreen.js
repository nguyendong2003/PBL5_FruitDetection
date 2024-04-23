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
  PermissionsAndroid,
} from 'react-native';

import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
  Entypo,
  Fontisto,
  AntDesign,
} from '@expo/vector-icons';

import { useState, useEffect, useRef } from 'react';
// Upload image
import * as ImagePicker from 'expo-image-picker';
// Camera
import { Camera, CameraType } from 'expo-camera';

export default function SettingScreen({ navigation, route }) {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  }, []);

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <View style={{ width: windowWidth, height: windowHeight }}>
          <View style={styles.topContainer}>
            <View
              style={{
                width: '100%',
                height: 320,
                backgroundColor: '#09B44C',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View>
                <Ionicons
                  name="person-circle-outline"
                  size={200}
                  color="white"
                />
                <Text
                  style={{ textAlign: 'center', color: 'white', fontSize: 24 }}
                >
                  nhathung2207
                </Text>
              </View>
            </View>
            {/* <Ionicons
              style={{ position: 'absolute', top: 30, left: 20 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="white"
              onPress={() => navigation.goBack()}
            /> */}
          </View>
          <View
            style={{
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <Pressable
              style={styles.button}
              onPress={() => alert('Personal button')}
            >
              <Fontisto
                style={{ flex: 1 }}
                name="person"
                size={24}
                color="black"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Personal Information
              </Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => alert('Personal button')}
            >
              <Entypo style={{ flex: 1 }} name="lock" size={24} color="black" />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Change password
              </Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => alert('Personal button')}
            >
              <FontAwesome
                style={{ flex: 1 }}
                name="history"
                size={24}
                color="black"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Detection history
              </Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => alert('Personal button')}
            >
              <MaterialIcons
                style={{ flex: 1 }}
                name="favorite"
                size={24}
                color="black"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Favourite fruits
              </Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => alert('Personal button')}
            >
              <Entypo
                style={{ flex: 1 }}
                name="log-out"
                size={24}
                color="black"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>Log out</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // paddingTop: StatusBar.currentHeight,
  },
  scrollContainer: {
    alignItems: 'center',
    // padding: 16,
  },
  topContainer: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  //
  button: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    borderColor: '#09B44C',
    borderWidth: 1,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  // camera
});
