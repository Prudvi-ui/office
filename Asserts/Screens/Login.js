import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle visibility

  const handleLogin = async () => {
    try {
      if (isAdmin) {
        const validAdminEmail = 'ss';
        const validAdminPassword = 'ss';
        if (email.trim() === validAdminEmail && password === validAdminPassword) {
          await AsyncStorage.setItem('userRole', 'admin');
          await AsyncStorage.removeItem('employeeName');
          navigation.navigate('Categories', { role: 'admin' });
        } else {
          Alert.alert('Login Failed', 'Invalid admin credentials');
        }
        return;
      }

      const storedEmployees = await AsyncStorage.getItem('Employees');
      const employees = storedEmployees ? JSON.parse(storedEmployees) : [];

      const matched = employees.find(
        emp =>
          emp['Emp Id'] === password.trim() ||
          emp['Email']?.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matched) {
        // Alert.alert('Login Failed', 'Invalid email or Emp Id');
        navigation.navigate('Employeecategories')

        return;
      }

      await AsyncStorage.setItem('userRole', 'employee');
      await AsyncStorage.setItem('employeeName', matched['Emp Name']);
      navigation.navigate('Categories', {
        role: 'employee',
        employeeName: matched['Emp Name'],
      });
    } catch (error) {
      console.error('Login error:', error);
      navigation.navigate('Employeecategories')
      // Alert.alert('Login Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ marginVertical: 60, marginHorizontal: 30 }}>
          <Text
            style={{
              fontSize: 30,
              color: '#0c1247',
              fontWeight: 'bold',
              marginBottom: 5,
            }}
          >
            Hey there!
          </Text>
          <Text
            style={{
              fontSize: 28,
              color: '#889783',
              fontWeight: 'bold',
            }}
          >
            {isAdmin ? 'Admin Login' : 'Employee Login'}
          </Text>
        </View>

        {/* Toggle Login Type */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => setIsAdmin(false)}
            style={{
              backgroundColor: !isAdmin ? '#0c1247' : 'white',
              borderWidth: 2,
              borderColor: '#0c1247',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: !isAdmin ? 'white' : '#0c1247',
                fontWeight: 'bold',
              }}
            >
              Employee Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsAdmin(true)}
            style={{
              backgroundColor: isAdmin ? '#0c1247' : 'white',
              borderWidth: 2,
              borderColor: '#0c1247',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: isAdmin ? 'white' : '#0c1247',
                fontWeight: 'bold',
              }}
            >
              Admin Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={{ alignItems: 'center', gap: 25 }}>
          {/* Email Field */}
          <View style={inputContainerStyle}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#0c1247"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={inputStyle}
              placeholder={isAdmin ? 'Admin Email' : 'Enter Email'}
              placeholderTextColor="#889783"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Field with Eye Toggle */}
          <View style={[inputContainerStyle, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={24}
                color="#0c1247"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={[inputStyle, { flex: 1 }]}
                placeholder={isAdmin ? 'Admin Password' : 'Enter Emp Id'}
                placeholderTextColor="#889783"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* 👁️ Toggle Icon */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#0c1247"
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '90%',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <MaterialCommunityIcons
                name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color="#0c1247"
              />
              <Text style={{ marginLeft: 6, color: '#0c1247', fontSize: 16 }}>
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => alert('Forgot Password pressed')}>
              <Text
                style={{
                  color: '#0c1247',
                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* Login Button */}
          <TouchableOpacity style={buttonStyle} onPress={handleLogin}>
            <Text style={{ color: '#0c1247', fontSize: 20, fontWeight: 'bold' }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// Style Constants
const inputContainerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  width: '80%',
  borderColor: '#0c1247',
  borderWidth: 3,
  borderRadius: 10,
  paddingHorizontal: 10,
  elevation: 10,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
};

const inputStyle = {
  flex: 1,
  height: 50,
  fontSize: 18,
  color: '#0c1247',
};

const buttonStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  width: '80%',
  borderColor: '#0c1247',
  borderWidth: 3,
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 10,
  elevation: 10,
  shadowColor: '#0c1247',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 5,
  justifyContent: 'center',
};
