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

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';

import { getFirestore, updateDoc, doc } from "firebase/firestore"; 
import { app } from '../firebaseConfig';
export default function ChangePasswordScreen({ navigation }) {
  const { currentUser } = useAuth();
  const db = getFirestore(app)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [errors, setErrors] = useState({});

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

  // console.log({ windowWidth, windowHeight });

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmNewPassword = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleChangePassword = () => {
    let newErrors = {};

    
    if (!currentPassword) {
      newErrors['currentPassword'] = 'Current password cannot be empty';
    } 

    if(currentPassword && currentPassword !== currentUser.password) {
      console.log(currentUser.password)
      newErrors['currentPasswordNotCorrect'] = 'Current password not correct';
    }

    if (!newPassword) {
      newErrors['newPasswordEmptyError'] = 'New password cannot be empty';
    }

    if (!confirmNewPassword) {
      newErrors['confirmNewPasswordEmptyError'] =
        'Confirm new password cannot be empty';
    }

    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      newErrors['passwordMismatchError'] =
        'New password and Confirm new password do not match';
    }

    // Nếu có lỗi, hiển thị chúng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Nếu không có lỗi, xóa tất cả các lỗi hiện tại
      setErrors({});
      updatePassword();
      alert('Change password successfully');
      // console.log(currentUser.password)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    }
  };

  const updatePassword = async() => {
    await updateDoc(doc(db, "users", currentUser.id), {
      password: newPassword
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <View
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native
        >
          <View style={styles.form}>
            {/* <Text style={styles.textTitle}>Login</Text> */}
            <Text style={styles.labelForm}>Current Password</Text>
            <View style={[styles.passwordContainer]}>
              <TextInput
                style={styles.inputNewPassword}
                value={currentPassword}
                secureTextEntry={!showCurrentPassword}
                //   onChangeText={setUsername}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                  
                  if (errors['currentPassword']) {
                    setErrors({ ...errors, currentPassword: null });
                  }
                  if (errors['currentPasswordNotCorrect']) {
                    setErrors({ ...errors, currentPasswordNotCorrect: null });
                  }
                }}
                placeholder="Enter your current password"
              />
              <MaterialCommunityIcons
                name={showCurrentPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowCurrentPassword}
              />
            </View>

            {errors['currentPassword'] ? (
              <Text style={styles.errorText}>{errors['currentPassword']}</Text>
            ) : null}

            {errors['currentPasswordNotCorrect'] ? (
              <Text style={styles.errorText}>{errors['currentPasswordNotCorrect']}</Text>
            ) : null}

            <Text style={styles.labelForm}>New Password</Text>
            <View style={[styles.passwordContainer]}>
              <TextInput
                style={styles.inputNewPassword}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                  if (errors['newPasswordEmptyError']) {
                    setErrors({ ...errors, newPasswordEmptyError: null });
                  }
                }}
                placeholder="Enter your new password"
              />
              <MaterialCommunityIcons
                name={showNewPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowNewPassword}
              />
            </View>

            {errors['newPasswordEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['newPasswordEmptyError']}
              </Text>
            ) : null}

            <Text style={styles.labelForm}>Confirm new password</Text>
            <View style={[styles.passwordContainer]}>
              <TextInput
                style={styles.inputNewPassword}
                secureTextEntry={!showConfirmNewPassword}
                value={confirmNewPassword}
                onChangeText={(text) => {
                  setConfirmNewPassword(text);
                  // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                  if (errors['confirmNewPasswordEmptyError']) {
                    setErrors({
                      ...errors,
                      confirmNewPasswordEmptyError: null,
                    });
                  }
                  if (errors['passwordMismatchError']) {
                    setErrors({ ...errors, passwordMismatchError: null });
                  }
                }}
                placeholder="Enter your confirm new password"
              />
              <MaterialCommunityIcons
                name={showConfirmNewPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowConfirmNewPassword}
              />
            </View>

            {errors['confirmNewPasswordEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['confirmNewPasswordEmptyError']}
              </Text>
            ) : null}

            {errors['passwordMismatchError'] ? (
              <Text style={styles.errorText}>
                {errors['passwordMismatchError']}
              </Text>
            ) : null}

            <Pressable
              style={styles.button}
              onPress={() => handleChangePassword()}
            >
              <Text style={styles.buttonText}>Save</Text>
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
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

  inputNewPassword: {
    maxWidth: '90%',
  },

  passwordContainer: {
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
});
