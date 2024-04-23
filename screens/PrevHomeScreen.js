import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import { useEffect } from 'react';

export default function PrevHomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.imageApp}
        source={require('../assets/image-home-fruit.png')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageApp: {
    width: 400,
    height: 400,
  },
});
