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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset state when screen gets focused again
      setPhoto(null);
      setImage(null);
      setShowCamera(false); // Assuming you want to hide camera when screen is focused again
    });

    return unsubscribe;
  }, [navigation]);

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
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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
                  width: windowWidth,
                  height: windowHeight,
                  alignItems: 'center',
                },
              ]}
              ref={cameraRef}
              ratio={'1:1'}
            >
              <Pressable
                style={{
                  position: 'absolute',
                  top: windowHeight - 150,
                }}
                onPress={takePicture}
              >
                <Entypo name="camera" size={48} color="white" />
              </Pressable>
              <StatusBar style="auto" />
            </Camera>
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
            { width: windowWidth },
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
              // <Image
              //   source={require('../assets/placeholder_photo.jpg')}
              //   style={{ width: windowWidth, height: windowWidth }}
              //   resizeMode="contain"
              // />
              // <Feather name="image" size={300} color="black" />
              <Ionicons name="image-outline" size={300} color="black" />
            )}
            <Ionicons
              style={{ position: 'absolute', top: 10, left: 10 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="#09B44C"
              onPress={() => navigation.goBack()}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              // backgroundColor: 'red',
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

              <Pressable
                style={{ alignItems: 'center' }}
                onPress={() => openCamera()}
              >
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
  buttonContainer: {
    backgroundColor: '#fff',
    // alignSelf: 'flex-end',
  },
});
