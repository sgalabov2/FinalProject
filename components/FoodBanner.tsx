import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NutritionValues } from '../store';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import { Button } from 'react-native-elements';
import { store } from '../store';

interface FoodBannerProps {
  name: string;
  nutritionValues: NutritionValues;
  calories: number;
  onAddButtonPress: () => void;
  showButton: boolean;
}

const FoodBanner = ({
  name,
  nutritionValues,
  calories,
  onAddButtonPress,
  showButton
}: FoodBannerProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.nameText}>{name}</Text>
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionTypeContainer}>
          <Text style={styles.nutritionTypeText}>Kcal</Text>
          <Text style={styles.nutritionValueText}>{calories}</Text>
        </View>
        <View style={styles.nutritionTypeContainer}>
          <Text style={styles.nutritionTypeText}>Protein</Text>
          <Text style={styles.nutritionValueText}>
            {nutritionValues.protein} g
          </Text>
        </View>
        <View style={styles.nutritionTypeContainer}>
          <Text style={styles.nutritionTypeText}>Carbs</Text>
          <Text style={styles.nutritionValueText}>
            {nutritionValues.carbs} g
          </Text>
        </View>
        <View style={styles.nutritionTypeContainer}>
          <Text style={styles.nutritionTypeText}>Fats</Text>
          <Text style={styles.nutritionValueText}>
            {nutritionValues.fats} g
          </Text>
        </View>
        {showButton && < Button
          title='Add'
          titleStyle={styles.buttonText}
          buttonStyle={styles.addButton}
          onPress={onAddButtonPress}
        />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    height: responsiveHeight(96),
    marginBottom: responsiveHeight(20),
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(5),
    borderRadius: 10,
  },
  nameText: { fontWeight: 'bold', fontSize: 15 },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionTypeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutritionValueText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
  },
  nutritionTypeText: {
    fontWeight: '500',
    fontSize: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#EF7E5D',
    borderRadius: 10,
    width: responsiveWidth(118),
    height: responsiveHeight(36),
  },
});

export default FoodBanner;
