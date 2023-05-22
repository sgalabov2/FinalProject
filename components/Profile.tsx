import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TimeSelector from './TimeSelector';
import { schedulePushNotification } from '../utils/notificationFunction';
import { store } from '../store';

const Profile = () => {
  const { email, fullName, rewardPoints } = store.useState((state) => state.user);
  const { breakfastNotification, lunchNotification, dinnerNotification } =
    store.useState((state) => state.notificationSettings);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userFullNameText}>{fullName}</Text>
        <Text style={{ color: 'white' }}>{email}</Text>
      </View>
      <View style={styles.toolsAndSettingsContainer}>
        <Text style={styles.headerText}>Tools and settings</Text>
        <View style={styles.editDetailsContainer}>
          <View style={styles.editDetailsIcon}>
            <MaterialCommunityIcons
              name='account-outline'
              size={responsiveWidth(25)}
              color='white'
            />
          </View>
          <View style={styles.editDetailsTextContainer}>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              Edit your details
            </Text>
            <Text
              style={{
                color: 'rgba(0, 0, 0, 0.4)',
                marginTop: responsiveHeight(5),
              }}
            >
              Edit your personal details like name, email or password
            </Text>
          </View>
        </View>
        <View>
          <TimeSelector
            headerText='Breakfast Time'
            buttonText='Select Breakfast Time'
            defaultHours={+breakfastNotification.split(':')[0]}
            defaultMinutes={+breakfastNotification.split(':')[1]}
            onTimeChange={async (date) =>
              await schedulePushNotification(date, 'Breakfast', email)
            }
          />
          <TimeSelector
            headerText='Lunch Time'
            buttonText='Select Lunch Time'
            defaultHours={+lunchNotification.split(':')[0]}
            defaultMinutes={+lunchNotification.split(':')[1]}
            onTimeChange={async (date) =>
              await schedulePushNotification(date, 'Lunch', email)
            }
          />
          <TimeSelector
            headerText='Dinner Time'
            buttonText='Select Dinner Time'
            defaultHours={+dinnerNotification.split(':')[0]}
            defaultMinutes={+dinnerNotification.split(':')[1]}
            onTimeChange={async (date) =>
              await schedulePushNotification(date, 'Dinner', email)
            }
          />
        </View>
      </View>
      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsText}>{rewardPoints}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: responsiveHeight(120),
    marginBottom: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(63),
    width: responsiveWidth(335),
    backgroundColor: '#EF7E5D',
    borderRadius: 20,
  },
  userFullNameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  toolsAndSettingsContainer: {
    flex: 1,
    width: responsiveWidth(363),
    marginVertical: responsiveHeight(25),
    backgroundColor: '#EF7E5D',
    borderRadius: 20,
    padding: responsiveWidth(15),
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: responsiveHeight(10),
  },
  editDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: responsiveWidth(330),
    height: responsiveHeight(93),
    borderRadius: 20,
    padding: responsiveWidth(10),
  },
  editDetailsIcon: {
    backgroundColor: '#EF7E5D',
    width: responsiveWidth(64),
    height: responsiveHeight(44),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editDetailsTextContainer: {
    width: responsiveWidth(226),
    marginLeft: responsiveWidth(10),
  },
  rewardsContainer: {
    height: responsiveHeight(50),
    backgroundColor: '#EF7E5D',
    width: responsiveWidth(335),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardsText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default Profile;
