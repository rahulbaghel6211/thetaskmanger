// utils/TaskStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';

export const getTasks = async () => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
    return tasksJson != null ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error retrieving tasks from AsyncStorage:', error);
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to AsyncStorage:', error);
  }
};
