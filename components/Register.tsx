import React, { useRef, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyInfo, NotificationSettings, store } from '../store';
import moment from 'moment';

const auth = getAuth();

const Register: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const scrollViewRef = useRef(null);

  const [value, setValue] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
  });

  const handlePageClick = () => Keyboard.dismiss();

  async function signUp() {
    if (
      value.name === '' ||
      value.email === '' ||
      value.password === '' ||
      value.confirmPassword === '' ||
      value.age === ''
    ) {
      setValue({
        ...value,
        error: 'All the fields are mandatory',
      });
    } else if (value.password.length < 6) {
      setValue({
        ...value,
        error: 'Password needs to be at least 6 characters',
      });
    } else if (value.password !== value.confirmPassword) {
      setValue({
        ...value,
        error: 'Passwords need to match',
      });
    } else {
      try {
        await createUserWithEmailAndPassword(auth, value.email, value.password);

        const user = {
          fullName: value.name,
          email: value.email,
          age: +value.age,
          nutritionGoals: {
            protein: 230,
            carbs: 97,
            fats: 72,
          },
          rewardPoints: 0
        };
        const dailyInfo: DailyInfo = {
          selectedDate: new Date().toISOString(),
          dailyNutrition: {
            protein: 0,
            carbs: 0,
            fats: 0,
          },
        };

        const notificationSettings: NotificationSettings = {
          breakfastNotification: '8:00',
          lunchNotification: '12:00',
          dinnerNotification: '20:00',
        };

        store.update((state) => {
          state.user = user;
          state.notificationSettings = notificationSettings;
        });

        await addDoc(collection(db, 'dailyInfo'), {
          ...dailyInfo,
          userEmail: value.email,
        });
        await addDoc(collection(db, 'notificationSettings'), {
          ...notificationSettings,
          userEmail: user.email,
        });
        await addDoc(collection(db, 'meals'), {
          userEmail: value.email,
          selectedDate: moment().add(4, 'hours').toDate().toISOString(),
          breakfast: [],
          lunch: [],
          dinner: []
        });
        await addDoc(collection(db, 'users'), user);

        navigation.navigate('Login');
      } catch (error) {
        setValue({
          ...value,
          error: error.message,
        });
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePageClick}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.container}
      >
        <View>
          <Input
            placeholder='Name'
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            containerStyle={styles.inputControl}
            value={value.name}
            onChangeText={(text) => setValue({ ...value, name: text })}
          />

          <Input
            placeholder='Age'
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            keyboardType='numeric'
            containerStyle={styles.inputControl}
            value={value.age}
            onChangeText={(text) => setValue({ ...value, age: text })}
          />

          <Input
            placeholder='Email'
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            containerStyle={styles.inputControl}
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text })}
          />

          <Input
            placeholder='Password'
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            containerStyle={styles.inputControl}
            value={value.password}
            onChangeText={(text) => setValue({ ...value, password: text })}
            secureTextEntry={true}
          />

          <Input
            placeholder='Confirm Password'
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            containerStyle={styles.inputControl}
            value={value.confirmPassword}
            onChangeText={(text) =>
              setValue({ ...value, confirmPassword: text })
            }
            secureTextEntry={true}
          />
        </View>
        <View style={styles.actionContainer}>
          {!!value.error && (
            <View style={styles.error}>
              <Text style={styles.buttonText}>{value.error}</Text>
            </View>
          )}

          <Button
            title='SIGN UP'
            titleStyle={styles.buttonText}
            buttonStyle={styles.submitButton}
            onPress={signUp}
          />

          <View style={styles.textContainer}>
            <Text style={{ fontSize: 17 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: responsiveHeight(20),
    paddingBottom: responsiveHeight(100),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputControl: {
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(10),
    width: responsiveWidth(320),
  },

  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(300),
  },

  submitButton: {
    backgroundColor: '#EF7E5D',
    width: responsiveWidth(300),
    height: responsiveHeight(50),
    borderRadius: 20,
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },

  error: {
    margin: responsiveHeight(20),
    padding: responsiveHeight(15),
    color: 'white',
    backgroundColor: 'darkred',
    borderRadius: 20,
    width: responsiveWidth(300),
  },

  textContainer: {
    flexDirection: 'row',
    margin: responsiveHeight(15),
  },
});

export default Register;
