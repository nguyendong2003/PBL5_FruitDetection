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
} from 'react-native';

import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
} from '@expo/vector-icons';

import { useState, useEffect } from 'react';

import { useAuth } from './AuthContext';


import { getFirestore, collection, getDocs, where, getDoc, onSnapshot, query } from "firebase/firestore";

import { app } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const db = getFirestore(app)
  const [fruits, setFruits ] = useState([])
  useEffect(() => {
    getFruits()
    getFavoriteIds()
  }, [])
  //
  const { currentUser } = useAuth();
  //
  const [search, setSearch] = useState('');
  const [filteredFruitList, setFilteredFruitList] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([])

  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  const getFavoriteIds = async() => {
    const q = query(collection(db, "users", currentUser.id, "favorite-fruits"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setFavoriteIds([])
      
      querySnapshot.forEach((doc) => {
        setFavoriteIds(favoriteIds => [...favoriteIds, doc.data().id_fruit])
      });
    });
  }

  const getFruits = async() => {
    setFruits([])
    const querySnapshot = await getDocs(collection(db, "fruits"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setFruits(fruits => [...fruits, doc.data()])
    });
    // console.log(fruits)
  }


  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  useEffect(() => {
    // console.log(favoriteIds)
    const updatedFruitList = fruits.map((fruit) => ({
      ...fruit,
      favourite: favoriteIds.includes(fruit.id_fruit),
    }));
    // console.log(updatedFruitList)
    // Filter the fruit list based on the search text
    const filteredList = updatedFruitList.filter((fruit) =>
      fruit?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFruitList(filteredList);
  }, [search, fruits, favoriteIds]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset state when screen gets focused again
      setSearch('');
    });

    return unsubscribe;
  }, [navigation]);

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <View style={styles.scrollContainer}>
          <View style={styles.topContainer}>
            <View>
              <Text style={{ fontSize: 20 }}>
                Welcome
                <Image
                  source={require('../assets/hand3.png')}
                  style={{ width: 20, height: 20 }}
                />
              </Text>
              <Text
                style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
              >
                {/* nhathung2207 */}
                {currentUser?.fullname}
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.navigate('PersonalInformation')}
            >
              {/* <MaterialCommunityIcons
                name={'account-circle-outline'}
                size={40}
              /> */}
              <Image
                // source={require('../assets/41.jpg')}
                source={{ uri: currentUser?.image }}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 100,
                }}
              />
            </Pressable>
          </View>

          <View style={[styles.searchContainer]}>
            <FontAwesome name="search" size={24} color="black" />
            <TextInput
              style={styles.inputSearch}
              value={search}
              onChangeText={(text) => {
                setSearch(text);
              }}
              placeholder="Search"
            />
          </View>

          <FlatList
            style={{
              marginTop: 16,
              marginBottom: 16,
              alignSelf: 'flex-start',
              minWidth: '100%',
            }}
            data={filteredFruitList}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate('FruitDetail', { fruit: item })
                  }
                >
                  <View style={styles.card} key={item.id_fruit}>
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: (windowWidth - 32 - 80) / 2,
                        height: (windowWidth - 32 - 80) / 2,
                      }}
                      resizeMode='contain'
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign
                        name={item.favourite == true ? 'heart' : 'hearto'}
                        size={20}
                        color={item.favourite == true ? 'red' : '#09B44C'}
                      />
                      <Text style={styles.cardText}>{item.name}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            numColumns={2}
            keyExtractor={(item, index) => item.id_fruit.toString()}
            ItemSeparatorComponent={<View style={{ height: 4 }}></View>}
            ListEmptyComponent={
              <Text
                style={{
                  color: 'red',
                  fontSize: 24,
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                No fruits found
              </Text>
            } // display when empty data
            ListHeaderComponent={<View style={{ height: 4 }}></View>}
            // ListFooterComponent={<View style={{ height: 4 }}></View>}
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
    paddingTop: StatusBar.currentHeight,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    // marginTop: 8,
    marginLeft: 10,
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
