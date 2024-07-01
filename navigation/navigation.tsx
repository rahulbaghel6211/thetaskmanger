import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import TaskListScreen from '../Screens/TaskScreenList';
import UpdateTaskScreen from '../Screens/UpdateScreen';
import NotificationComponent from '../Screens/NotificationScreen';
import Task from '../models/Task';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  List: undefined;
  UpdateTask: { task: Task };
  Notification: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="List" component={TaskListScreen} /> 
      <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} initialParams={{ task: {} as Task }} />
      <Stack.Screen name="Notification" component={NotificationComponent} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigator;
