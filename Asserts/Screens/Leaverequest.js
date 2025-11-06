import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function UpdateLeaveForm({ navigation }) {
  const [leaveFrom, setLeaveFrom] = useState(new Date());
  const [leaveTo, setLeaveTo] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [reason, setReason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const leaveOptions = [
    'Sick Leave',
    'Casual Leave',
    'Annual Leave',
    'Emergency Leave',
  ];

  // --- Date change handlers (consistent on both platforms)
  const onChangeFrom = (event, selectedDate) => {
    if (selectedDate) setLeaveFrom(selectedDate);
    setShowFromPicker(false);
  };

  const onChangeTo = (event, selectedDate) => {
    if (selectedDate) setLeaveTo(selectedDate);
    setShowToPicker(false);
  };

  const formatDate = (date) => date.toLocaleDateString('en-GB');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Leave Form</Text>
        <View />
      </View>

      {/* Main content */}
      <View style={styles.container}>
        {/* Leave From */}
        <Text style={styles.label}>Leave from</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowFromPicker(true)}>
          <Text style={styles.inputText}>{formatDate(leaveFrom)}</Text>
          <Icon name="calendar" size={22} color="#555" />
        </TouchableOpacity>

        {/* Leave To */}
        <Text style={styles.label}>Leave to</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowToPicker(true)}>
          <Text style={styles.inputText}>{formatDate(leaveTo)}</Text>
          <Icon name="calendar" size={22} color="#555" />
        </TouchableOpacity>

        {/* Leave Type */}
        <Text style={styles.label}>Leave type</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.inputText}>{leaveType}</Text>
          <Icon name="menu-down" size={22} color="#555" />
        </TouchableOpacity>

        {/* Reason */}
        <Text style={styles.label}>Reason</Text>
        <TextInput
          style={[styles.inputBox, { height: 100 }]}
          multiline
          placeholder="Enter reason"
          value={reason}
          onChangeText={setReason}
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelBtn]}>
            <Text style={styles.cancelText}>Cancel Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.updateBtn]}>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Dropdown */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Leave Type</Text>
            {leaveOptions.map((type) => (
              <Pressable
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  setLeaveType(type);
                  setModalVisible(false);
                }}>
                <Text style={styles.modalOptionText}>{type}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={leaveFrom}
          mode="date"
          display="default"
          onChange={onChangeFrom}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={leaveTo}
          mode="date"
          display="default"
          onChange={onChangeTo}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#001F54' },
  header: {
    backgroundColor: '#001F54',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginTop: 20,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  container: { padding: 20 },
  label: { color: 'white', fontSize: 15, fontWeight: '500', marginTop: 15 },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 6,
    padding: 12,
    marginTop: 6,
    backgroundColor: 'white',
  },
  inputText: { color: 'black', fontSize: 15 },
  inputBox: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 6,
    marginTop: 6,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  button: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelBtn: { backgroundColor: 'white' },
  updateBtn: { backgroundColor: 'white' },
  cancelText: { color: 'black', fontWeight: '600' },
  updateText: { color: 'black', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001F54',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: '#ccc',
  },
  modalOptionText: { fontSize: 16, color: '#001F54', textAlign: 'center' },
});
