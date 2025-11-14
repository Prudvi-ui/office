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
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

export default function ReferralProfile({ navigation }) {
  const [name, setName] = useState('Prudvi');
  const [email, setEmail] = useState('prudvi@example.com');
  const [contactNo, setContactNo] = useState('+91 9876543210');
  const [address, setAddress] = useState('Vizag');
  const [referralPrice, setReferralPrice] = useState('10000');
  const [project, setProject] = useState('Grocery');
  const [totalProjectsCost, setTotalProjectsCost] = useState('200000');
  const [joiningDate, setJoiningDate] = useState(new Date('2022-03-15'));
  const [image, setImage] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedWithdraw, setSelectedWithdraw] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const amountOptions = [
    { type: 'Credited', value: 30000 },
    { type: 'Debited', value: 3000 },
  ];
  const totalCredited = amountOptions.find(i => i.type === 'Credited')?.value || 0;
  const totalDebited = amountOptions.find(i => i.type === 'Debited')?.value || 0;
  const remaining = totalCredited - totalDebited;

  const withdrawOptions = [
    { amount: '₹5,000', date: '01 Oct 2025', time: '10:30 AM' },
    { amount: '₹3,000', date: '15 Oct 2025', time: '12:45 PM' },
    { amount: '₹2,500', date: '01 Nov 2025', time: '03:10 PM' },
    { amount: '₹4,000', date: '10 Nov 2025', time: '08:00 PM' },
  ];

  const defaultRemainingAmount = `Remaining: ₹${remaining}`;
  const defaultWithdraw = `${withdrawOptions[withdrawOptions.length - 1].amount} | ${withdrawOptions[withdrawOptions.length - 1].date} | ${withdrawOptions[withdrawOptions.length - 1].time}`;

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setJoiningDate(selectedDate);
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

  const handleToggleEdit = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  const filteredWithdrawOptions = withdrawOptions.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.amount.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Referral Profile</Text>
          </View>

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImagePick} activeOpacity={isEditable ? 0.7 : 1}>
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
            <Text style={styles.label}>Referral Name</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={name}
              onChangeText={setName}
              editable={isEditable}
            />

            <Text style={styles.label}>Referral Email</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={email}
              onChangeText={setEmail}
              editable={isEditable}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Referral Contact No</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={contactNo}
              onChangeText={setContactNo}
              editable={isEditable}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Referral Address</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={address}
              onChangeText={setAddress}
              editable={isEditable}
            />

            <Text style={styles.label}>Project Name</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={project}
              onChangeText={setProject}
              editable={isEditable}
            />

            <Text style={styles.label}>Cost of the Project</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={totalProjectsCost}
              onChangeText={setTotalProjectsCost}
              editable={isEditable}
            />

            <Text style={styles.label}>Percentage Cost</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.disabledInput]}
              value={referralPrice}
              onChangeText={setReferralPrice}
              editable={isEditable}
            />

            {/* Amount Input */}
            <Text style={styles.label}>Amount</Text>
            <TouchableOpacity
              style={[styles.input, !isEditable && styles.disabledInput]}
              onPress={() => isEditable && setAmountModalVisible(true)}
              activeOpacity={isEditable ? 0.7 : 1}
            >
              <Text style={{ color: '#000' }}>
                {selectedAmount || defaultRemainingAmount}
              </Text>
            </TouchableOpacity>

            {/* Withdraw Amount Input */}
            <Text style={styles.label}>Withdraw Amount</Text>
            <TouchableOpacity
              style={[styles.input, !isEditable && styles.disabledInput]}
              onPress={() => isEditable && setWithdrawModalVisible(true)}
              activeOpacity={isEditable ? 0.7 : 1}
            >
              <Text style={{ color: '#000' }}>
                {selectedWithdraw || defaultWithdraw}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Edit / Save Button */}
          <TouchableOpacity
            onPress={handleToggleEdit}
            style={{ marginHorizontal: 20, marginBottom: 30 }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isEditable ? ['#E77D41', '#f0dfdaff'] : ['#001F54', '#ffffffff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Icon
                name={isEditable ? 'content-save' : 'pencil'}
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveText}>
                {isEditable ? 'Save Profile' : 'Edit Profile'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Amount Modal */}
      <Modal visible={amountModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Amount Details</Text>

            {amountOptions.map((item, index) => (
              <TouchableOpacity key={index} style={styles.amountRow}>
                <Text style={styles.amountLabel}>{item.type}</Text>
                <Text style={styles.amountValue}>₹{item.value}</Text>
              </TouchableOpacity>
            ))}

            <View style={[styles.amountRow, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10 }]}>
              <Text style={[styles.amountLabel, { fontWeight: '700' }]}>Remaining:</Text>
              <Text style={[styles.amountValue, { color: '#E77D41' }]}>₹{remaining}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setAmountModalVisible(false)}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw History</Text>

            {/* 🔍 Search Box */}
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color="#001F54" />
              <TextInput
                placeholder="Search by Amount / Date / Time"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor="#777"
              />
            </View>

            {/* Filtered List */}
            {filteredWithdrawOptions.length > 0 ? (
              filteredWithdrawOptions.map((item, index) => (
                <TouchableOpacity key={index} style={styles.withdrawRow}>
                  <Text style={styles.withdrawText}>
                    {item.amount} — {item.date} ({item.time})
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
                No records found
              </Text>
            )}

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWithdrawModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#001F54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    height: 70,
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
  label: { fontSize: 15, fontWeight: '500', color: '#001F54', marginBottom: 5 },
  input: {
    borderWidth: 2,
    borderColor: '#0c1247',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  disabledInput: { backgroundColor: '#f4f4f4', color: '#777' },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 0.5,
    borderRadius: 28

  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#001F54",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 6,
    color: "#000",
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#001F54' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  amountLabel: { fontSize: 15, color: '#333' },
  amountValue: { fontSize: 15, fontWeight: '600', color: '#001F54' },
  withdrawRow: { borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 8 },
  withdrawText: { fontSize: 15, color: '#333' },
  closeButton: {
    backgroundColor: '#001F54',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
  },
});
