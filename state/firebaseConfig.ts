import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// additional services
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCA-WW2hiME79tWUTyQkyTRTOgP0ncBEHk',
  authDomain: 'wanna-wanna.firebaseapp.com',
  databaseURL: 'https://wanna-wanna.firebaseio.com',
  projectId: 'wanna-wanna',
  storageBucket: 'wanna-wanna.firebasestorage.app',
  messagingSenderId: '591311597406',
  appId: '1:591311597406:web:c985b53a7b8129f7d8e9cf',
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const database = getDatabase(app);
