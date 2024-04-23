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

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { useState, useEffect } from 'react';

// fruit.json
import fruitList from '../data/fruit.json';

export default function HomeScreen({ navigation }) {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

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
                nhathung2207
              </Text>
            </View>

            <Pressable onPress={() => alert('Profile clicked')}>
              <MaterialCommunityIcons
                name={'account-circle-outline'}
                size={40}
              />
            </Pressable>
          </View>

          <View style={[styles.searchContainer]}>
            <FontAwesome name="search" size={24} color="black" />
            <TextInput style={styles.inputSearch} placeholder="Search" />
          </View>

          <FlatList
            style={{ marginTop: 16, marginBottom: 16 }}
            data={fruitList}
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
                    <Text style={styles.cardText}>{item.name}</Text>
                  </View>
                </Pressable>
              );
            }}
            numColumns={2}
            keyExtractor={(item, index) => item.id.toString()}
            ItemSeparatorComponent={<View style={{ height: 16 }}></View>}
            ListEmptyComponent={
              <Text
                style={{
                  color: 'red',
                  fontSize: 24,
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                No items found
              </Text>
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
    paddingTop: StatusBar.currentHeight + 16,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
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
