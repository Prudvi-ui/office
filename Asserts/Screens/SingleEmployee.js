import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployeeProfile({ navigation }) {

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
  const [role, setRole] = useState("");

  const isEditable = role === "Admin"; // Only Admin can edit special fields

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate && isEditable) {
      setJoiningDate(selectedDate);
    }
  };

  const handleImagePick = () => {
    if (!isEditable) return;
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets[0].uri) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    navigation.goBack();
  };

  // FIXED useEffect – cannot be async directly
  useEffect(() => {
    const getUserRole = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      setRole(storedRole || "");
    };
    getUserRole();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Icon name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Employee Profile</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePick} disabled={!isEditable}>
            <Image source={{ uri: image }} style={styles.profileImage} />
            {isEditable && (
              <View style={styles.editIcon}>
                <Icon name="camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>

          {/* ALWAYS EDITABLE */}
          <CustomInput label="Name" value={name} onChange={setName} />
          <CustomInput label="Email" value={email} onChange={setEmail} />
          <CustomInput label="Contact No" value={contactNo} onChange={setContactNo} />

          {/* Admin Editable Fields */}
          <CustomInput label="Employee ID" value={empId} editable={isEditable} onChange={setEmpId} />
          <CustomInput label="Employee Role" value={empRole} editable={isEditable} onChange={setEmpRole} />

          <CustomInput label="Salary" value={salary} editable={isEditable} onChange={setSalary} />
          <CustomInput label="PF Amount" value={pfAmount} editable={isEditable} onChange={setPfAmount} />
          <CustomInput label="ESI Amount" value={esiAmount} editable={isEditable} onChange={setEsiAmount} />
          <CustomInput label="Monthly Attendance" value={monthlyAttendance} editable={isEditable} onChange={setMonthlyAttendance} />
          <CustomInput label="Paid Leaves" value={paidLeaves} editable={isEditable} onChange={setPaidLeaves} />
          <CustomInput label="Unpaid Leaves" value={unpaidLeaves} editable={isEditable} onChange={setUnpaidLeaves} />
          <CustomInput label="Net Take Home" value={netTakePro} editable={isEditable} onChange={setNetTakePro} />

          {/* Joining Date Picker */}
          <Text style={styles.label}>Joining Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => isEditable && setShowDatePicker(true)}
            disabled={!isEditable}
          >
            <Icon name="calendar" size={20} color="#555" />
            <Text style={styles.dateText}>{joiningDate.toDateString()}</Text>
          </TouchableOpacity>

        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={{ marginHorizontal: 20, marginBottom: 30 }}>
          <LinearGradient
            colors={['#E77D41', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>Save Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      {showDatePicker && isEditable && (
        <DateTimePicker value={joiningDate} mode="date" onChange={onChangeDate} />
      )}
    </SafeAreaView>
  );
}

// COMPONENT FOR INPUTS
const CustomInput = ({ label, value, onChange, editable = true }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, { opacity: editable ? 1 : 0.5 }]}
      value={value}
      editable={editable}
      onChangeText={onChange}
    />
  </>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    backgroundColor: '#001F54',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 80
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 10, marginTop: 20 },
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
  label: { fontSize: 15, fontWeight: '500', color: '#001F54', marginBottom: 5 },
  input: {
    borderWidth: 2,
    borderColor: '#0c1247',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0c1247',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  dateText: { marginLeft: 10, color: '#333' },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#001F54',
    borderWidth: 1,
  },
  saveText: { color: '#001F54', fontSize: 16, fontWeight: '600' },
});
