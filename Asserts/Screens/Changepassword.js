import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";

export default function ChangePasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => { 
  if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
    // ⚠️ Required fields toast
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'All fields are required.',
      position: 'bottom',
    });
    return;
  }

  if (password !== confirmPassword) {
    // ❌ Password mismatch toast
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Passwords do not match.',
      position: 'bottom',
    });
    return;
  }

  // ✅ Success toast
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'Your password has been updated successfully. 🔒',
    position: 'bottom',
  });

  // You can call your API here to change the password
};
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <Text style={styles.subtitle}>
                    Please enter your registered email and new password details below.
                </Text>

                {/* Email Field */}
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password Field */}
                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter new password"
                        placeholderTextColor="#888"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={22}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Field */}
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Re-enter new password"
                        placeholderTextColor="#888"
                        secureTextEntry={!showConfirm}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                        <Icon
                            name={showConfirm ? 'eye-off' : 'eye'}
                            size={22}
                            color="#black"
                        />
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// 💅 Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c1247',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 28,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
        color: '#fff',
    },
    content: {
        marginTop: 40,
    },
    subtitle: {
        fontSize: 15,
        color: '#fff',
        lineHeight: 22,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#000',
        marginBottom: 25,
        backgroundColor: 'white',
        
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 25,
        backgroundColor: 'white'

    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 10,
    },
    button: {
        backgroundColor: 'orange',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
