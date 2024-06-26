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
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { useState, useEffect } from 'react';

// fruit.json
import resultDetectFruit from '../data/result_detect_fruit.json';
import { useAuth } from './AuthContext';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  where,
  doc,
  query,
  getDocs,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { app } from '../firebaseConfig';
export default function DetectHistoryScreen({ navigation }) {
  // const [search, setSearch] = useState('');
  const db = getFirestore(app);
  const { currentUser, setUser } = useAuth();
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  const [listDetection, setListDetection] = useState([]);
  useEffect(() => {
    getListDetection();
  }, []);

  const getListDetection = async () => {
    setListDetection([]);
    const q = query(
      collection(db, 'users', currentUser.id, 'detections'),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setListDetection((listDetection) => [...listDetection, doc.data()]);
    });

    // console.log(listDetection)
  };
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // Reset state when screen gets focused again
  //     setSearch('');
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  // console.log({ windowWidth, windowHeight });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <View style={styles.scrollContainer}>
          <FlatList
            style={{ marginTop: 8, marginBottom: 8 }}
            data={listDetection}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    navigation.navigate('DetectFruitDetail', {
                      fruit: item,
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      padding: 4,
                      color: '#09B44C',
                    }}
                  >
                    {item?.date}
                  </Text>
                  <View
                    style={[
                      styles.card,
                      {
                        width: windowWidth - 32 - 20,
                        height: (windowWidth - 32 - 20) / 2,
                      },
                    ]}
                  >
                    <View>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          marginBottom: 4,
                        }}
                      >
                        Input
                      </Text>
                      <Image
                        source={{ uri: item?.image_input }}
                        // source={require('../assets/banana_400.jpg')}
                        // source={require('../assets/23.jpg')}
                        style={{
                          width: (windowWidth - 32 - 120) / 2,
                          height: (windowWidth - 32 - 120) / 2,

                          // width: '100%',
                          // width: 100,
                          // height: 100,
                        }}
                        resizeMode="contain"
                      />
                    </View>

                    <View>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          marginBottom: 4,
                        }}
                      >
                        Output
                      </Text>
                      <Image
                        source={{
                          uri: 'data:image/jpg;base64,' + item?.image_output,
                        }}
                        // source={require('../assets/banana_400.jpg')}
                        // source={require('../assets/23.jpg')}
                        style={{
                          width: (windowWidth - 32 - 120) / 2,
                          height: (windowWidth - 32 - 120) / 2,

                          // width: 100,
                          // height: 100,
                          // width: '100%',
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            // keyExtractor={(item, index) => item?.id.toString()}
            ItemSeparatorComponent={<View style={{ height: 16 }}></View>}
            ListEmptyComponent={
              <View>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            } // display when empty data
            ListHeaderComponent={<View style={{ height: 4 }}></View>}
            ListFooterComponent={<View style={{ height: 4 }}></View>}
            showsVerticalScrollIndicator={false} // tắt thanh scroll khi cuộn item trong FlatList
            // horizontal         // đổi chiều hiển thị theo phương ngang
          />
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
    padding: 16,
  },
  //
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
