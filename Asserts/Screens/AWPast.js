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
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation }) {
  const [formData, setFormData] = useState({ Status: 'Ongoing' });
  const [showModal, setShowModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [showPicker, setShowPicker] = useState({ field: null, visible: false });
  const [dates, setDates] = useState({ start: null, end: null });
  const [notifications, setNotifications] = useState([]);
  const [PN, setPN] = useState('');

  // Helper: Remaining days calculation
  const calculateRemainingDays = (start, end) => {
    if (!start || !end) return '';
    let count = 0;
    const currentDate = new Date();
    let date = new Date(currentDate > start ? currentDate : start);
    while (date <= end) {
      if (date.getDay() !== 0) count++;
      date.setDate(date.getDate() + 1);
    }
    return count;
  };

  // Handle text input
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Date picker logic
  const showDatePicker = field => {
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
    if (field === 'Start Date') setDates(prev => ({ ...prev, start: date }));
    if (field === 'End Date') setDates(prev => ({ ...prev, end: date }));
  };

  // Remaining days effect
  useEffect(() => {
    if (dates.start && dates.end) {
      const remaining = calculateRemainingDays(dates.start, dates.end);
      handleInputChange('Remaining Days', remaining.toString());
      if (remaining <= 15) {
        const endFormatted = dates.end.toISOString().split('T')[0];
        setNotifications([
          {
            message: `Only ${remaining} day(s) left until project deadline!`,
            until: endFormatted,
          },
        ]);
      }
    }
  }, [dates]);

  // Fetch stored project name
  useEffect(() => {
    const fetchProjectName = async () => {
      const name = await AsyncStorage.getItem('ProjectName');
      if (name) setPN(name);
    };
    fetchProjectName();
  }, []);

  // Save Project
  const handleSave = async () => {
    try {
      const projectName = formData['Project Name']?.trim();
      if (!projectName) {
        Alert.alert('Error', 'Project Name is required');
        return;
      }
      const newProject = {
        id: Date.now().toString(),
        name: projectName,
        data: formData,
      };
      const existing = await AsyncStorage.getItem('ProjectsData');
      const existingList = existing ? JSON.parse(existing) : [];
      const updatedList = [...existingList, newProject];
      await AsyncStorage.setItem('ProjectsData', JSON.stringify(updatedList));
      Alert.alert('Success', 'Project saved successfully!');
    } catch (error) {
      console.log('Error saving project:', error);
    }
  };

  // Common input box style
  const inputBox = {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View
        style={{
          height: 80,
          backgroundColor: '#0C1247',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 20 }}>
          {PN || 'Project Form'}
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }}>
          <Icon name="bell" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      {notifications.length > 0 && (
        <View
          style={{
            backgroundColor: '#ffeaea',
            margin: 10,
            padding: 10,
            borderRadius: 8,
            elevation: 3,
          }}>
          <Text style={{ fontWeight: 'bold', color: 'red' }}>Notifications</Text>
          {notifications.map((note, idx) => (
            <Text key={idx} style={{ color: '#0c1247' }}>
              • {note.message} (until {note.until})
            </Text>
          ))}
        </View>
      )}

      {/* Form */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* App Link */}
        <Text style={{ fontWeight: 'bold', color: '#0c1247', marginBottom: 5 }}>
          App Link or Screenshot
        </Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter App Link or Screenshot"
            value={formData['App Link or Screenshot'] || ''}
            onChangeText={text => handleInputChange('App Link or Screenshot', text)}
          />
        </View>

        {/* Project Name */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Project Name</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Project Name"
            value={formData['Project Name'] || ''}
            onChangeText={text => handleInputChange('Project Name', text)}
          />
        </View>

        {/* Company Name */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Company Name</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Company Name"
            value={formData['Company Name'] || ''}
            onChangeText={text => handleInputChange('Company Name', text)}
          />
        </View>

        {/* Description */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Description</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Description"
            multiline
            numberOfLines={3}
            value={formData['Description'] || ''}
            onChangeText={text => handleInputChange('Description', text)}
          />
        </View>

        {/* Technology */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Technology</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Technology Used"
            value={formData['Technology'] || ''}
            onChangeText={text => handleInputChange('Technology', text)}
          />
        </View>

        {/* Project Lead */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Project Lead</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Project Lead Name"
            value={formData['Project lead'] || ''}
            onChangeText={text => handleInputChange('Project lead', text)}
          />
        </View>

        {/* Start Date */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Start Date</Text>
        <TouchableOpacity onPress={() => showDatePicker('Start Date')} style={inputBox}>
          <Text style={{ color: formData['Start Date'] ? '#000' : '#aaa' }}>
            {formData['Start Date'] || 'Select Start Date'}
          </Text>
        </TouchableOpacity>

        {/* End Date */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>End Date</Text>
        <TouchableOpacity onPress={() => showDatePicker('End Date')} style={inputBox}>
          <Text style={{ color: formData['End Date'] ? '#000' : '#aaa' }}>
            {formData['End Date'] || 'Select End Date'}
          </Text>
        </TouchableOpacity>

        {/* Budget */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Budget</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Budget"
            keyboardType="numeric"
            value={formData['Budget'] || ''}
            onChangeText={text => handleInputChange('Budget', text)}
          />
        </View>

        {/* Client Feedback */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Client Feedback</Text>
        <View style={inputBox}>
          <TextInput
            placeholder="Enter Client Feedback"
            value={formData['Client Feedback'] || ''}
            onChangeText={text => handleInputChange('Client Feedback', text)}
          />
        </View>

        {/* Status */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Status</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          <Picker
            selectedValue={formData['Status']}
            onValueChange={val => handleInputChange('Status', val)}>
            <Picker.Item label="Ongoing" value="Ongoing" />
            <Picker.Item label="Completed" value="Completed" />
          </Picker>
        </View>

        {/* Remaining Days */}
        <Text style={{ marginTop: 15, fontWeight: 'bold', color: '#0c1247' }}>Remaining Days</Text>
        <View style={inputBox}>
          <TextInput
            editable={false}
            style={{
              color:
                parseInt(formData['Remaining Days']) <= 15 && formData['Remaining Days']
                  ? 'red'
                  : '#000',
              fontWeight:
                parseInt(formData['Remaining Days']) <= 15 && formData['Remaining Days']
                  ? 'bold'
                  : 'normal',
            }}
            value={formData['Remaining Days'] || ''}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            marginTop: 30,
            marginBottom: 50,
            backgroundColor: '#FF5C00',
            borderRadius: 25,
            paddingVertical: 12,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Project</Text>
        </TouchableOpacity>
      </ScrollView>

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
