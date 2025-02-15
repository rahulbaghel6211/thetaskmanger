import React, { useState, useEffect } from 'react';
import { Button, Text, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationComponent: React.FC = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Registering for push notifications...');
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log('token: ', token);
        setExpoPushToken(token || '');
      })
      .catch((err) => console.log(err));
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token: string | PromiseLike<string>;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'd56097e6-ec3d-41c2-ba6d-64dfc5d84742',
      })).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  const sendNotification = async () => {
    console.log('Sending push notification...');

    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'My first push notification!',
      body: 'This is my first push notification made with expo rn app',
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        host: 'exp.host',
        accept: 'application/json',
        'accept-encoding': 'gzip, deflate',
        'content-type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <View style={{ marginTop: 100, alignItems: 'center' }}>
      <Text style={{ marginVertical: 30 }}>Expo RN Push Notifications</Text>
      <Button title="Send push notification" onPress={sendNotification} />
    </View>
  );
};

export default NotificationComponent;
