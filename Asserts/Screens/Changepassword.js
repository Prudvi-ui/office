import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import LinearGradient from "react-native-linear-gradient";

export default function ChangePasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChangePassword = () => {
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All fields are required.',
                position: 'bottom',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Passwords do not match.',
                position: 'bottom',
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Your password has been updated successfully. 🔒',
            position: 'bottom',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#0c1247" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={26} color="#fff" style={{ marginTop: 20 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
            </View>

            {/* Keyboard Avoiding */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
                                    color="#555"
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
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity onPress={handleChangePassword}>
                            <LinearGradient
                                colors={['#E77D41', '#FFFFFF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Update Password</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0c1247',
        paddingVertical: 15,
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        height: 80
    },

    backButton: { marginRight: 10 },

    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginTop: 20
    },

    content: { marginTop: 30, margin: 15 },

    subtitle: {
        fontSize: 15,
        color: '#0c1247',
        lineHeight: 22,
        marginBottom: 30,
    },

    label: {
        fontSize: 14,
        color: '#0c1247',
        marginBottom: 8,
        fontWeight: '500',
    },

    input: {
        borderWidth: 2,
        borderColor: '#0c1247',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#000',
        marginBottom: 25,
        backgroundColor: '#f9f9f9',
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0c1247',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 25,
        backgroundColor: '#f9f9f9',
    },

    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 10,
    },

    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#0c1247"
    },

    buttonText: {
        color: '#0c1247',
        fontSize: 16,
        fontWeight: '600',
    },
});
