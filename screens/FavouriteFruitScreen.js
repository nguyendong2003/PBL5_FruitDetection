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

import {
  getFirestore,
  collection,
  getDocs,
  where,
  getDoc,
  onSnapshot,
  query,
  deleteDoc
} from 'firebase/firestore';

import { app } from '../firebaseConfig';

export default function FavouriteFruitScreen({ navigation }) {
  const { currentUser } = useAuth();
  const db = getFirestore(app);
  const [fruits, setFruits] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  useEffect(() => {
    getFruits();
    getFavoriteIds();
  }, []);
  const getFavoriteIds = async () => {
    const q = query(collection(db, 'users', currentUser.id, 'favorite-fruits'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setFavoriteIds([]);

      querySnapshot.forEach((doc) => {
        setFavoriteIds((favoriteIds) => [...favoriteIds, doc.data().id_fruit]);
      });
    });
  };

  const getFruits = async () => {
    setFruits([]);
    const querySnapshot = await getDocs(collection(db, 'fruits'));
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setFruits((fruits) => [...fruits, doc.data()]);
    });
    // console.log(fruits)
  };
  const [search, setSearch] = useState('');
  const [filteredFruitList, setFilteredFruitList] = useState([]);

  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  useEffect(() => {
    const updatedFruitList = fruits.map((fruit) => ({
      ...fruit,
      favourite: favoriteIds.includes(fruit.id_fruit),
    }));
    // Filter the fruit list based on the search text
    const filteredList = updatedFruitList.filter(
      (fruit) =>
        fruit?.name.toLowerCase().includes(search.toLowerCase()) &&
        fruit.favourite
    );
    setFilteredFruitList(filteredList);
  }, [search, fruits, favoriteIds]);

  const handleDeleteFruit = async(id_fruit) => {
    deleteFavourite(id_fruit)
  }

  const deleteFavourite = async (id_fruit) => {
    try {
      const q = query(
        collection(db, 'users', currentUser.id, 'favorite-fruits'),
        where('id_fruit', '==', id_fruit)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      // console.log("Document deleted from favorites!");
    } catch (error) {
      console.error('Error deleting document from favorites: ', error);
    }
  };
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
  //     setSearch('');
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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
              maxWidth: '100%',
            }}
            data={filteredFruitList}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate('FavouriteFruitDetail', { fruit: item })
                  }
                >
                  <View style={styles.card} key={item.id_fruit}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign
                        name={item.favourite == true ? 'heart' : 'hearto'}
                        size={30}
                        color={item.favourite == true ? 'red' : '#09B44C'}
                      />
                      <Text style={styles.cardText}>{item.name}</Text>
                      <FontAwesome
                        style={
                          {
                            // backgroundColor: 'green'
                          }
                        }
                        name="trash-o"
                        size={30}
                        color="red"
                        onPress={() => {
                          handleDeleteFruit(item.id_fruit)
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: (windowWidth - 32 - 80 - 40) / 2,
                          height: (windowWidth - 32 - 80 - 40) / 2,
                        }}
                        resizeMode='center'
                      />
                      <View
                        style={{
                          width: (windowWidth - 32 - 80 + 120) / 2,
                          maxWidth: (windowWidth - 32 - 80 + 120) / 2,
                          // backgroundColor: 'red',
                          padding: 8,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                          }}
                        >
                          <Text
                            style={{
                              flex: 1.5,
                              fontSize: 12,
                              color: '#09B44C',
                              fontWeight: 'bold',
                              // backgroundColor: 'blue',
                            }}
                          >
                            Origin:
                          </Text>
                          <Text
                            style={{
                              flex: 3,
                              fontSize: 12,
                              color: 'black',
                              fontWeight: 'bold',
                              // backgroundColor: 'green',
                            }}
                            numberOfLines={2}
                          >
                            {item.origin}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 8,
                          }}
                        >
                          <Text
                            style={{
                              flex: 1.5,
                              fontSize: 12,
                              color: '#09B44C',
                              fontWeight: 'bold',
                              // backgroundColor: 'blue',
                            }}
                          >
                            Nutrition:
                          </Text>
                          <Text
                            style={{
                              flex: 3,
                              fontSize: 12,
                              color: 'black',
                              fontWeight: 'bold',
                              // backgroundColor: 'green',
                            }}
                            numberOfLines={2}
                          >
                            {item.nutrition}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 8,
                          }}
                        >
                          <Text
                            style={{
                              flex: 1.5,
                              fontSize: 12,
                              color: '#09B44C',
                              fontWeight: 'bold',
                              // backgroundColor: 'blue',
                            }}
                          >
                            Benefit:
                          </Text>
                          <Text
                            style={{
                              flex: 3,
                              fontSize: 12,
                              color: 'black',
                              fontWeight: 'bold',
                              // backgroundColor: 'green',
                            }}
                            numberOfLines={3}
                          >
                            {item.benefit}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            // numColumns={2}
            keyExtractor={(item, index) => item.id_fruit.toString()}
            ItemSeparatorComponent={<View style={{ height: 4 }}></View>}
            ListEmptyComponent={
              <Text
                style={{
                  color: 'red',
                  fontSize: 24,
                  flex: 1,
                  width: '100%',
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
    // paddingTop: StatusBar.currentHeight,
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
    color: '#09B44C',
    // marginLeft: 8,
    fontSize: 24,
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
