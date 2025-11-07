import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message"; // ✅ import Toast

export default function Login({ navigation }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Login handler
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please enter both email and password",
      });
      return;
    }

    try {
      setLoading(true);
      const role = isAdmin ? "Admin" : "Employee";

      const response = await fetch("http://10.0.2.2:3001/App/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: data.message || "Invalid credentials",
        });
        setLoading(false);
        return;
      }

      await AsyncStorage.multiSet([
        ["userRole", data.role],
        ["userEmail", data.user.email],
        ["userName", data.user.firstName || ""],
        ["RELOGIN", JSON.stringify(true)],
      ]);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome ${data.user.firstName || ""}`,
      });

      if (data.role === "Admin") {
        navigation.replace("Categories");
      } else {
        navigation.replace("Employeecategories");
      }

      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while logging in.",
      });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ marginVertical: 60, marginHorizontal: 30 }}>
          <Text style={{ fontSize: 30, color: "#0c1247", fontWeight: "bold", marginBottom: 5 }}>
            Hey there!
          </Text>
          <Text style={{ fontSize: 28, color: "#889783", fontWeight: "bold" }}>
            {isAdmin ? "Admin Login" : "Employee Login"}
          </Text>
        </View>

        {/* Role Toggle */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
          <TouchableOpacity
            onPress={() => setIsAdmin(false)}
            style={{
              backgroundColor: !isAdmin ? "#0c1247" : "white",
              borderWidth: 2,
              borderColor: "#0c1247",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text style={{ color: !isAdmin ? "white" : "#0c1247", fontWeight: "bold" }}>
              Employee Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsAdmin(true)}
            style={{
              backgroundColor: isAdmin ? "#0c1247" : "white",
              borderWidth: 2,
              borderColor: "#0c1247",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: isAdmin ? "white" : "#0c1247", fontWeight: "bold" }}>
              Admin Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={{ alignItems: "center", gap: 25 }}>
          <View style={inputContainerStyle}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#0c1247" style={{ marginRight: 8 }} />
            <TextInput
              style={inputStyle}
              placeholder={isAdmin ? "Admin Email" : "Employee Email"}
              placeholderTextColor="#889783"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={[inputContainerStyle, { justifyContent: "space-between" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <MaterialCommunityIcons name="lock-outline" size={24} color="#0c1247" style={{ marginRight: 8 }} />
              <TextInput
                style={[inputStyle, { flex: 1 }]}
                placeholder={isAdmin ? "Admin Password" : "Employee Password"}
                placeholderTextColor="#889783"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#0c1247"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[buttonStyle, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ color: "#0c1247", fontSize: 20, fontWeight: "bold" }}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View style={{ justifyContent: "center", flexDirection: "row", gap: 5 }}>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "bold", marginBottom: 5 }}>
              New User?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <Text style={{ fontSize: 16, color: "#0c1247", fontWeight: "bold", marginBottom: 5 }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ✅ Styles
const inputContainerStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  width: "80%",
  borderColor: "#0c1247",
  borderWidth: 3,
  borderRadius: 10,
  paddingHorizontal: 10,
  elevation: 10,
  shadowColor: "black",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
};

const inputStyle = {
  flex: 1,
  height: 50,
  fontSize: 18,
  color: "#0c1247",
};

const buttonStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  width: "80%",
  borderColor: "#0c1247",
  borderWidth: 3,
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 10,
  elevation: 10,
  shadowColor: "#0c1247",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 5,
  justifyContent: "center",
};
