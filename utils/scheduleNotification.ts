import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

// Function to schedule a notification
const scheduleNotification = async (title, body, time) => {
  // Check for permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    // Permission not granted, handle it here
    return;
  }

  // Define notification trigger time
  const trigger = new Date(time);

  // Create notification content
  const notificationContent = {
    title: title,
    body: body,
    data: { data: 'data' },
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    },
  };

  // Schedule notification
  await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger: { date: trigger },
  });
};

export default scheduleNotification;
