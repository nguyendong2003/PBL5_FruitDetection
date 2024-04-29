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

// Upload image
import * as ImagePicker from 'expo-image-picker';

export default function PersonalInformationScreen({ navigation }) {
  //
  const { currentUser, setUser } = useAuth();
  //
  const [fullName, setfullName] = useState(currentUser?.fullname);
  const [email, setEmail] = useState(currentUser?.email);
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone);
  const [address, setAddress] = useState(currentUser?.address);
  //
  const [gender, setGender] = useState(currentUser?.gender);
  //
  const [errors, setErrors] = useState({});

  // pick date
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date(Date.parse(currentUser?.dateofbirth))
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDateOfBirth = (event, selectedDate) => {
    setShowDatePicker(false); // Ẩn DateTimePicker sau khi chọn hoặc hủy bỏ
    if (event.type === 'set' && selectedDate) {
      // Nếu người dùng chọn ngày và nhấn OK
      setDateOfBirth(selectedDate); // Cập nhật ngày sinh mới
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
  //

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

  const handleUpdateProfile = () => {
    let newErrors = {};

    if (!fullName) {
      newErrors['fullNameEmptyError'] = 'Full name cannot be empty';
    }

    if (!email) {
      newErrors['emailEmptyError'] = 'Email address cannot be empty';
    }

    if (!phoneNumber) {
      newErrors['phoneNumberEmptyError'] = 'Phone nunber cannot be empty';
    }

    if (!address) {
      newErrors['addressEmptyError'] = 'Address cannot be empty';
    }

    // Nếu có lỗi, hiển thị chúng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Nếu không có lỗi, xóa tất cả các lỗi hiện tại
      setErrors({});
      alert('Update profile successfully');
      navigation.navigate('Setting');
    }
  };

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
            <Text style={styles.labelForm}>Full name</Text>
            <TextInput
              style={styles.inputField}
              value={fullName}
              //   onChangeText={setUsername}
              onChangeText={(text) => {
                setfullName(text);
                // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                if (errors['fullNameEmptyError']) {
                  setErrors({ ...errors, fullNameEmptyError: null });
                }
              }}
              placeholder="Enter your full name"
            />

            {errors['fullNameEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['fullNameEmptyError']}
              </Text>
            ) : null}

            <Text style={styles.labelForm}>Email address</Text>
            <TextInput
              style={styles.inputField}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                if (errors['emailEmptyError']) {
                  setErrors({ ...errors, emailEmptyError: null });
                }
              }}
              placeholder="Enter your email address"
            />

            {errors['emailEmptyError'] ? (
              <Text style={styles.errorText}>{errors['emailEmptyError']}</Text>
            ) : null}

            <Text style={styles.labelForm}>Phone number</Text>
            <TextInput
              style={styles.inputField}
              value={phoneNumber}
              keyboardType="numeric"
              onChangeText={(text) => {
                setPhoneNumber(text);
                // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                if (errors['phoneNumberEmptyError']) {
                  setErrors({
                    ...errors,
                    phoneNumberEmptyError: null,
                  });
                }
              }}
              placeholder="Enter your phone number"
            />

            {errors['phoneNumberEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['phoneNumberEmptyError']}
              </Text>
            ) : null}

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

            {/* {errors['currentPassword'] ? (
              <Text style={styles.errorText}>{errors['currentPassword']}</Text>
            ) : null} */}

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
                  status={gender === 'no' ? 'checked' : 'unchecked'}
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
              //   onChangeText={setUsername}
              onChangeText={(text) => {
                setAddress(text);
                // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                if (errors['addressEmptyError']) {
                  setErrors({ ...errors, addressEmptyError: null });
                }
              }}
              placeholder="Enter your address"
            />

            {errors['addressEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['addressEmptyError']}
              </Text>
            ) : null}

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
