import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native'; // Remove Picker import from here
import { createTask } from '../context/TaskManger'; // Ensure the path is correct
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker'; // Use Picker from @react-native-picker/picker

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type RootStackParamList = {
  Home: undefined;
  List: undefined;
  AddTask: undefined;
  Notification: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
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
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  const sendNotification = async () => {
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
  };

  const handleAddTask = async () => {
    if (!title || !description || !dueDate || !selectedTime) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const combinedDateTime = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      await createTask(title, description, combinedDateTime.toISOString(), priority);
      alert('Task added successfully!');
      await sendNotification(); 
      navigation.navigate('List'); 
    } catch (error) {
      alert('Error adding task. Please try again.');
      console.error(error);
    }
  };

  const onChangeDate = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const onChangeTime = (event: Event, selectedTime?: Date) => {
    const currentTime = selectedTime || selectedTime;
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
  };

  const handleTaskList = async () => {
    try {
      navigation.navigate('List'); 
    } catch (error) {
      alert('Error navigating to task list. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 10, padding: 8, alignSelf: 'flex-end', backgroundColor: 'grey', borderRadius: 10 }}>
        <Text style={{ color: 'white', padding: 6, fontWeight: 'bold', fontSize: 16 }} onPress={handleTaskList}>Check your Task List</Text>
      </View>
      <Text style={styles.header}>Create Your Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />
      <View style={{flexDirection:'row',width:'100%'}}>
      <View style={{width:"50%"}}>
        <Text style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          Select Date
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}a
          />
        )}
        <Text style={{alignSelf:'center'}}>{dueDate ? dueDate.toDateString() : 'No date selected'}</Text>
      </View>

      <View style={{width:"50%"}}>
        <Text style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
          Select Time
        </Text>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
        <Text style={{alignSelf:'center'}}>{selectedTime ? selectedTime.toLocaleTimeString() : 'No time selected'}</Text>
      </View>
      </View>
      <View>
      <Text style={styles.priorityLabel}>Priority:</Text>
      <View style={styles.priorityContainer}>

        <Picker
          style={styles.picker}
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
      </View>
      </View>
     
      <Text style={styles.button} onPress={handleAddTask}>Add Task</Text>
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
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    marginBottom: 10,
    borderRadius:5
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth:1,
    borderRadius:5,
    borderColor:'#d3d3d3'
  },
  priorityLabel: {
   //marginRight: 10,
    fontSize: 16,
   // fontWeight: 'bold',
   marginLeft:10,
   marginTop:8

  },
  picker: {
    flex: 1,
    height: 50,
  },
  button:{
    marginTop:20,
    backgroundColor:'#0489d1',
    alignSelf:'center',
    padding:10,
    width:"100%",
    color:'white',
    fontWeight:'bold',
    fontSize:18,
    borderRadius:8,
    textAlign:'center'

  }
});

export default HomeScreen;
