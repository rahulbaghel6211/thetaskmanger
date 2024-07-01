import { getTasks, saveTasks } from './TaskStorage';
import Task from '../models/Task';

export const createTask = async (
  title: string,
  description: string,
  dueDate: string
): Promise<Task> => {
  try {
    const tasks = await getTasks();
    const id = String(tasks.length + 1); // Generate a unique ID
    const newTask: Task = { id, title, description, dueDate, status: 'pending' };
    tasks.push(newTask);
    await saveTasks(tasks);
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const readTasks = async (): Promise<Task[]> => {
  try {
    return await getTasks();
  } catch (error) {
    console.error('Error reading tasks:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, updatedTaskData: Partial<Task>): Promise<void> => {
  try {
    let tasks = await getTasks();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTaskData };
      await saveTasks(tasks);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    let tasks = await getTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(tasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
