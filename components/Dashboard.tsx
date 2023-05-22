import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import DailyNutrition from './DailyNutrition';
import MealsSection from './MealsSection';
import { store } from '../store';
import getAndSetDailyInfo from '../utils/getAndSetDailyInfo';

const DATE_FORMAT = 'ddd D';

const Dashboard: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [days, setDays] = useState<moment.Moment[]>([]);
  const { email } = store.useState((state) => state.user);

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    const startOfWeek = currentDate.clone().startOf('week').add(4, 'hours');
    const tempDays: moment.Moment[] = [];
    for (let i = 0; i < 7; i++) {
      tempDays.push(startOfWeek.clone().add(i, 'day'));
    }

    setDays(tempDays);
  }, [currentDate]);

  const handlePrevWeek = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setCurrentDate(currentDate.clone().add(1, 'week'));
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;

    if (contentOffset && contentOffset.x < 0) {
      handlePrevWeek();
    } else if (contentOffset && contentOffset.x > 0) {
      handleNextWeek();
    }
  };

  const handleDateChange = (date: moment.Moment) => {
    setSelectedDate(date);
    getAndSetDailyInfo(email, date.toDate());
  };

  const renderDayBox = (date: moment.Moment) => {
    const isToday = selectedDate.isSame(date, 'day');
    const [day, dateNum] = date.format(DATE_FORMAT).split(' ');

    return (
      <TouchableOpacity
        key={date.toString()}
        onPress={() => handleDateChange(date)}
      >
        <View style={[styles.dayBox, isToday && styles.todayBox]}>
          <Text style={isToday ? styles.todayText : styles.currentWeekText}>
            {day.toUpperCase()}
          </Text>
          <Text style={isToday ? styles.todayText : styles.currentWeekDateText}>
            {dateNum}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.weekContainer}>
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollWeekContainer}
            onMomentumScrollBegin={handleScroll}
          >
            {days.map((day) => renderDayBox(day))}
          </ScrollView>
        </View>
        <DailyNutrition />
        <MealsSection
          onAddButtonPress={(mealName) => navigation.navigate('FoodSearch', { meal: mealName })}
          onShowButtonPress={(mealName) => navigation.navigate('FoodsPage', { meal: mealName })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    top: responsiveHeight(114),
    position: 'absolute',
    zIndex: 2,
    marginHorizontal: responsiveWidth(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(163),
    width: '100%',
    backgroundColor: '#54D14D',
    zIndex: 1,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  weekContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: responsiveHeight(98),
  },
  scrollWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBox: {
    flexDirection: 'column',
    height: responsiveHeight(70),
    width: responsiveWidth(46),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: responsiveWidth(5),
    borderRadius: 10,
  },
  todayBox: {
    backgroundColor: '#EF7E5D',
  },
  todayText: {
    color: 'white',
    fontWeight: '500',
    marginTop: responsiveHeight(3),
  },
  currentWeekText: {
    color: 'black',
    fontWeight: '500',
  },
  currentWeekDateText: {
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: responsiveHeight(5),
  },
});

export default Dashboard;
