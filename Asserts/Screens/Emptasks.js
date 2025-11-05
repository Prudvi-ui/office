import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProjectTasks({ navigation }) {
  const tasks = [
    {
      id: 1,
      title: 'Design UI',
      description: 'Create wireframes and UI mockups',
      dueDate: 'Apr 06, 2025',
      assignee: 'Alice Johnson',
      status: 'In Progress',
      color: '#f39c12',
    },
    {
      id: 2,
      title: 'Develop Backend',
      description: 'Implement API endpoints and database',
      dueDate: 'Apr 13, 2025',
      assignee: 'Bob Smith',
      status: 'To Do',
      color: '#e74c3c',
    },
    {
      id: 3,
      title: 'Testing',
      description: 'Write unit and integration tests',
      dueDate: 'Apr 20, 2025',
      assignee: 'Charlie Davis',
      status: 'Completed',
      color: '#27ae60',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Tasks</Text>
        <View style={{ width: 26 }} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.card}>
            <Text style={[styles.title, { color: task.color }]}>{task.title}</Text>
            <Text style={styles.desc}>Description: {task.description}</Text>
            <Text style={styles.text}>Due Date: {task.dueDate}</Text>
            <Text style={styles.text}>Assignee: {task.assignee}</Text>
            <Text style={[styles.status, { color: task.color }]}>
              Status: {task.status}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F54',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001F54',
    paddingVertical: 14,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginTop:20
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  status: {
    fontWeight: '600',
    marginTop: 8,
  },
});
