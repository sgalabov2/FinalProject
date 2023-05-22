import React from 'react';
import { View, Text } from 'react-native';
import { responsiveHeight } from '../utils/dimensionHelpers';

interface ProgressBarProps {
  protein: number;
  carbs: number;
  fat: number;
  totalGoal: number;
}

const ProgressBar = ({ protein, carbs, fat, totalGoal }: ProgressBarProps) => {
  const fatWidth = Math.round((fat / totalGoal) * 100);
  const proteinWidth = Math.round((protein / totalGoal) * 100);
  const carbsWidth = Math.round((carbs / totalGoal) * 100);
  const leftWidth = Math.round(
    ((totalGoal - (fat + protein + carbs)) / totalGoal) * 100
  );

  const optionalLeftBorder = leftWidth === 100 ? {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  } : null;

  const optionalRightBorder = leftWidth <= 0 ? {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  } : null;

  return (
    <View
      style={{
        flexDirection: 'row',
        height: responsiveHeight(12),
      }}
    >
      <View
        style={{
          backgroundColor: '#35C2FD',
          flex: fatWidth,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      />
      <View style={{ backgroundColor: '#EF7E5D', flex: proteinWidth }} />
      <View style={{ backgroundColor: '#54D14D', flex: carbsWidth, ...optionalRightBorder }} />
      <View
        style={{
          backgroundColor: '#F9F9F9',
          flex: leftWidth,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          ...optionalLeftBorder
        }}
      />
    </View>
  );
};

export default ProgressBar;
