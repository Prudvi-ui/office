import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProjectTasks({ navigation }) {
  const [tasks, setTasks] = useState([
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
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const statusOptions = [
    { label: 'To Do', color: '#e74c3c' },
    { label: 'In Progress', color: '#f39c12' },
    { label: 'Completed', color: '#27ae60' },
  ];

  const openStatusModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const updateStatus = (newStatus) => {
    const updatedTasks = tasks.map((t) =>
      t.id === selectedTask.id
        ? { ...t, status: newStatus.label, color: newStatus.color }
        : t
    );
    setTasks(updatedTasks);
    setModalVisible(false);
  };

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

            {/* Status Update Button */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => openStatusModal(task)}
            >
              <Icon name="pencil" size={16} color="#fff" />
              <Text style={styles.updateText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select New Status</Text>
            {statusOptions.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.optionBtn}
                onPress={() => updateStatus(opt)}
              >
                <Text style={[styles.optionText, { color: opt.color }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 20,
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
  updateButton: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  updateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  optionBtn: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 15,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
  },
  closeText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
