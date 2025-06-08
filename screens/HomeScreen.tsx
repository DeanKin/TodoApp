import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import ShowModal from './ShowModal';
import { API_CONFIG, getApiUrl } from '../src/config/api.config';
import { Task } from '../src/types';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/tasks'));
      const result = await response.json();
      setTasks(result);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      Alert.alert('Error', 'Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const user = await AsyncStorage.getItem('loggedInUser'); // Retrieve the logged-in user's email
      if (!user) {
        Alert.alert('Error', 'No logged-in user found. Please log in again.');
        return;
      }

      const taskWithUser = { ...newTask, user }; // Include the user in the task data
      const response = await fetch(getApiUrl('/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const createdTask = await response.json();
      setTasks((prevData) => [...prevData, createdTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
      Alert.alert('Error', 'Failed to add task. Please try again later.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleTaskPress = (task) => {
    navigation.navigate('Comments', {
      id: task.id,
      title: task.title,
    });
  };

  const renderItem = ({ item }: { item: Task }) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleTaskPress(item)}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>
          {item.user && `By: ${item.user} - `}Comments: {item.commentCount}
        </Text>
        <Text style={styles.meta}>{formattedDate} {formattedTime}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Todo List</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.exchangeButton}
            onPress={() => navigation.navigate('Exchange')}
          >
            <Text style={styles.exchangeButtonText}>Exchange Rates</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.exchangeButtonText}>Verify Currency</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || `key-${index}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <ShowModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSubmit={(task) => {
          handleAddTask(task);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  itemContainer: { padding: 10, marginVertical: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { fontSize: 14, marginVertical: 5 },
  meta: { fontSize: 12, color: '#666' },
  addButton: { padding: 10, backgroundColor: '#007BFF', alignItems: 'center', borderRadius: 5, marginBottom: 20, marginTop: 10 },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  exchangeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  exchangeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
