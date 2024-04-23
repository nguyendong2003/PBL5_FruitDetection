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
} from '@expo/vector-icons';

import { useState, useEffect } from 'react';
// Upload image
import * as ImagePicker from 'expo-image-picker';
// Camera
import { Camera, CameraType } from 'expo-camera';

export default function DetectScreen({ navigation, route }) {
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

  // image
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //Camera
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === 'granted');

    // const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    // console.log(imagePermission.status);

    // setGalleryPermission(imagePermission.status === 'granted');

    // if (
    //   imagePermission.status !== 'granted' &&
    //   cameraPermission.status !== 'granted'
    // ) {
    //   alert('Permission for media access needed.');
    // }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImage(data.uri);
    }
  };
  // const [type, setType] = useState(CameraType.back);
  // const [permission, requestPermission] = Camera.useCameraPermissions();

  // if (!permission) {
  //   // Camera permissions are still loading
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   // Camera permissions are not granted yet
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ textAlign: 'center' }}>
  //         We need your permission to show the camera
  //       </Text>
  //       <Button onPress={requestPermission} title="grant permission" />
  //     </View>
  //   );
  // }

  // function toggleCameraType() {
  //   setType((current) =>
  //     current === CameraType.back ? CameraType.front : CameraType.back
  //   );
  // }
  //
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
          <View style={styles.cameraContainer}>
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.fixedRatio}
              type={type}
              ratio={'1:1'}
            />
          </View>
          <View style={styles.topContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: windowWidth, height: 300 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../assets/placeholder_photo.jpg')}
                style={{ width: windowWidth, height: 300 }}
              />
            )}
            {/* <Image
              source={require('../assets/placeholder_photo.jpg')}
              style={{ width: windowWidth, height: 300 }}
            /> */}
            <Ionicons
              style={{ position: 'absolute', top: -10, left: -10 }}
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

              <Pressable style={{ alignItems: 'center' }} onPress={takePicture}>
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
    padding: 16,
  },
  topContainer: {
    width: '100%',
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
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
