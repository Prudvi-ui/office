import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EmployeeSettings({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // 🔒 Logout confirmation
  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => navigation.replace("Login"), // ✅ replace instead of navigate to prevent going back
        },
      ]
    );
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
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Epmprofile")}>
          <Icon name="account-circle" size={24} color="orange" />
          <Text style={styles.optionText}>Profile Information</Text>
        </TouchableOpacity>

        {/* Notification Setting */}
        <View style={styles.optionSwitch}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="bell" size={24} color="orange" />
            <Text style={styles.optionText}>Enable Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? 'orange' : '#fff'}
          />
        </View>

        {/* Dark Mode */}
        <View style={styles.optionSwitch}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="theme-light-dark" size={24} color="orange" />
            <Text style={styles.optionText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            thumbColor={darkModeEnabled ? 'orange' : '#fff'}
          />
        </View>

        {/* Change Password */}
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Changepassword")}>
          <Icon name="lock-reset" size={24} color="orange" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        {/* Salary Details */}
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Salarydetails")}>
          <Icon name="cash" size={24} color="orange" />
          <Text style={styles.optionText}>Salary Details</Text>
        </TouchableOpacity>

        {/* Leave Settings */}
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Leaverequest")}>
          <Icon name="calendar-check" size={24} color="orange" />
          <Text style={styles.optionText}>Leave Management</Text>
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Support")}>
          <Icon name="headset" size={24} color="orange" />
          <Text style={styles.optionText}>Help & Support</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <Icon name="logout" size={24} color="red" />
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1247',
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
});
