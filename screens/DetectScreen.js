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
import { useAuth } from './AuthContext';

// Upload image
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system"
import {decode, encode} from 'base-64'
// Camera
import { Camera, CameraType} from 'expo-camera/legacy';
import axios from "axios";
import { getFirestore, collection, addDoc, deleteDoc, where, doc ,query, getDocs, updateDoc } from "firebase/firestore"; 
import {getStorage, ref, getDownloadURL, uploadBytes, uploadString } from "firebase/storage";
import { app } from '../firebaseConfig';
// import { CameraType } from 'expo-camera/build/legacy/Camera.types';
export default function DetectScreen({ navigation, route }) {
  const storage = getStorage()
  const db = getFirestore(app)
  const { currentUser, setUser } = useAuth();
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });
  //console.log(CameraType.back)

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

  // console.log({ windowWidth, windowHeight });

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

    // console.log(result);  

    if (!result.canceled) {
      setImage(result);
      setPhoto(null);
    }
  };

  //Camera
  const [photo, setPhoto] = useState(null);
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [type, setType] = useState(CameraType.back);

  // console.log(type)
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  let takePicture = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    // console.log(newPhoto.uri);
    setShowCamera(false);
    setPhoto(newPhoto);
    setImage(null);
  };

  let openCamera = async () => {
    // const cameraPermission = await Camera.requestCameraPermissionsAsync();
    // setHasCameraPermission(cameraPermission.status === 'granted');
    setShowCamera(true);
  };

  const [imageOutput, setImageOutput] = useState(null)
  const handleDetect = () => {
    if(image) {
      detectByImage()
    } 
    if(photo) {
      detectByPhoto()
    }
  }

  const detectByImage = async() => {
    if(image) {
      try {
        const uri = image.assets[0].uri;
        const formData = new FormData()
        formData.append("image", {
          uri: uri,
          type: image.assets[0].mimeType,
          name: "image"
        })
        // console.log("Image: ", formData)
        try {
          fetch("https://cloud-server-detect.onrender.com/detect", {
            method: "POST",
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => res.json())
          .then((data) => {
            if (!Object.prototype.hasOwnProperty.call(data, "failed")) {
              setImageOutput(data.image)
              // console.log((new Date(Date.now())).toLocaleDateString())
              //uploadImageBase64(image.assets[0].mimeType,uri.substring(uri.lastIndexOf('/') + 1), data.image)
              uploadToFirebase(uri, data.image)
            } else {
              alert(data.failed);
            }
          })
          .catch((error) => console.log(error))
        }catch(error) {
          console.log(error)
        }
      } catch(error) {
          console.log(error)
      }
    }
    
  }

  const uploadToFirebase = async(input, output) => {
    const image_input = await uploadImageUri(input)
    const docRef = await addDoc(
      collection(db, 'users', currentUser.id, 'detections'),
      {
        date: (new Date()).toLocaleString(),
        image_input : image_input,
        image_output : output
      }
    );
  }

  const uploadImageUri = async(image) => {
    const {uri} = await FileSystem.getInfoAsync(image);
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.response)
        }
        xhr.onerror = (e) => {
            reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
    })

    const fileName = image.substring(image.lastIndexOf('/') + 1)
    const refStorage = ref(storage, "detection/" + fileName)
    await uploadBytes(refStorage, blob).then((snapshot) => {
        // console.log(snapshot);
    });
    const imageUrl = await getDownloadURL(refStorage);
    return imageUrl
  }

  const detectByPhoto = async() => {
    if(photo) {
      const formData = new FormData()
        formData.append("image", {
          uri: photo.uri,
          type: "image/jpg",
          name: "image"
        })
      try {
        fetch("https://cloud-server-detect.onrender.com/detect", {
            method: "POST",
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => res.json())
          .then((data) => {
            // console.log(data)
            if (!Object.prototype.hasOwnProperty.call(data, "failed")) {
              setImageOutput(data.image)
              uploadToFirebase(photo.uri, data.image)
            } else {
              alert(data.failed);
            }
          })
          .catch((error) => console.log(error))
      } catch (error) {
        console.error(error);
      }
    }
  }

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
          <View style={[styles.topContainer]}>
            {photo ? (
              <Image
                // source={{ uri: image }}
                // source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
                // style={{ width: windowWidth, height: windowWidth }}
                source = {{uri: photo.uri}}
                style={{
                  width: windowWidth,
                  height: windowWidth,
                }}
                resizeMode="contain"
              />
            ) : image ? (
              <Image
                source={{ uri : image.assets[0].uri }}
                // style={{ width: windowWidth, height: windowWidth }}
                style={{ width: windowWidth, height: windowWidth }}
                resizeMode="contain"
              />
            ) : (
              <Ionicons name="image-outline" size={300} color="black" />
            )}
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
              onPress={() => handleDetect()}
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
          <View style = {styles.bottomContainer}>
            <Text 
              style = {{ 
                fontSize: 20, fontWeight: 'bold',
                marginBottom: 15
              }}
            >Result Detection: </Text>
            {imageOutput && (
              <Image
                // source={{ uri: image }}
                source={{ uri: 'data:image/jpg;base64,' + imageOutput }}
                // style={{ width: windowWidth, height: windowWidth }}
                style={{
                  width: windowWidth,
                  height: windowWidth,
                }}
                
                resizeMode="contain"
              />
            )}
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
    backgroundColor: '#09B44C',
    // padding: 44,
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
  bottomContainer: {
    width: "100%",
    alignItems:"center",
    marginTop: 20,
    marginBottom: 20
  }
});
