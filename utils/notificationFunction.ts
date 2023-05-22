import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { NotificationSettings, store } from '../store';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const Notification = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return null;
};

export async function schedulePushNotification(
  date: Date,
  message: string,
  email: string
) {
  const notificationsSnapshot = await getDocs(
    collection(db, 'notificationSettings')
  );
  notificationsSnapshot.forEach((snapshot) => {
    const data = JSON.parse(JSON.stringify(snapshot.data()));
    const { userEmail } = data;
    if (userEmail === email) {
      updateDailyInfo(
        snapshot.id,
        `${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        message
      );
    }
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Enter your ${message} meal!`,
      body: `Click to add your ${message} meal.`,
    },
    trigger: {
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function cancelNotification(notifId) {
  await Notifications.cancelScheduledNotificationAsync(notifId);
}

async function updateDailyInfo(id, notificationTime: string, type: string) {
  const notificationRef = doc(db, 'notificationSettings', id);
  switch (type) {
    case 'Breakfast': {
      await updateDoc(notificationRef, {
        breakfastNotification: notificationTime,
      });
      break;
    }
    case 'Lunch': {
      await updateDoc(notificationRef, {
        lunchNotification: notificationTime,
      });
      break;
    }
    case 'Dinner': {
      await updateDoc(notificationRef, {
        dinnerNotification: notificationTime,
      });
      break;
    }
  }
}
