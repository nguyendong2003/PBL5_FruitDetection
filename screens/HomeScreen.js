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
  Fontisto,
  Entypo,
} from '@expo/vector-icons';

import { useState, useEffect } from 'react';

import { useAuth } from './AuthContext';

// fruit.json
import fruitList from '../data/fruit.json';
import favouriteFruitList from '../data/favourite_fruit.json';

export default function HomeScreen({ navigation }) {
  //
  const { currentUser, setUser } = useAuth();
  //
  const [isAvatarFocus, setIsAvatarFocus] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredFruitList, setFilteredFruitList] = useState(fruitList);
  // const [filteredFruitList, setFilteredFruitList] = useState(fruitList);
  const favouriteIds = favouriteFruitList.map((item) => item.fruit_id);

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
    const updatedFruitList = fruitList.map((fruit) => ({
      ...fruit,
      favourite: favouriteIds.includes(fruit.id),
    }));
    // Filter the fruit list based on the search text
    const filteredList = updatedFruitList.filter((fruit) =>
      fruit?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFruitList(filteredList);
  }, [search]);

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
                {currentUser?.fullName}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Pressable onPress={() => setIsAvatarFocus(!isAvatarFocus)}>
                {currentUser?.image ? (
                  <Image
                    // source={require('../assets/41.jpg')}
                    source={{ uri: currentUser?.image }}
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={'account-circle-outline'}
                    size={60}
                  />
                )}
              </Pressable>

              <View
                style={{
                  position: 'absolute',
                  display: isAvatarFocus ? 'flex' : 'none',
                  top: 60,
                  width: 220,
                  zIndex: 3,

                  backgroundColor: 'white',
                  borderRadius: 10,
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,

                    borderBottomWidth: 2,
                    borderColor: '#e2e3e5',
                  }}
                  onPress={() => navigation.navigate('PersonalInformation')}
                >
                  <Fontisto name="person" size={24} color="#ffc107" />
                  <Text
                    style={{ fontSize: 16, fontWeight: '600', marginLeft: 16 }}
                  >
                    Personal Information
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    borderBottomWidth: 2,
                    borderColor: '#d6d7db',
                  }}
                  onPress={() => {
                    setUser(null);
                    navigation.navigate('Login');
                  }}
                >
                  <Entypo name="log-out" size={24} color="#dc3545" />
                  <Text
                    style={{ fontSize: 16, fontWeight: '600', marginLeft: 16 }}
                  >
                    Logout
                  </Text>
                </Pressable>
              </View>
            </View>
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
                  <View style={styles.card} key={item.id}>
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: (windowWidth - 32 - 80) / 2,
                        height: (windowWidth - 32 - 80) / 2,
                      }}
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
            keyExtractor={(item, index) => item.id.toString()}
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
    marginLeft: 8,
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

  // Dropdown
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
