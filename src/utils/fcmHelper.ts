import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


/**
 * Fetches and stores the FCM token with a UUID.
 */
export const getFcmToken = async (): Promise<string | null> => {

  console.log('[getFcmToken] Function called');

  if (!messaging) {
    console.error('Firebase Messaging module is not available.');
    return null;
  }

  let token: string | null = null;
  await checkApplicationNotificationPermission();
  await registerAppWithFCM();
  try {
    token = await messaging().getToken();
    console.log('getFcmToken -->', token);
    if (token) {
      await storeFcmToken(token);
    }
    
  } catch (error) {
    console.error('getFcmToken Device Token error:', error);
  }
  return token;
};

/**
 * Registers the app with Firebase Cloud Messaging (FCM)
 */
export async function registerAppWithFCM(): Promise<void> {
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages
  );

  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      console.log('Device successfully registered for remote messages');
    } catch (error) {
      console.error('registerDeviceForRemoteMessages error:', error);
    }
  }
}

/**
 * Unregisters the app from Firebase Cloud Messaging
 */
export async function unRegisterAppWithFCM(): Promise<void> {
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages
  );

  if (messaging().isDeviceRegisteredForRemoteMessages) {
    try {
      await messaging().unregisterDeviceForRemoteMessages();
      console.log('Device successfully unregistered from remote messages');
    } catch (error) {
      console.error('unregisterDeviceForRemoteMessages error:', error);
    }
  }

  await deleteFcmToken();
}

/**
 * Requests notification permissions on iOS
 */
export const checkApplicationNotificationPermission = async (): Promise<void> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted:', authStatus);
  } else {
    console.warn('Notification permission denied');
  }
};

/**
 * Listens for incoming Firebase notifications while app is in foreground
 */
export function registerListenerWithFCM(): () => void {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('onMessage Received:', JSON.stringify(remoteMessage));

    if (remoteMessage?.notification?.title && remoteMessage?.notification?.body) {
      await onDisplayNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        remoteMessage.data || {}
      );
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification:', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification:', detail.notification);
        break;
    }
  });

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('onNotificationOpenedApp:', JSON.stringify(remoteMessage));
    await notifee.setBadgeCount(0);
  });

  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from background state by notification:', remoteMessage.notification);
        await notifee.setBadgeCount(0);
      }
    });

  return unsubscribe;
}

/**
 * Displays a local notification
 * @param title Notification title
 * @param body Notification body
 * @param data Additional data (optional)
 */


async function onDisplayNotification(title: string, body: string, data: object): Promise<void> {
  console.log('Displaying Notification:', JSON.stringify(data));

  // Request permissions (iOS required)
  await notifee.requestPermission();

  // Display the notification
  await notifee.displayNotification({
    title,
    body,
    data : { ...data },
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
}

/**
 * Stores FCM token with UUID in AsyncStorage.
 */
const storeFcmToken = async (token: string): Promise<void> => {
  try {
    let uuid = await AsyncStorage.getItem('deviceUUID');

    if (!uuid) {
      uuid = uuidv4();
      await AsyncStorage.setItem('deviceUUID', uuid);
    }

    await AsyncStorage.setItem('fcmToken', token);
    console.log(`Stored FCM Token: ${token} with UUID: ${uuid}`);

    // Send the token and UUID to your backend
    sendTokenToServer(uuid, token);
  } catch (error) {
    console.error('Error storing FCM token:', error);
  }
};

/**
 * Deletes the FCM token from AsyncStorage and unregisters it from Firebase.
 */
const deleteFcmToken = async (): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('fcmToken');
    const uuid = await AsyncStorage.getItem('deviceUUID');

    if (token) {
      await messaging().deleteToken();
      await AsyncStorage.removeItem('fcmToken');
      console.log('Deleted FCM Token:', token);
    }

    if (uuid) {
      await AsyncStorage.removeItem('deviceUUID');
      console.log('Deleted UUID:', uuid);
    }
  } catch (error) {
    console.error('Error deleting FCM token:', error);
  }
};

/**
 * Sends FCM token and UUID to the backend
 */
const sendTokenToServer = async (uuid: string, token: string): Promise<void> => {
  try {
    const response = await axios.post(
      'https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/post-fcm-tokens',
      { uuid, fcmToken: token }
    );

    if (response.status === 201 || response.status === 200) {
      console.log('FCM Token successfully sent to the backend:', response.data);
    } else {
      console.warn('Unexpected response from server:', response.status);
    }
  } catch (error) {
    console.error('Error sending FCM token to backend:', error);
  }
};