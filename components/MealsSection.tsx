import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';

interface MealsSectionProps {
  onAddButtonPress: (meal: string) => void;
  onShowButtonPress: (meal: string) => void
}

const MealsSection = ({ onAddButtonPress, onShowButtonPress }: MealsSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.mealContainer}>
        <Text style={styles.mealText}>Breakfast</Text>
        <View style={styles.buttonsContainer}>
          <Button
            title='Show Foods'
            titleStyle={styles.buttonText}
            buttonStyle={styles.addButton}
            onPress={() => onShowButtonPress('Breakfast')}
          />
          <Button
            title='Add'
            titleStyle={styles.buttonText}
            buttonStyle={styles.addButton}
            onPress={() => onAddButtonPress('Breakfast')}
          />
        </View>
      </View>
      <View style={styles.mealContainer}>
        <Text style={styles.mealText}>Lunch</Text>
        <View style={styles.buttonsContainer}>
          <Button
            title='Show Foods'
            titleStyle={styles.buttonText}
            buttonStyle={styles.addButton}
            onPress={() => onShowButtonPress('Lunch')}
          />
          <Button
            title='Add'
            titleStyle={styles.buttonText}
            buttonStyle={styles.addButton}
            onPress={() => onAddButtonPress('Lunch')}
          />
        </View>
      </View>
      <View style={styles.mealContainer}>
        <Text style={styles.mealText}>Dinner</Text>
        <View style={styles.buttonsContainer}>
          <Button
            title='Show Foods'
            titleStyle={styles.buttonText}
            buttonStyle={styles.addButton}
            onPress={() => onShowButtonPress('Dinner')}
          />
          <Button
            title='Add'
            titleStyle={styles.buttonText}
            buttonStyle={styles.addButton}
            onPress={() => onAddButtonPress('Dinner')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mealContainer: {
    flex: 1,
    justifyContent: 'space-around',
    height: responsiveHeight(95),
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
  },
  mealText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default MealsSection;
