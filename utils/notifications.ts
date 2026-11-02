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
import { user$ as _user$ } from '@/state/state';
import { queueOperation } from '@/state/actions-queue';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Asks for the permission if needed and returns the Expo push token
 *
 * @returns {string | null}  token, or null when not allowed or not possible
 */
async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    _user$.notificationStatus.set('not-supported');
    return null;
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status === 'undetermined') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  _user$.notificationStatus.set(status);
  if (status !== 'granted') {
    return null;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    console.error('Push notifications: EAS project id not found');
    return null;
  }

  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}

/**
 * Registers the device for push notifications and sends the token to the server.
 * Call it when notifications start to make sense — the user has a shared list —
 * so the permission prompt comes with a reason.
 *
 * @returns {void}
 */
export async function registerForPushNotifications() {
  try {
    const token = await getExpoPushToken();
    if (token && token !== _user$.expo_push_token?.get()) {
      _user$.expo_push_token.set(token);
      queueOperation('user:update', { expo_push_token: token });
    }
  } catch (error) {
    console.error('Error getting the push token:', error);
  }
}
