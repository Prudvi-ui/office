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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation, route }) {
  const [formData, setFormData] = useState({});
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
      if (date.getDay() !== 0) count++;
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

    if (field === 'Start Date') setDates((prev) => ({ ...prev, start: date }));
    if (field === 'End Date') setDates((prev) => ({ ...prev, end: date }));
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

      const existing = await AsyncStorage.getItem('ProjectsData');
      let existingList = existing ? JSON.parse(existing) : [];

      const index = existingList.findIndex((p) => p.name === projectName);
      if (index >= 0) {
        existingList[index] = { ...existingList[index], ...newProject };
      } else {
        existingList.push(newProject);
      }

      await AsyncStorage.setItem('ProjectsData', JSON.stringify(existingList));
      navigation.navigate('AppDevelopment');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  useEffect(() => {
    if (route.params?.projectName) {
      setFormData((prev) => ({
        ...prev,
        'Project Name': route.params.projectName,
      }));
    }
  }, [route.params?.projectName]);

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
      <View
        style={{
          backgroundColor: '#0C1247',
          height: 80,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 20 }}>
          {PN}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation?.navigate('Notification', { notifications })}
        >
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
            shadowColor: '#0c1247',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: 'red', marginBottom: 6 }}>Notifications</Text>
          {notifications.map((note, idx) => (
            <Text key={idx} style={{ color: '#0c1247' }}>
              • {note.message} (until {note.until})
            </Text>
          ))}
        </View>
      )}

      {/* ✅ Form Section */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 24, padding: 16 }}>
            {/* Individual Text Inputs */}
            <Text style={styles.label}>Project Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Project Name"
                value={formData['Project Name'] || ''}
                onChangeText={(text) => handleInputChange('Project Name', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Company Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Company Name"
                value={formData['Company Name'] || ''}
                onChangeText={(text) => handleInputChange('Company Name', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Contact No</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Contact No"
                keyboardType="phone-pad"
                value={formData['Contact No'] || ''}
                onChangeText={(text) => handleInputChange('Contact No', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Description"
                value={formData['Description'] || ''}
                onChangeText={(text) => handleInputChange('Description', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Technology</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Technology"
                value={formData['Technology'] || ''}
                onChangeText={(text) => handleInputChange('Technology', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Project Lead</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Project Lead"
                value={formData['Project lead'] || ''}
                onChangeText={(text) => handleInputChange('Project lead', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Start Date</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => showDatePicker('Start Date')}>
                <Text style={{ color: formData['Start Date'] ? '#000' : '#aaa', paddingVertical: 10 }}>
                  {formData['Start Date'] || 'Select Start Date'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>End Date</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => showDatePicker('End Date')}>
                <Text style={{ color: formData['End Date'] ? '#000' : '#aaa', paddingVertical: 10 }}>
                  {formData['End Date'] || 'Select End Date'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Status</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={formData['Status'] || 'Ongoing'}
                onValueChange={(val) => handleInputChange('Status', val)}
              >
                <Picker.Item label="Ongoing" value="Ongoing" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            <Text style={styles.label}>Budget</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Budget"
                keyboardType="numeric"
                value={formData['Budget'] || ''}
                onChangeText={(text) => handleInputChange('Budget', text)}
                style={styles.textInput}
              />
            </View>

            <Text style={styles.label}>Remaining Days</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Auto Calculated"
                editable={false}
                value={formData['Remaining Days'] || ''}
                style={[
                  styles.textInput,
                  {
                    color:
                      parseInt(formData['Remaining Days']) <= 15 ? 'red' : '#000',
                    fontWeight:
                      parseInt(formData['Remaining Days']) <= 15 ? 'bold' : 'normal',
                  },
                ]}
              />
            </View>
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
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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
        }}
      >
        <Icon name="plus" color="white" size={28} />
      </TouchableOpacity>

      {/* Modal for Adding New Field */}
      <Modal transparent visible={showModal} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 20,
          }}
        >
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Add New Field
            </Text>
            <TextInput
              autoFocus
              placeholder="Enter field name"
              value={newFieldName}
              onChangeText={setNewFieldName}
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                marginBottom: 20,
                paddingVertical: 4,
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable onPress={() => setShowModal(false)} style={{ marginRight: 16 }}>
                <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
              </Pressable>
              <Pressable>
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

const styles = {
  label: {
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#0c1247',
    fontSize: 14,
  },
  inputContainer: {
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    color: '#000',
  },
};
