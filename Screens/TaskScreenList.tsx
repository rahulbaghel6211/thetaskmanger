import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { readTasks, deleteTask } from '../context/TaskManger';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import moment from 'moment-timezone'; // Import moment-timezone

type RootStackParamList = {
  Home: undefined;
  List: undefined;
  UpdateTask: { task: Task };
};

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;
type TaskListScreenRouteProp = RouteProp<RootStackParamList, 'List'>;

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
};

type Props = {
  navigation: TaskListScreenNavigationProp;
  route: TaskListScreenRouteProp;
};

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await readTasks();
        console.log(fetchedTasks); // Log fetched tasks for debugging
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <View style={styles.container}>
          <Text style={styles.header}>Check Your Task List</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={{alignSelf:'center',marginTop:5}}>{task.description}</Text>
            <Text style={{alignSelf:'center',marginTop:5}}>Due Date: {moment.tz(task.dueDate, 'Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a')}</Text>
            <Text style={{alignSelf:'center',marginTop:5}}>Status: {task.status}</Text>
            <View style={{ flexDirection: 'row', justifyContent:'space-between' ,marginTop:10}}>
              <Text style={styles.delete} onPress={() => handleDeleteTask(task.id)}> Delete</Text>
              <Button title="Update" onPress={() => navigation.navigate('UpdateTask', { task })} />
            </View>
          </View>
        ))}
      </ScrollView>
      <Button
        title="Create Task"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  delete:{
   backgroundColor:'red',
   fontSize:14,
   fontWeight:'bold',
   color:'white',
   paddingHorizontal:14,
   paddingVertical:7,
   borderRadius:3
  },
  taskItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf:'center',
    marginBottom:10
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight:'bold',
    color:'#0A66C2'
  },
});

export default TaskListScreen;
