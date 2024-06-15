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
  ActivityIndicator,
  Modal,
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

import {
  getFirestore,
  collection,
  setDoc,
  deleteDoc,
  where,
  doc,
  query,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { app } from '../firebaseConfig';
// Upload image
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

export default function PersonalInformationScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore(app);
  const { currentUser, setUser } = useAuth();

  const [updatedUser, setUpdatedUser] = useState(currentUser);

  const [fullname, setFullname] = useState(currentUser?.fullname);
  const [email, setEmail] = useState(currentUser?.email);
  const [phone, setPhone] = useState(currentUser?.phone);
  const [address, setAddress] = useState(currentUser?.address);
  const [gender, setGender] = useState(
    currentUser?.gender == undefined ? 'no' : currentUser?.gender
  );

  // pick date
  const [dateofbirth, setDateofbirth] = useState(
    new Date(Date.parse(currentUser?.dateofbirth))
  );

  // console.log(dateofbirth)
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDateOfBirth = (event, selectedDate) => {
    setShowDatePicker(false); // Ẩn DateTimePicker sau khi chọn hoặc hủy bỏ
    if (event.type === 'set' && selectedDate) {
      // Nếu người dùng chọn ngày và nhấn OK
      setDateofbirth(selectedDate);
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
  const [pickerImage, setPickerImage] = useState(currentUser?.image);
  // console.log(image)
  const pickImage = async () => {
    // no permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // console.log(result.assets[0].uri);

    if (!result.canceled) {
      setPickerImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
      await uploadMedia(result.assets[0].uri);
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

  const storage = getStorage();
  const uploadMedia = async (pickerImage) => {
    setIsLoading(true);
    if (pickerImage) {
      try {
        const { uri } = await FileSystem.getInfoAsync(pickerImage);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.onerror = (e) => {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });

        const fileName = pickerImage.substring(
          pickerImage.lastIndexOf('/') + 1
        );
        const refStorage = ref(storage, 'users/' + fileName);
        await uploadBytes(refStorage, blob).then((snapshot) => {
          // console.log(snapshot);
        });
        const imageUrl = await getDownloadURL(refStorage);

        // console.log(imageUrl)
        await updateDoc(doc(db, 'users', currentUser.id), {
          image: imageUrl,
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    // setGenderOfUpdatedUser()
    // await uploadMedia();
    // console.log(updatedUser)
    await updateProfile();

    setIsLoading(false);
    alert('Update profile successfully');
    // navigation.navigate('Setting');
  };

  useEffect(() => {
    handleSetUpdatedUser();
  }, [fullname, phone, dateofbirth, gender, address]);

  const handleSetUpdatedUser = () => {
    const newUser = {
      fullname,
      phone,
      dateofbirth: !isNaN(dateofbirth)
        ? dateofbirth.toISOString().split('T')[0]
        : '',
      gender,
      address,
    };

    setUpdatedUser(newUser);
  };

  // const setGenderOfUpdatedUser = () => {
  //   if(Object.keys(updatedUser).includes(gender)) {
  //     updatedUser.gender = gender;
  //   } else {
  //     updatedUser = {...updatedUser, gender};
  //   }
  // }

  const updateProfile = async () => {
    await updateDoc(doc(db, 'users', currentUser.id), updatedUser);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent={true} visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Updating</Text>
          </View>
        </View>
      </Modal>
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
                {pickerImage ? (
                  <Image
                    source={{ uri: pickerImage }}
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

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{ position: 'absolute', top: 190, left: 190 }}
                  onPress={pickImage}
                >
                  <FontAwesome5 name="edit" size={24} color="blue" />
                </TouchableOpacity>

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
                setFullname(text);
                // setFullname((fullname) => {
                //   fullname = text;
                //   // if(Object.keys(updatedUser).includes(fullname)) {
                //   //   updatedUser.fullname = fullname;
                //   // } else {
                //   //   updatedUser = {...updatedUser, fullname}
                //   // }
                //   // console.log(updatedUser)
                // });
              }}
              placeholder="Enter your fullname"
            />

            <Text style={styles.labelForm}>Email address</Text>
            <TextInput
              style={[{ color: '#65737E' }, styles.inputField]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // setEmail((email) => {
                //   email = text;
                //   // if(Object.keys(updatedUser).includes(email)) {
                //   //   updatedUser.email = email;
                //   // } else {
                //   //   updatedUser = {...updatedUser, email}
                //   // }
                // });
              }}
              placeholder="Enter your email address"
              editable={false}
            />

            <Text style={styles.labelForm}>Phone number</Text>
            <TextInput
              style={styles.inputField}
              value={phone}
              keyboardType="numeric"
              onChangeText={(text) => {
                setPhone(text);
                // setPhone((phone) => {
                //   phone = text;
                //   // if(Object.keys(updatedUser).includes(phone)) {
                //   //   updatedUser.phone = phone;
                //   // } else {
                //   //   updatedUser = {...updatedUser, phone}
                //   // }
                // });
              }}
              placeholder="Enter your phone number"
            />

            <Text style={styles.labelForm}>Date of birth</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={toggleDatePicker}>
              <View style={[styles.fieldContainer]}>
                <Text>
                  {!isNaN(dateofbirth.getDate())
                    ? formatNumber(dateofbirth.getDate()) +
                      '/' +
                      formatNumber(dateofbirth.getMonth() + 1) +
                      '/' +
                      dateofbirth.getFullYear()
                    : 'Select your date of birth'}
                </Text>
                <FontAwesome name="calendar" size={24} color="#09B44C" />
                {showDatePicker && (
                  <DateTimePicker
                    value={
                      isNaN(dateofbirth.getDate()) ? new Date() : dateofbirth
                    }
                    mode={'date'}
                    is24Hour={true}
                    full="default"
                    onChange={onChangeDateOfBirth}
                  />
                )}
              </View>
            </TouchableOpacity>

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
                  status={
                    gender === 'no' || gender == null ? 'checked' : 'unchecked'
                  }
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
                setAddress(text);
                // setAddress((address) => {
                //   address = text;
                //   // if(Object.keys(updatedUser).includes(address)) {
                //   //   updatedUser.address = address;
                //   // } else {
                //   //   updatedUser = {...updatedUser, address}
                //   // }
                // });
              }}
              placeholder="Enter your address"
            />

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={() => handleUpdateProfile()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
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
    // color: "red"
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
});
