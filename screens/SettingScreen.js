import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  ImageBackground,
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

import { useAuth } from './AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebaseConfig';

export default function SettingScreen({ navigation, route }) {
  const auth = getAuth(app);
  const { currentUser, setUser } = useAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
    setUser(null);
    navigation.navigate('Login');
  };
  //
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
              {/* <View>
                <Text
                  style={{ textAlign: 'center', color: 'white', fontSize: 24 }}
                >
                  nhathung2207
                </Text>
              </View> */}
              <View>
                {currentUser?.image ? (
                  <Image
                    // source={require('../assets/41.jpg')}
                    source={{ uri: currentUser?.image }}
                    style={{
                      height: 200,
                      width: 200,
                      margin: 10,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={200}
                    color="white"
                  />
                )}

                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 24,
                  }}
                >
                  {currentUser?.fullname}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={() => navigation.navigate('PersonalInformation')}
            >
              <Fontisto
                style={{ flex: 1 }}
                name="person"
                size={24}
                color="#ffc107"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Personal Information
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Entypo
                style={{ flex: 1 }}
                name="lock"
                size={24}
                color="#198754"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Change password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={() => navigation.navigate('DetectHistory')}
            >
              <FontAwesome
                style={{ flex: 1 }}
                name="history"
                size={24}
                color="#0dcaf0"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Detection history
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={() => navigation.navigate('FavouriteFruit')}
            >
              <MaterialIcons
                style={{ flex: 1 }}
                name="favorite"
                size={24}
                color="red"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>
                Favourite fruits
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={handleLogout}
            >
              <Entypo
                style={{ flex: 1 }}
                name="log-out"
                size={24}
                color="#dc3545"
              />
              <Text style={[styles.buttonText, { flex: 4 }]}>Log out</Text>
            </TouchableOpacity>
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
});
