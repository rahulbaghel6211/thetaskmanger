// import { useEffect } from 'react';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
//   let token: string | undefined;

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     await AsyncStorage.setItem('expoPushToken', token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// };

// useEffect(() => {
//   registerForPushNotificationsAsync().catch(console.error);
// }, []);
