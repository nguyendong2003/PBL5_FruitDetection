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
  FontAwesome,
  Ionicons,
} from '@expo/vector-icons';

import { useState, useEffect } from 'react';
//
export default function FruitDetailScreen({ navigation, route }) {
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

  //
  const { fruit } = route.params;

  // console.log({ windowWidth, windowHeight });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        behavior="padding"
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { width: windowWidth },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native
        >
          <View style={styles.topContainer}>
            <Image
              source={{
                uri: fruit?.image,
              }}
              style={{ width: windowWidth, height: 300 }}
            />
            <Ionicons
              style={{ position: 'absolute', top: 10, left: 10 }}
              name="chevron-back-circle-sharp"
              size={48}
              color="#09B44C"
              onPress={() => navigation.goBack()}
            />
          </View>

          <View
            style={[
              styles.detailContainer,
              ,
              {
                width: windowWidth,
                minHeight: windowHeight - 300,
              },
            ]}
          >
            <View
              style={{
                padding: 10,
                borderBottomWidth: 2,
                borderColor: '#D7D2D2',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#09B44C',
                  fontSize: 36,
                  fontWeight: '600',
                  textAlign: 'left',
                }}
              >
                {fruit.name}
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#09B44C',
                    fontWeight: '600',
                  }}
                >
                  Origin:
                </Text>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '600',
                    textAlign: 'justify',
                  }}
                >
                  {fruit?.description}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#09B44C',
                    fontWeight: '600',
                  }}
                >
                  Nutrition:
                </Text>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '600',
                    textAlign: 'justify',
                  }}
                >
                  {fruit?.nutrition}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#09B44C',
                    fontWeight: '600',
                  }}
                >
                  Benefit:
                </Text>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '600',
                    textAlign: 'justify',
                  }}
                >
                  {fruit?.benefit}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#09B44C',
                    fontWeight: '600',
                  }}
                >
                  Processing:
                </Text>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '600',
                    textAlign: 'justify',
                  }}
                >
                  {fruit?.processing}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#09B44C',
                    fontWeight: '600',
                  }}
                >
                  Description:
                </Text>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '600',
                    textAlign: 'justify',
                  }}
                >
                  {fruit?.description}
                </Text>
              </View>
            </View>
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
    alignItems: 'center',
    // padding: 16,
  },
  topContainer: {
    width: '100%',
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

  detailContainer: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    // borderRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});