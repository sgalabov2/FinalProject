import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { store } from "../store";
import { responsiveWidth, responsiveHeight } from "../utils/dimensionHelpers";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from "react";
import { useState } from "react";
import { Food } from "../interfaces/Food";
import FoodBanner from "./FoodBanner";

const FoodsPage = ({ route, navigation }) => {
  const { meal } = route.params;
  const [foodData, setFoodData] = useState<Food[]>([]);
  const { selectedDate } = store.useState((state) => state.dailyInfo);
  const meals = store.useState((state) => state.meals);

  useEffect(() => {
    switch (meal) {
      case 'Breakfast':
        setFoodData(meals.breakfast);
        break;
      case 'Lunch':
        setFoodData(meals.lunch);
        break;
      case 'Dinner':
        setFoodData(meals.dinner);
        break;
    }
  }, [meal]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContentContainer}>
          <MaterialCommunityIcons
            name='chevron-left'
            size={responsiveWidth(30)}
            color='white'
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>{meal} Foods</Text>
        </View>
      </View>
      <ScrollView style={styles.resultsContainer}>
        {foodData.map((food, index) => (
          <FoodBanner
            key={`${food.name}${index}`}
            name={food.name}
            nutritionValues={food.nutritionValues}
            calories={food.calories}
            onAddButtonPress={() => { }}
            showButton={false}
          />
        ))}
      </ScrollView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    height: responsiveHeight(120),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingBottom: responsiveHeight(20),
    paddingHorizontal: responsiveWidth(25),
    marginBottom: responsiveHeight(25),
    backgroundColor: '#54D14D',
  },
  headerIcon: {
    position: 'absolute',
    right: '100%',
    marginRight: -responsiveWidth(25)
  },
  headerContentContainer: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultsContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: responsiveWidth(20),
  },
})

export default FoodsPage;