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
  Keyboard,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, where, doc ,query, getDocs } from "firebase/firestore"; 
import { app } from '../firebaseConfig';
export default function RegisterScreen({ navigation }) {

  const db = getFirestore(app)
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset state when screen gets focused again
      setEmail('');
      setFullname('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setErrors({});
    });

    return unsubscribe;
  }, [navigation]);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = () => {
    let newErrors = {};

    if (!email) {
      newErrors['emailError'] = 'Email cannot be empty';
    }

    // Kiểm tra username
    if (!fullname) {
      newErrors['fullnameError'] = 'Fullname cannot be empty';

    // Kiểm tra mật khẩu
    if (!password) {
      newErrors['passwordEmptyError'] = 'Password cannot be empty';
    }
    if (!confirmPassword) {
      newErrors['confirmPasswordEmptyError'] =
        'Confirm Password cannot be empty';
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors['passwordMismatchError'] =
        'Password and Confirm Password do not match';
    }

    // Nếu có lỗi, hiển thị chúng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Nếu không có lỗi, xóa tất cả các lỗi hiện tại
      setErrors({});
      addUser();
      alert('Register successfully');
      navigation.navigate('Login');
    }
  };

  const addUser = async() => {
    const docRef = await addDoc(collection(db, "users"), {
      email: email,
      fullname: fullname,
      password: password
    });
    
    console.log("Document written with ID: ", docRef.id);
    await updateDoc(doc(db, "users", docRef.id), {
      id: docRef.id
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native
        >
          <Image
            source={require('../assets/image-home-fruit.png')}
            style={styles.imageFruit}
            alt="Anh trai cay"
          />
          <View style={styles.form}>
            <Text style={styles.textTitle}>Create an account</Text>


            <Text style={styles.labelForm}>Email address</Text>
            <TextInput
              style={styles.inputEmail}
              value={email}
              //   onChangeText={setEmail}
              onChangeText={(text) => {
                setEmail(text);
                // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                if (errors['emailError']) {
                  setErrors({ ...errors, emailError: null });
                }
              }}
              placeholder="Enter your email address"
            />
            {errors['emailError'] ? (
              <Text style={styles.errorText}>{errors['emailError']}</Text>
            ) : null}

            <Text style={styles.labelForm}>Full name</Text>
            <TextInput
              style={styles.inputEmail}
              value={fullname}
              //   onChangeText={setEmail}
              onChangeText={(text) => {
                setFullname(text);
                // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                if (errors['fullnameError']) {
                  setErrors({ ...errors, fullnameError: null });
                }
              }}
              placeholder="Enter your full name"
            />
            {errors['fullnameError'] ? (
              <Text style={styles.errorText}>{errors['fullnameError']}</Text>
            ) : null}

            <Text style={styles.labelForm}>Password</Text>
            <View style={[styles.passwordContainer]}>
              <TextInput
                style={styles.inputPassword}
                secureTextEntry={!showPassword}
                value={password}
                // onChangeText={setPassword}
                onChangeText={(text) => {
                  setPassword(text);
                  // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                  if (errors['passwordEmptyError']) {
                    setErrors({ ...errors, passwordEmptyError: null });
                  }
                }}
                placeholder="Enter your password"
              />
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowPassword}
              />
            </View>

            {errors['passwordEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['passwordEmptyError']}
              </Text>
            ) : null}

            <Text style={styles.labelForm}>Confirm password</Text>
            <View style={[styles.passwordContainer]}>
              <TextInput
                style={styles.inputPassword}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                // onChangeText={setConfirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);

                  // Xóa thông báo lỗi khi người dùng thay đổi nội dung
                  if (errors['confirmPasswordEmptyError']) {
                    setErrors({ ...errors, confirmPasswordEmptyError: null });
                  }
                  if (errors['passwordMismatchError']) {
                    setErrors({ ...errors, passwordMismatchError: null });
                  }
                }}
                placeholder="Enter your confirm password"
              />
              <MaterialCommunityIcons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowConfirmPassword}
              />
            </View>

            {errors['confirmPasswordEmptyError'] ? (
              <Text style={styles.errorText}>
                {errors['confirmPasswordEmptyError']}
              </Text>
            ) : null}

            {errors['passwordMismatchError'] ? (
              <Text style={styles.errorText}>
                {errors['passwordMismatchError']}
              </Text>
            ) : null}

            <Pressable
              style={styles.button}
              onPress={() => {
                // Keyboard.dismiss();
                handleRegister();
              }}
            >
              <Text style={styles.buttonText}>Register Now</Text>
            </Pressable>

            <Pressable
              style={{ marginTop: 16 }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.createAccount}>
                Already have any account yet?
              </Text>
              <Text style={styles.createAccount}>Login Now</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight,
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
    marginBottom: 8,
  },
  form: {
    maxWidth: '100%',
    minWidth: '100%',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 4,
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
  inputEmail: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    // marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },

  inputPassword: {
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