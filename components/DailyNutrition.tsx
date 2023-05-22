import React from 'react';
import { View, StyleSheet } from 'react-native';
import { store } from '../store';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import DailyNutritionValue from './DailyNutritionValue';
import ProgressBar from './ProgressBar';

const DailyNutrition = () => {
  const { nutritionGoals } = store.useState((state) => state.user);
  const { protein, carbs, fats } = store.useState(
    (state) => state.dailyInfo.dailyNutrition
  );

  return (
    <View style={styles.container}>
      <ProgressBar
        protein={protein}
        carbs={carbs}
        fat={fats}
        totalGoal={Object.values(nutritionGoals).reduce(
          (sum, cur) => sum + cur,
          0
        )}
      />
      <View style={styles.nutritionContainer}>
        <DailyNutritionValue
          text={'Carbs'}
          color={'#54D14D'}
          goalValue={nutritionGoals.carbs}
          value={carbs}
        />
        <DailyNutritionValue
          text={'Protein'}
          color={'#EF7E5D'}
          goalValue={nutritionGoals.protein}
          value={protein}
        />
        <DailyNutritionValue
          text={'Fat'}
          color={'#35C2FD'}
          goalValue={nutritionGoals.fats}
          value={fats}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: responsiveHeight(214),
    marginVertical: responsiveHeight(20),
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(20),
    borderRadius: 10,
  },
  nutritionContainer: {
    flex: 1,
    marginTop: responsiveHeight(10),
  },
});

export default DailyNutrition;
