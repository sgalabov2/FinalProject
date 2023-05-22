import React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { SearchBar } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import FoodBanner from './FoodBanner';
import { useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Food } from '../interfaces/Food';
import { store } from '../store';
import getAndSetDailyInfo from '../utils/getAndSetDailyInfo';

const FoodSearch = ({ route, navigation }) => {
  const { meal } = route.params;
  const [search, setSearch] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const { email } = store.useState((state) => state.user);
  const { selectedDate } = store.useState(
    (state) => state.dailyInfo
  );
  const data = foods.filter((food) => food.name.includes(search));

  useEffect(() => {
    getFoods();
  }, []);

  async function getFoods() {
    try {
      const queryUserSnapshot = await getDocs(collection(db, 'foods'));
      const result: Food[] = [];
      queryUserSnapshot.forEach((doc) => {
        const data = JSON.parse(JSON.stringify(doc.data()));
        const { name, nutritionValues, calories } = data;
        result.push({
          name,
          nutritionValues,
          calories,
        });
      });
      setFoods(result);
    } catch (error) {
      console.log(error.message);
      setFoods([]);
    }
  }

  const onAddButtonPress = (food: Food) => {
    getAndSetDailyInfo(email, new Date(selectedDate), food, meal);
    navigation.navigate('Dashboard');
  };

  const handlePageClick = () => Keyboard.dismiss();

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePageClick}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons
            name='chevron-left'
            size={responsiveWidth(30)}
            color='white'
            onPress={() => navigation.goBack()}
          />
          <SearchBar
            placeholder='Search Foods'
            onChangeText={updateSearch}
            value={search}
            platform={Platform.OS === 'ios' ? 'ios' : 'android'}
            inputContainerStyle={{
              borderRadius: 40,
              backgroundColor: 'white',
            }}
            containerStyle={{
              backgroundColor: 'transparent',
              height: responsiveHeight(40),
            }}
            cancelButtonProps={{ color: 'white' }}
            searchIcon={{ color: '#54D14D' }}
          />
        </View>
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={styles.resultsContainer}
          keyboardShouldPersistTaps='always'
        >
          {data.map((food) => (
            <FoodBanner
              key={food.name}
              name={food.name}
              nutritionValues={food.nutritionValues}
              calories={food.calories}
              onAddButtonPress={() => onAddButtonPress(food)}
              showButton
            />
          ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#54D14D',
  },
  headerContainer: {
    flexDirection: 'row',
    height: responsiveHeight(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(25),
    marginTop: responsiveHeight(75),
    marginBottom: responsiveHeight(25),
  },
  resultsContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: responsiveWidth(20),
    paddingTop: responsiveHeight(20),
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});

export default FoodSearch;
