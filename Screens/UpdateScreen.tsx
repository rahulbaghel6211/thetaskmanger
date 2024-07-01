// screens/UpdateTaskScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateTask } from '../context/TaskManger';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

type RootStackParamList = {
  Home: undefined;
  List: undefined;
  UpdateTask: { task: Task };
};

type UpdateTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UpdateTask'>;
type UpdateTaskScreenRouteProp = RouteProp<RootStackParamList, 'UpdateTask'>;

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
};

type Props = {
  route: UpdateTaskScreenRouteProp;
  navigation: UpdateTaskScreenNavigationProp;
};

const UpdateTaskScreen: React.FC<Props> = ({ route, navigation }) => {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority); // Add priority state
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token || '');
      })
      .catch((err) => console.log(err));
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token: string | undefined;

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
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  const pandingNotification = async () => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Task Created',
      body: "Reminder: You have a pending task. Don't forget to complete it soon!",
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
  }

  const sendNotification = async () => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Task Created',
      body: "Well done! Your task is now complete. We appreciate your effort!",
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

  const handleUpdateTask = async () => {
    try {
      await updateTask(task.id, { title, description, dueDate: task.dueDate, status, priority }); // Include priority

      if (status === "completed") {
        await sendNotification();
      } else {
        await pandingNotification();
      }

      Alert.alert('Task updated successfully!');
      navigation.navigate('List');
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Failed to update task. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
       <Text style={styles.header}>Upadte Your Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (MM/DD/YYYY)"
        value={task.dueDate}
        editable={false} // Make due date read-only
      />
      <Text>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
      </View>
      <Text>Priority</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
      </View>
      <Button title="Update Task" onPress={handleUpdateTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  pickerContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default UpdateTaskScreen;
