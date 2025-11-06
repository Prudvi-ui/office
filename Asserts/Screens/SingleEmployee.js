import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EmployeeProfile({navigation}) {
  const [name, setName] = useState('prudvi');
  const [email, setEmail] = useState('prudvi@example.com');
  const [empId, setEmpId] = useState('EMP1023');
  const [empRole, setEmpRole] = useState('Software Developer');
  const [contactNo, setContactNo] = useState('+91 9876543210');
  const [salary, setSalary] = useState('₹ 18000');
  const [pfAmount, setPfAmount] = useState('₹2,000');
  const [esiAmount, setEsiAmount] = useState('₹500');
  const [monthlyAttendance, setMonthlyAttendance] = useState('28 Days');
  const [paidLeaves, setPaidLeaves] = useState('2 Days');
  const [unpaidLeaves, setUnpaidLeaves] = useState('0 Days');
  const [netTakePro, setNetTakePro] = useState('₹16,000');
  const [joiningDate, setJoiningDate] = useState(new Date('2022-03-15'));
  const [image, setImage] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setJoiningDate(selectedDate);
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets[0].uri) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    navigation.goBack()
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Employee Profile</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={{ uri: image }} style={styles.profileImage} />
            <View style={styles.editIcon}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter email"
          />

          <Text style={styles.label}>Employee ID</Text>
          <TextInput style={styles.input} value={empId} onChangeText={setEmpId} placeholder="Enter Employee ID" />

          <Text style={styles.label}>Employee Role</Text>
          <TextInput style={styles.input} value={empRole} onChangeText={setEmpRole} placeholder="Enter role" />

          <Text style={styles.label}>Contact No</Text>
          <TextInput
            style={styles.input}
            value={contactNo}
            onChangeText={setContactNo}
            keyboardType="phone-pad"
            placeholder="Enter contact number"
          />

          <Text style={styles.label}>Salary</Text>
          <TextInput
            style={styles.input}
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            placeholder="Enter salary"
          />

          <Text style={styles.label}>PF Amount</Text>
          <TextInput
            style={styles.input}
            value={pfAmount}
            onChangeText={setPfAmount}
            keyboardType="numeric"
            placeholder="Enter PF amount"
          />

          <Text style={styles.label}>ESI Amount</Text>
          <TextInput
            style={styles.input}
            value={esiAmount}
            onChangeText={setEsiAmount}
            keyboardType="numeric"
            placeholder="Enter ESI amount"
          />

          <Text style={styles.label}>Monthly Attendance</Text>
          <TextInput
            style={styles.input}
            value={monthlyAttendance}
            onChangeText={setMonthlyAttendance}
            placeholder="Enter monthly attendance"
          />

          <Text style={styles.label}>Paid Leaves</Text>
          <TextInput
            style={styles.input}
            value={paidLeaves}
            onChangeText={setPaidLeaves}
            placeholder="Enter paid leaves"
          />

          <Text style={styles.label}>Unpaid Leaves</Text>
          <TextInput
            style={styles.input}
            value={unpaidLeaves}
            onChangeText={setUnpaidLeaves}
            placeholder="Enter unpaid leaves"
          />

          <Text style={styles.label}>Net Take Home</Text>
          <TextInput
            style={styles.input}
            value={netTakePro}
            onChangeText={setNetTakePro}
            keyboardType="numeric"
            placeholder="Enter net take home"
          />

          <Text style={styles.label}>Joining Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar" size={20} color="#555" />
            <Text style={styles.dateText}>{joiningDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Render Date Picker always, visibility controlled by state */}
      {showDatePicker && (
        <DateTimePicker
          value={joiningDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001F54' },
  header: {
    backgroundColor: '#001F54',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop:20
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 10 },
  imageContainer: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#001F54',
    borderRadius: 15,
    padding: 5,
  },
  form: { paddingHorizontal: 20, marginBottom: 40 },
  label: { fontSize: 15, fontWeight: '500', color: '#fff', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  dateText: { marginLeft: 10, color: '#333' },
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  saveText: { color: '#001F54', fontSize: 16, fontWeight: '600' },
});
