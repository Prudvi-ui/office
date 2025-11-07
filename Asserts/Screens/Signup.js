import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    PermissionsAndroid,
    StatusBar,  // ✅ just add this here
} from "react-native";
import Toast from "react-native-toast-message";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const RegisterScreen = ({ navigation }) => {
    const [profilePic, setProfilePic] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChoosePhoto = async () => {
        Alert.alert('Select Image', 'Choose an option', [
            {
                text: 'Camera',
                onPress: async () => {
                    if (Platform.OS === 'android') {
                        try {
                            const granted = await PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.CAMERA,
                                {
                                    title: 'Camera Permission',
                                    message: 'We need access to your camera to take pictures.',
                                    buttonNeutral: 'Ask Me Later',
                                    buttonNegative: 'Cancel',
                                    buttonPositive: 'OK',
                                }
                            );

                            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                                Alert.alert('Permission Denied', 'Camera access is required.');
                                return;
                            }
                        } catch (err) {
                            console.warn(err);
                            return;
                        }
                    }

                    // ✅ Open camera
                    launchCamera(
                        {
                            mediaType: 'photo',
                            saveToPhotos: true,
                            includeBase64: false,
                        },
                        (response) => {
                            if (response.didCancel) {
                                console.log('User cancelled image picker');
                            } else if (response.errorCode) {
                                console.log('ImagePicker Error:', response.errorMessage);
                            } else {
                                const uri = response.assets?.[0]?.uri;
                                if (uri) setProfilePic(uri);
                            }
                        }
                    );
                },
            },
            {
                text: 'Gallery',
                onPress: () => {
                    launchImageLibrary(
                        { mediaType: 'photo', includeBase64: false },
                        (response) => {
                            if (!response.didCancel && !response.errorCode) {
                                const uri = response.assets?.[0]?.uri;
                                if (uri) setProfilePic(uri);
                            }
                        }
                    );
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleRegister = async () => {
        if (!name || !email || !role || !phonenumber || !password || !confirmPassword) {
            Toast.show({
                type: "error",
                text1: "⚠️ Missing Fields",
                text2: "Please fill in all fields.",
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Password Mismatch",
                text2: "Passwords do not match.",
            });
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("firstName", name);
            formData.append("email", email);
            formData.append("role", role);
            formData.append("mobileNumber", phonenumber);
            formData.append("password", password);

            if (profilePic) {
                formData.append("profilePicture", {
                    uri: profilePic,
                    name: "profile.jpg",
                    type: "image/jpeg",
                });
            }

            const response = await fetch("http://10.0.2.2:3001/App/user/register", {
                method: "POST",
                body: formData,
            });

            let data;
            try {
                data = await response.json();
            } catch (err) {
                const text = await response.text();
                console.log("Invalid JSON response:", text);
                throw new Error("Invalid JSON from server");
            }

            setLoading(false);

            if (response.ok && data.success) {
                Toast.show({
                    type: "success",
                    text1: "✅ Account Created",
                    text2: "Your account has been created successfully!",
                });
                setTimeout(() => navigation.navigate("Login"), 1200);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Registration Failed",
                    text2: data.message || "Something went wrong.",
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);
            Toast.show({
                type: "error",
                text1: "Network Error",
                text2: "Please try again later.",
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Register</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Create Account</Text>

                    <TouchableOpacity onPress={handleChoosePhoto} style={styles.imageContainer}>
                        {profilePic ? (
                            <Image source={{ uri: profilePic.uri }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Icon name="camera-plus" size={32} color="#4CAF50" />
                                <Text style={styles.placeholderText}>Upload Profile Picture</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Role (e.g. Developer, Manager)"
                        value={role}
                        onChangeText={setRole}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phonenumber}
                        onChangeText={setPhonenumber}
                        keyboardType="phone-pad"
                        placeholderTextColor="#888"
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#888"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon
                                name={showPassword ? "eye-off" : "eye"}
                                size={22}
                                color="#0c1247"
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholderTextColor="#888"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Icon
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={22}
                                color="#0c1247"
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.7 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#0c1247" />
                        ) : (
                            <Text style={styles.buttonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginText}>
                            Already have an account? <Text style={styles.link}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    header: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 15 },
    backButton: { marginRight: 10, marginTop: 25 },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "black", marginTop: 25 },
    container: { flexGrow: 1, alignItems: "center", padding: 20 },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#333" },
    imageContainer: { alignItems: "center", marginBottom: 20 },
    profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: "#4CAF50" },
    placeholder: {
        width: 110, height: 110, borderRadius: 55, borderWidth: 2,
        borderColor: "#4CAF50", justifyContent: "center", alignItems: "center",
    },
    placeholderText: { color: "#4CAF50", fontSize: 12, textAlign: "center" },
    input: {
        borderColor: "#0c1247", borderWidth: 2, borderRadius: 10, padding: 12,
        marginBottom: 15, fontSize: 16, width: "100%", color: "#000",
    },
    passwordContainer: {
        flexDirection: "row", alignItems: "center", borderColor: "#0c1247",
        borderWidth: 2, borderRadius: 10, paddingHorizontal: 10, marginBottom: 15, width: "100%",
    },
    button: {
        flexDirection: "row", alignItems: "center", backgroundColor: "white",
        width: "80%", borderColor: "#0c1247", borderWidth: 3, borderRadius: 10,
        paddingVertical: 10, justifyContent: "center", marginTop: 20, elevation: 8,
    },
    buttonText: { color: "#0c1247", fontSize: 18, fontWeight: "bold" },
    loginText: { textAlign: "center", marginTop: 20, color: "#333" },
    link: { color: "#4CAF50", fontWeight: "bold" },
});
