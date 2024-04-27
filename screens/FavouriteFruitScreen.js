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

// fruit.json
import fruitList from '../data/fruit.json';
import favouriteFruitList from '../data/favourite_fruit.json';

export default function FavouriteFruitScreen({ navigation }) {
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
    const filteredList = updatedFruitList.filter(
      (fruit) =>
        fruit?.name.toLowerCase().includes(search.toLowerCase()) &&
        fruit.favourite
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
                    navigation.navigate('FavouriteFruitDetail', { fruit: item })
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
});
