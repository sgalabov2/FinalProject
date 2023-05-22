import moment from 'moment';
import React, { useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import { Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native';

interface TimeSelectorProps {
  headerText: string;
  buttonText: string;
  defaultHours: number;
  defaultMinutes: number;
  onTimeChange: (value: Date) => void;
}

const TimeSelector = ({
  headerText,
  buttonText,
  defaultHours,
  defaultMinutes,
  onTimeChange,
}: TimeSelectorProps) => {
  const [time, setTime] = useState(
    moment().hour(defaultHours).minute(defaultMinutes)
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  const parseTime = (date: Date) => {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {(Platform.OS === 'ios' || showTimePicker) && (
        <View style={styles.container}>
          {Platform.OS === 'ios' && (
            <Text style={styles.headerText}>{headerText}:</Text>
          )}
          <DateTimePicker
            value={time.toDate()}
            mode='time'
            is24Hour={true}
            accentColor='white'
            onChange={(event, selectedTime) => {
              setShowTimePicker(Platform.OS === 'ios');
              setTime(moment(selectedTime || time));
              onTimeChange(selectedTime || time.toDate());
            }}
            style={{
              width: 65,
              borderRadius: 50,
              marginLeft: responsiveWidth(20),
            }}
          />
        </View>
      )}
      {Platform.OS !== 'ios' && (
        <View style={styles.androidDataContainer}>
          <View style={styles.androidDataTextContainer}>
            <Text style={styles.headerText}>{headerText}: </Text>
            <Text style={styles.headerText}>{parseTime(time.toDate())}</Text>
          </View>
          <Button
            title={buttonText}
            titleStyle={{ fontSize: 14 }}
            onPress={() => setShowTimePicker(true)}
            buttonStyle={styles.selectTimeButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: responsiveHeight(100),
  },
  androidDataContainer: { flexDirection: 'column' },
  androidDataTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(10),
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  selectTimeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: responsiveWidth(175),
  },
});

export default TimeSelector;
