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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { responsiveHeight, responsiveWidth } from '../utils/dimensionHelpers';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { store } from '../store';
import getAndSetDailyInfo from '../utils/getAndSetDailyInfo';

const auth = getAuth();

const Login: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const scrollViewRef = useRef(null);

  const [value, setValue] = useState({
    email: '',
    password: '',
    error: '',
  });

  const handlePageClick = () => Keyboard.dismiss();

  async function signIn() {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email and password are mandatory',
      });
    } else {
      try {
        const queryUserSnapshot = await getDocs(collection(db, 'users'));
        queryUserSnapshot.forEach((doc) => {
          const data = JSON.parse(JSON.stringify(doc.data()));
          const { email } = data;

          if (email === value.email) {
            store.update((state) => {
              state.user = data;
            });

            getAndSetDailyInfo(email, new Date());
          }
        });

        const notificationsSnapshot = await getDocs(
          collection(db, 'notificationSettings')
        );
        notificationsSnapshot.forEach((doc) => {
          const data = JSON.parse(JSON.stringify(doc.data()));
          const { userEmail } = data;

          if (userEmail === value.email) {
            store.update((state) => {
              state.notificationSettings = {
                breakfastNotification: data.breakfastNotification,
                lunchNotification: data.lunchNotification,
                dinnerNotification: data.dinnerNotification,
              };
            });
          }
        });

        const mealsSnapshot = await getDocs(collection(db, 'meals'));
        mealsSnapshot.forEach((doc) => {
          const data = JSON.parse(JSON.stringify(doc.data()));
          const { userEmail, selectedDate } = data;

          if (
            userEmail === value.email &&
            selectedDate.split('T')[0] ===
            new Date().toISOString().split('T')[0]
          ) {
            store.update((state) => {
              state.meals = {
                breakfast: data.breakfast,
                lunch: data.lunch,
                dinner: data.dinner,
              };
            });
          }
        });

        await signInWithEmailAndPassword(auth, value.email, value.password);
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
            placeholder='Email'
            containerStyle={styles.inputControl}
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text })}
          />

          <Input
            placeholder='Password'
            containerStyle={styles.inputControl}
            placeholderTextColor='rgba(0, 0, 0, 0.4)'
            value={value.password}
            onChangeText={(text) => setValue({ ...value, password: text })}
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
            title='SIGN IN'
            titleStyle={styles.buttonText}
            buttonStyle={styles.submitButton}
            onPress={signIn}
          />

          <View style={styles.textContainer}>
            <Text style={{ fontSize: 17 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Sign Up</Text>
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

export default Login;
