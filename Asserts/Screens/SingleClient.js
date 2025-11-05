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
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialFields = [
  { id: 1, label: 'Client Name' },
  { id: 2, label: 'Purpose' },
  { id: 3, label: 'Contact No' },
  { id: 4, label: 'Start Date' },
  { id: 5, label: 'End Date' },
  { id: 6, label: 'Remaining Days' },
];

export default function ClientProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState(initialFields);
  const [showModal, setShowModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [PN, setPN] = useState('');
  const [showPicker, setShowPicker] = useState({ field: null, visible: false });
  const [dates, setDates] = useState({ start: null, end: null });
  const [notifications, setNotifications] = useState([]);

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

  const addField = () => {
    if (newFieldName.trim() === '') return;
    const nextId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
    setFields((prev) => [...prev, { id: nextId, label: newFieldName.trim() }]);
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
    if (field === 'Start Date') setDates((prev) => ({ ...prev, start: date }));
    if (field === 'End Date') setDates((prev) => ({ ...prev, end: date }));
  };

  const selectProfileImage = () => {
    Alert.alert('Upload Profile Picture', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => {
          launchCamera({ mediaType: 'photo', cameraType: 'front', saveToPhotos: true, quality: 0.7 }, (response) => {
            if (response.assets && response.assets.length > 0) {
              setProfileImage(response.assets[0].uri);
            }
          });
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
            if (response.assets && response.assets.length > 0) {
              setProfileImage(response.assets[0].uri);
            }
          });
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const saveProfile = async () => {
    const emptyFields = fields.filter((f) => !formData[f.label]);
    if (emptyFields.length) {
      Alert.alert('Missing Fields', `Please fill in:\n${emptyFields.map(f => f.label).join(', ')}`);
      return;
    }
    try {
      const existingData = await AsyncStorage.getItem('Clients');
      let clients = existingData ? JSON.parse(existingData) : [];

      const updatedForm = {
        ...formData,
        profileImage,
        'Client Id': formData['Client Id'] || Date.now().toString(),
        createdBy: await AsyncStorage.getItem('ClientName') || 'Unknown',
      };

      const index = clients.findIndex(c => c['Client Id'] === updatedForm['Client Id']);
      if (index > -1) {
        clients[index] = updatedForm;
      } else {
        clients.push(updatedForm);
      }

      await AsyncStorage.setItem('Clients', JSON.stringify(clients));
      Alert.alert('Success', 'Client profile saved!');
      navigation.goBack();
    } catch (error) {
      console.error('Saving error:', error);
      Alert.alert('Error', 'Failed to save client data.');
    }
  };

  useEffect(() => {
    if (route.params?.client) {
      const client = route.params.client;
      setFormData({
        ...client,
        'Client Id': client['Client Id'] || Date.now().toString(),
      });
      if (client.profileImage) setProfileImage(client.profileImage);
      if (client['Client Name']) setPN(client['Client Name']);
    }
  }, []);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 25, color: '#0C1247', fontWeight: 'bold',marginTop:20 }}>Company Name</Text>
        <TouchableOpacity style={{marginTop:20}} onPress={() => navigation.navigate('Notification', { notifications })}>
          <Icon name="bell" size={26} color="#0c1247" />
        </TouchableOpacity>
      </View>

      {notifications.length > 0 && (
        <View style={{ backgroundColor: '#ffeaea', margin: 10, padding: 10, borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', color: 'red', marginBottom: 6 }}>Notifications</Text>
          {notifications.map((note, idx) => (
            <Text key={idx} style={{ color: '#0c1247' }}>
              • {note.message} (until {note.until})
            </Text>
          ))}
        </View>
      )}

      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <TouchableOpacity onPress={selectProfileImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../Images/Profile1.png')}
            style={{ width: 120, height: 120, borderRadius: 100, borderWidth: 2, borderColor: '#0C1247' }}
          />
        </TouchableOpacity>
        <Text style={{ marginTop: 8, fontSize: 16, color: '#0C1247', fontWeight: 'bold' }}>{PN}</Text>
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 24, padding: 16 }}>
          {fields.map((item) => (
            <View key={item.id} style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 6, fontWeight: 'bold', color: '#0c1247', fontSize: 14 }}>{item.label}</Text>
              {item.label === 'Start Date' || item.label === 'End Date' ? (
                <TouchableOpacity
                  onPress={() => showDatePicker(item.label)}
                  style={{ borderBottomWidth: 1, borderColor: '#889783', paddingVertical: 10 }}>
                  <Text style={{ color: formData[item.label] ? '#000' : '#aaa' }}>
                    {formData[item.label] || `Select ${item.label}`}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#889783',
                    paddingVertical: 6,
                    color: item.label === 'Remaining Days' && parseInt(formData[item.label]) <= 15 ? 'red' : '#000',
                    fontWeight: item.label === 'Remaining Days' && parseInt(formData[item.label]) <= 15 ? 'bold' : 'normal',
                  }}
                  onChangeText={(text) => handleInputChange(item.label, text)}
                  value={formData?.[item.label] || ''}
                  placeholder={`Enter ${item.label}`}
                  editable={item.label !== 'Remaining Days'}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => setShowModal(true)} style={{ position: 'absolute', bottom: 30, right: 30, backgroundColor: '#0c1247', padding: 16, borderRadius: 100 }}>
        <Icon name="plus" color="white" size={28} />
      </TouchableOpacity>

      <TouchableOpacity onPress={saveProfile} style={{ position: 'absolute', bottom: 100, right: 30, backgroundColor: '#FF5C00', padding: 16, borderRadius: 100 }}>
        <Icon name="content-save" color="white" size={28} />
      </TouchableOpacity>

      <Modal transparent visible={showModal} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Add New Field</Text>
            <TextInput
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
