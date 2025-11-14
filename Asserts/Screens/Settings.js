import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function EmployeeSettings({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async() => {
    setLogoutModalVisible(false);
    await AsyncStorage.clear(); 
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Epmprofile")}
          >
            <Icon name="account-circle" size={28} color="orange" />
            <Text style={styles.optionText}>Profile Information</Text>
          </TouchableOpacity>
        </Card>

        {/* Notification Setting */}
        <Card style={styles.card}>
          <View style={styles.optionSwitch}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="bell" size={28} color="orange" />
              <Text style={styles.optionText}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? 'orange' : '#fff'}
            />
          </View>
        </Card>

        {/* Change Password */}
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Changepassword")}
          >
            <Icon name="lock-reset" size={28} color="orange" />
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>
        </Card>

        {/* Salary Details */}
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Salarydetails")}
          >
            <Icon name="cash" size={28} color="orange" />
            <Text style={styles.optionText}>Salary Details</Text>
          </TouchableOpacity>
        </Card>

        {/* Leave Settings */}
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Leaverequest")}
          >
            <Icon name="calendar-check" size={28} color="orange" />
            <Text style={styles.optionText}>Leave Management</Text>
          </TouchableOpacity>
        </Card>

        {/* Help & Support */}
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Support")}
          >
            <Icon name="headset" size={28} color="orange" />
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <Card style={styles.card}>
          <LinearGradient
            colors={['#E77D41', '#E77D41']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          // style={styles.saveButton}
          >
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
              <Icon name="logout" size={28} color="#fff" />
              <Text style={[styles.optionText, { color: '#fff' }]}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Card>
      </ScrollView>

      {/* 🔒 Logout Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Icon name="logout" size={40} color="#001F54" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#001F54' }]}
                onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: '#001F54' }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0c1247',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 10,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    backgroundColor: '#fff',
    borderColor: '#0c1247', borderWidth: 2
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  optionSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 18,
    color: '#0c1247',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001F54',
    marginBottom: 5,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
