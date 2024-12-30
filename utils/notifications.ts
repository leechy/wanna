/**
 * This file contains the code to register the device for push notifications.
 * It uses the Expo Notifications API to get the push token.
 *
 * From the Expo documentation:
 * https://docs.expo.dev/push-notifications/push-notifications-setup/
 */

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { user$ } from '@/state/user';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync(): Promise<
  [string, string] | void
> {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
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
      handleRegistrationError(
        'Permission not granted to get push token for push notification!'
      );
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const expoPushToken = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      const devicePushToken = (await Notifications.getDevicePushTokenAsync())
        .data;
      return [expoPushToken, devicePushToken];
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    user$.notificationStatus.set('not-supported');
    handleRegistrationError('Must use physical device for push notifications');
  }
}

/**
 * Register the device for push notifications
 * Call this function when the user logs in and have some shared list
 * or when the user changes the settings for push notifications
 *
 * @returns {void}
 */
export async function registerForPushNotifications() {
  const currentStatus = await checkPushNotificationsStatus();
  const stateStatus = user$.notificationStatus.get();

  if (currentStatus === 'undetermined' && stateStatus === 'undetermined') {
    registerForPushNotificationsAsync()
      .then((tokens) => {
        if (tokens) {
          const [expoPushToken, devicePushToken] = tokens;
          user$.expoPushToken.set(expoPushToken);
          user$.devicePushToken.set(devicePushToken);
          user$.notificationStatus.set('granted');
        }
      })
      .catch((error: any) =>
        console.error(`Error getting notifications push tokens: ${error}`)
      );
  } else {
    const deviceToken = user$.devicePushToken.get();
    if (!deviceToken || deviceToken === '') {
      Notifications.getDevicePushTokenAsync().then((token) => {
        if (token) {
          user$.devicePushToken.set(token.data);
        }
      });
    }
    const expoToken = user$.expoPushToken.get();
    if (!expoToken || expoToken === '') {
      Notifications.getExpoPushTokenAsync().then((token) => {
        if (token) {
          user$.expoPushToken.set(token.data);
          user$.notificationStatus.set('granted');
        }
      });
    }
    console.log(
      'Push notifications already registered',
      currentStatus,
      stateStatus,
      user$.devicePushToken.get(),
      user$.expoPushToken.get()
    );
  }
}

/**
 * Check is the device is already registered for push notifications
 */
export async function checkPushNotificationsStatus() {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}
