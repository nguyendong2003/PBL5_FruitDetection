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
} from 'react-native';

import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
} from '@expo/vector-icons';

import { useState, useEffect } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';

import { useAuth } from './AuthContext';

import { getFirestore, collection, setDoc, deleteDoc, where, doc ,query, getDocs } from "firebase/firestore"; 
import {getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { app } from '../firebaseConfig';
// Upload image
import * as FileSystem from "expo-file-system"
import * as ImagePicker from 'expo-image-picker';

export default function PersonalInformationScreen({ navigation }) {
  const db = getFirestore(app)
  const { currentUser, setUser } = useAuth();
  let updatedUser = currentUser
  // const {updatedUser, setUpdatedUser} = useState({})
  //
  const [fullname, setFullname] = useState(currentUser?.fullname);
  const [email, setEmail] = useState(currentUser?.email);
  const [phone, setPhone] = useState(currentUser?.phone);
  const [address, setAddress] = useState(currentUser?.address);
  const [gender, setGender] = useState(currentUser?.gender);

  // pick date
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date(Date.parse(currentUser?.dateofbirth))
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDateOfBirth = (event, selectedDate) => {
    setShowDatePicker(false); // Ẩn DateTimePicker sau khi chọn hoặc hủy bỏ
    if (event.type === 'set' && selectedDate) {
      // console.log(selectedDate.toISOString().split("T")[0])
      // Nếu người dùng chọn ngày và nhấn OK
      setDateOfBirth(selectedDate); 
      if(Object.keys(updatedUser).includes("dateofbirth")) {
        updatedUser.dateofbirth = selectedDate.toISOString().split("T")[0];
      } else {
        updatedUser = {...updatedUser, dateofbirth: selectedDate.toISOString().split("T")[0]};
      }
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatNumber = (number) => {
    return number < 10 ? '0' + number : number;
  };

  // image
  const [image, setImage] = useState(currentUser?.image);

  const pickImage = async () => {
    // no permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };



  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });
  
  // Hidden bottom navigation when navigate to this screen
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // Reset state when screen gets focused again
  //     setCurrentPassword('');
  //     setNewPassword('');
  //     setConfirmNewPassword('');
  //     setShowCurrentPassword(false);
  //     setShowNewPassword(false);
  //     setShowConfirmNewPassword(false);
  //     setErrors({});
  //   });

  //   return unsubscribe;
  // }, [navigation]);


  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  const storage = getStorage()
  const [upLoading, setUpLoading] = useState(false)
  const uploadMedia = async() => {
    if(image) {
      setUpLoading(true)
      try {
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
        const refStorage = ref(storage, "users/" + fileName)
        await uploadBytes(refStorage, blob).then((snapshot) => {
            // console.log(snapshot);
        });

        await getDownloadURL(refStorage)
        .then((image) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
            };
            xhr.open('GET', image);
            xhr.send();
            // console.log(image)
            if(Object.keys(updatedUser).includes(image)) {
              updatedUser.image = image;
            } else {
              updatedUser = {...updatedUser, image};
            }
            // console.log(updatedUser)
        })
        .catch((error) => {
            // Handle any errors
        });
        setUpLoading(false);
    } catch(error) {
        console.log(error)
        setUpLoading(false)
    }
    }
  }
 

  const handleUpdateProfile = async() => {
    await setGenderOfUpdatedUser()
    await uploadMedia()
    // console.log(updatedUser)
    await updateProfile()
    alert('Update profile successfully');
    // navigation.navigate('Setting');
  };

  const setGenderOfUpdatedUser = async() => {
    if(Object.keys(updatedUser).includes(gender)) {
      updatedUser.gender = gender;
    } else {
      updatedUser = {...updatedUser, gender};
    }
  }

  const updateProfile = async () => {
    await setDoc(doc(db, "users", currentUser.id), updatedUser);
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
      >
        <ScrollView
          // automaticallyAdjustsScrollIndicatorInsets={true}
          contentContainerStyle={[
            styles.scrollContainer,
            // { width: windowWidth },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native
        >
          <View style={styles.topContainer}>
            <View
              style={{
                width: '100%',
                height: 320,
                // backgroundColor: '#09B44C',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View>
                {image ? (
                  <Image
                    source={{ uri: image }}
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
                    color="#09B44C"
                  />
                )}

                <Pressable
                  style={{ position: 'absolute', top: 190, left: 190 }}
                  onPress={pickImage}
                >
                  <FontAwesome5 name="edit" size={24} color="blue" />
                </Pressable>

                {/* <Text
                  style={{
                    textAlign: 'center',
                    color: '#09B44C',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}
                >
                  {currentUser.fullName}
                </Text> */}
              </View>
            </View>
          </View>
          <View style={styles.form}>
            <Text style={styles.labelForm}>Fullname</Text>
            <TextInput
              style={styles.inputField}
              value={fullname}
              //   onChangeText={setUsername}
              onChangeText={(text) => {
                setFullname((fullname) => {
                  fullname = text;
                  if(Object.keys(updatedUser).includes(fullname)) {
                    updatedUser.fullname = fullname;
                  } else {
                    updatedUser = {...updatedUser, fullname}
                  }
                });
              }}
              placeholder="Enter your fullname"
            />

            <Text style={styles.labelForm}>Email address</Text>
            <TextInput
              style={styles.inputField}
              value={email}
              onChangeText={(text) => {
                setEmail((email) => {
                  email = text;
                  if(Object.keys(updatedUser).includes(email)) {
                    updatedUser.email = email;
                  } else {
                    updatedUser = {...updatedUser, email}
                  }
                });
              }}
              placeholder="Enter your email address"
            />

            <Text style={styles.labelForm}>Phone number</Text>
            <TextInput
              style={styles.inputField}
              value={phone}
              keyboardType="numeric"
              onChangeText={(text) => {
                setPhone((phone) => {
                  phone = text;
                  if(Object.keys(updatedUser).includes(phone)) {
                    updatedUser.phone = phone;
                  } else {
                    updatedUser = {...updatedUser, phone}
                  }
                });
              }}
              placeholder="Enter your phone number"
            />

            <Text style={styles.labelForm}>Date of birth</Text>
            <Pressable onPress={toggleDatePicker}>
              <View style={[styles.fieldContainer]}>
                <Text>
                  {dateOfBirth
                    ? formatNumber(dateOfBirth.getDate()) +
                      '/' +
                      formatNumber(dateOfBirth.getMonth() + 1) +
                      '/' +
                      dateOfBirth.getFullYear()
                    : 'Select your date of birth'}
                </Text>
                <FontAwesome name="calendar" size={24} color="#09B44C" />
                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth || new Date()}
                    mode={'date'}
                    is24Hour={true}
                    full="default"
                    onChange={onChangeDateOfBirth}
                  />
                )}
              </View>
            </Pressable>

            <Text style={styles.labelForm}>Gender</Text>
            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton
                  value="male"
                  status={gender === 'male' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('male')}
                  color="#007BFF"
                />
                <Text style={styles.radioLabel}>Male</Text>
              </View>

              <View style={styles.radioButton}>
                <RadioButton
                  value="female"
                  status={gender === 'female' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('female')}
                  color="#007BFF"
                />
                <Text style={styles.radioLabel}>Female</Text>
              </View>

              <View style={styles.radioButton}>
                <RadioButton
                  value="no"
                  status={(gender === 'no' || gender == null) ? 'checked' : 'unchecked'}
                  onPress={() => setGender('no')}
                  color="#007BFF"
                />
                <Text style={styles.radioLabel}>No</Text>
              </View>
            </View>

            <Text style={styles.labelForm}>Address</Text>
            <TextInput
              style={styles.inputField}
              value={address}
              onChangeText={(text) => {
                setAddress((address) => {
                  address = text;
                  if(Object.keys(updatedUser).includes(address)) {
                    updatedUser.address = address;
                  } else {
                    updatedUser = {...updatedUser, address}
                  }
                });
              }}
              placeholder="Enter your address"
            />

            <Pressable
              style={styles.button}
              onPress={() => handleUpdateProfile()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topContainer: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  imageFruit: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    // alignSelf: 'center',
    backgroundColor: 'white',
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    maxWidth: '100%',
    minWidth: '100%',
    backgroundColor: 'white',
    padding: 20,
    // borderRadius: 10,
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  labelForm: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    marginTop: 15,
  },
  inputCurrentPassword: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    // marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },

  inputField: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    // marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },

  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    // marginBottom: 15,
    // padding: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'green',
    fontWeight: 'bold',
    padding: 10,
    marginBottom: 10,
  },
  createAccount: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
  btnSignIn: {
    borderRadius: 20,
  },

  button: {
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
  errorText: {
    marginTop: 8,
    color: 'red',
  },
  // radio button
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginTop: 20,
    // borderRadius: 8,
    backgroundColor: 'white',
    // padding: 16,
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    // marginLeft: 4,
    fontSize: 16,
    color: '#333',
  },
});
