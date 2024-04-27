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
} from '@expo/vector-icons';

import { useState, useEffect, useRef } from 'react';
// Upload image
import * as ImagePicker from 'expo-image-picker';
// Camera
import { Camera, CameraType } from 'expo-camera';

export default function DetectScreen({ navigation, route }) {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    async function requestCameraPermission() {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    }

    requestCameraPermission();

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // Reset state when screen gets focused again
  //     setPhoto(null);
  //     setImage(null);
  //     setShowCamera(false); // Assuming you want to hide camera when screen is focused again
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  // image
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPhoto(null);
    }
  };

  //Camera
  const [photo, setPhoto] = useState(null);
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [type, setType] = useState(CameraType.back);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  let takePicture = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setShowCamera(false);
    setPhoto(newPhoto);
    setImage(null);
  };

  let openCamera = async () => {
    // const cameraPermission = await Camera.requestCameraPermissionsAsync();
    // setHasCameraPermission(cameraPermission.status === 'granted');
    setShowCamera(true);
  };
  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          behavior="padding"
        >
          <View style={{ width: windowWidth, height: windowHeight }}>
            <Camera
              // ref={(ref) => setCamera(ref)}
              // style={styles.fixedRatio}
              // type={type}
              style={[
                {
                  // width: '100%',
                  // height: '100%',
                  // flex: 1,
                  width: windowWidth,
                  height: windowWidth,
                  // alignItems: 'center',
                  // width: windowWidth,
                  // height: windowHeight,
                },
              ]}
              type={type}
              ref={cameraRef}
              ratio={'1:1'}
            ></Camera>
            <Pressable
              style={{
                position: 'absolute',
                top: windowWidth + 150,
                left: windowWidth / 2 - 24,
              }}
              onPress={takePicture}
            >
              <Entypo name="camera" size={48} color="black" />
            </Pressable>

            <Pressable
              style={{
                position: 'absolute',
                top: windowWidth + 150,
                left: windowWidth / 2 + 80,
              }}
              onPress={toggleCameraType}
            >
              <MaterialIcons
                name="flip-camera-android"
                size={48}
                color="black"
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { width: windowWidth, minHeight: windowHeight },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native
        >
          <View style={styles.topContainer}>
            {photo ? (
              <Image
                // source={{ uri: image }}
                source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
                style={{ width: windowWidth, height: windowWidth }}
                resizeMode="contain"
              />
            ) : image ? (
              <Image
                source={{ uri: image }}
                style={{ width: windowWidth, height: windowWidth }}
                resizeMode="contain"
              />
            ) : (
              <Ionicons name="image-outline" size={300} color="black" />
            )}
            {/* <Ionicons
              style={{ position: 'absolute', top: 10, left: 10 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="#09B44C"
              onPress={() => navigation.goBack()}
            /> */}
          </View>
          <View
            style={{
              marginTop: 20,
              width: windowWidth - 32,
              alignItems: 'center',
            }}
          >
            <Pressable
              style={styles.button}
              onPress={() => alert('Detect button')}
            >
              <Text style={styles.buttonText}>Detect</Text>
            </Pressable>

            <View
              style={{
                marginTop: 30,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <Pressable style={{ alignItems: 'center' }} onPress={pickImage}>
                <Feather name="upload" size={48} color="black" />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Upload image
                </Text>
              </Pressable>

              <Pressable style={{ alignItems: 'center' }} onPress={openCamera}>
                <Feather name="camera" size={48} color="black" />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Take photo
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight,
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
    width: '50%',
    backgroundColor: '#09B44C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // camera
});
