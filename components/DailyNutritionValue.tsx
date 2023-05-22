import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';

interface DailyNutritionValueProps {
  text: string;
  goalValue: number;
  value: number;
  color: string;
}

const DailyNutritionValue = ({
  text,
  goalValue,
  value,
  color,
}: DailyNutritionValueProps) => {
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: color, width: 8, borderRadius: 10 }} />
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>{text}</Text>
        <View style={styles.valuesContainer}>
          <Text style={styles.valueText}>{`${goalValue} g`}</Text>
          <Text style={styles.valueText}>{`${value} g`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: responsiveHeight(45),
    marginTop: responsiveHeight(10),
    width: responsiveWidth(358),
  },
  dataContainer: {
    marginHorizontal: responsiveWidth(15),
    flex: 1,
    justifyContent: 'space-between',
  },
  dataText: { fontWeight: '500', fontSize: 14 },
  valuesContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  valueText: {
    color: 'rgba(0, 0, 0, 0.4)',
  },
});

export default DailyNutritionValue;
