import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialFields = [
  'Project Name',
  'Company Name',
  'Contact No',
  'Description',
  'Technology',
  'Project lead',
  'Start Date',
  'End Date',
  'Status',
  'Budget',
  'Remaining Days',
];

export default function App({ navigation }) {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState(initialFields);
  const [showModal, setShowModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [showPicker, setShowPicker] = useState({ field: null, visible: false });
  const [dates, setDates] = useState({ start: null, end: null });
  const [notifications, setNotifications] = useState([]);
  const [PN, setPN] = useState('');

  const calculateRemainingDays = (start, end) => {
    if (!start || !end) return '';
    let count = 0;
    const currentDate = new Date();
    let date = new Date(currentDate > start ? currentDate : start);
    while (date <= end) {
      if (date.getDay() !== 0) count++; // Skip Sundays
      date.setDate(date.getDate() + 1);
    }
    return count;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addField = () => {
    const trimmed = newFieldName.trim();
    if (trimmed === '' || fields.includes(trimmed)) return;
    setFields((prev) => [...prev, trimmed]);
    setNewFieldName('');
    setShowModal(false);
  };

  const showDatePicker = (field) => {
    setShowPicker({ field, visible: true });
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker({ field: null, visible: false });
      return;
    }

    const date = selectedDate || new Date();
    const field = showPicker.field;
    const formattedDate = date.toISOString().split('T')[0];
    handleInputChange(field, formattedDate);
    setShowPicker({ field: null, visible: false });

    if (field === 'Start Date') {
      setDates((prev) => ({ ...prev, start: date }));
    }
    if (field === 'End Date') {
      setDates((prev) => ({ ...prev, end: date }));
    }
  };

  useEffect(() => {
    if (dates.start && dates.end) {
      const remaining = calculateRemainingDays(dates.start, dates.end);
      handleInputChange('Remaining Days', remaining.toString());

      if (remaining <= 15) {
        const exists = notifications.find((n) => n.field === 'Remaining Days');
        const endFormatted = dates.end.toISOString().split('T')[0];

        if (!exists) {
          setNotifications((prev) => [
            ...prev,
            {
              field: 'Remaining Days',
              message: `Only ${remaining} day(s) left until project deadline!`,
              until: endFormatted,
            },
          ]);
        }
      }
    }
  }, [dates]);

  const handleProject = async () => {
  try {
    const projectName = formData['Project Name'] || '';
    const status = formData['Status'] || 'Ongoing';

    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      status: status,
      createdAt: new Date().toISOString(),
    };

    // Fetch existing
    const existing = await AsyncStorage.getItem('ProjectsData');
    const existingList = existing ? JSON.parse(existing) : [];

    // Save new
    const updatedList = [...existingList, newProject];
    await AsyncStorage.setItem('ProjectsData', JSON.stringify(updatedList));

    navigation.navigate('WebDevelopment');
  } catch (error) {
    console.error('Error saving project:', error);
  }
};
 useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const name = await AsyncStorage.getItem('ProjectName');
        if (name) setPN(name);
      } catch (error) {
        console.error('Error fetching project name:', error);
      }
    };
    fetchProjectName();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#0C1247',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 20 }}>{PN}</Text>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation?.navigate('Notification', { notifications })}
        >
          <Icon name="bell" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      {notifications.length > 0 && (
        <View style={{
          backgroundColor: '#ffeaea',
          margin: 10,
          padding: 10,
          borderRadius: 8,
          shadowColor: '#0c1247',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <Text style={{ fontWeight: 'bold', color: 'red', marginBottom: 6 }}>Notifications</Text>
          {notifications.map((note, idx) => (
            <Text key={idx} style={{ color: '#0c1247' }}>
              • {note.message} (until {note.until})
            </Text>
          ))}
        </View>
      )}

      {/* Form */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 24, padding: 16 }}>
          {fields.map((item, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <Text style={{
                marginBottom: 6,
                fontWeight: 'bold',
                color: '#0c1247',
                fontSize: 14
              }}>{item}</Text>

              {item === 'Start Date' || item === 'End Date' ? (
                <View style={{
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                  <TouchableOpacity
                    onPress={() => showDatePicker(item)}
                    style={{ paddingVertical: 10 }}
                  >
                    <Text style={{ color: formData[item] ? '#000' : '#aaa' }}>
                      {formData[item] || `Select ${item}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : item === 'Status' ? (
                <View style={{
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  paddingHorizontal: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                  <Picker
                    selectedValue={formData[item] || 'Ongoing'}
                    onValueChange={(val) => handleInputChange(item, val)}
                  >
                    <Picker.Item label="Ongoing" value="Ongoing" />
                    <Picker.Item label="Completed" value="Completed" />
                  </Picker>
                </View>
              ) : (
                <View style={{
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                  <TextInput
                    placeholder={`Enter ${item}`}
                    onChangeText={(text) => handleInputChange(item, text)}
                    value={formData[item] || ''}
                    editable={item !== 'Remaining Days'}
                    style={{
                      color: item === 'Remaining Days' && parseInt(formData[item]) <= 15 ? 'red' : '#000',
                      fontWeight: item === 'Remaining Days' && parseInt(formData[item]) <= 15 ? 'bold' : 'normal',
                    }}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleProject}
          style={{
            paddingVertical: 10,
            width: 150,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#0c1247',
            backgroundColor: '#FF5C00',
            borderRadius: 20,
            alignSelf: 'center',
            marginBottom: 40,
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Add Field Button */}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: '#0c1247',
          padding: 16,
          borderRadius: 100,
          elevation: 10,
        }}>
        <Icon name="plus" color="white" size={28} />
      </TouchableOpacity>

      {/* Modal for Adding New Field */}
      <Modal transparent visible={showModal} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Add New Field</Text>
            <TextInput
              autoFocus
              placeholder="Enter field name"
              value={newFieldName}
              onChangeText={setNewFieldName}
              style={{ borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, paddingVertical: 4 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable onPress={() => setShowModal(false)} style={{ marginRight: 16 }}>
                <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={addField}>
                <Text style={{ color: 'green', fontSize: 16 }}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showPicker.visible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
}
