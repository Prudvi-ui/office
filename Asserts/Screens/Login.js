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
import Toast from "react-native-toast-message";

export default function Login({ navigation }) {
  const [role, setRole] = useState("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim() || !role) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please enter email, password, and select your role.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://10.0.2.2:3001/App/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: data?.message || "Invalid credentials or role mismatch.",
        });
        return;
      }

      await AsyncStorage.multiSet([
        ["userRole", data.role],
        ["userEmail", data.user?.email || ""],
        ["userName", data.user?.firstName || ""],
        ["RELOGIN", JSON.stringify(true)],
      ]);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome ${data.user?.firstName || "User"}!`,
      });

      if (data.role === "Admin") {
        navigation.replace("Categories");
        await AsyncStorage.setItem("role", data.role)
      } else if (data.role === "Employee") {
        navigation.replace("Employeecategories");
        await AsyncStorage.setItem("role", data.role)
      } else if (data.role === "Referral") {
        navigation.replace("Referralhome");
        await AsyncStorage.setItem("role",data.role)

      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* 🔥 TOP ROLE TABS */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-around",
              paddingVertical: 10,
              backgroundColor: "#fff",
              borderRadius: 10,
            }}
          >
            {["Employee", "Admin", "Referral"].map((item) => (
              <TouchableOpacity key={item} onPress={() => setRole(item)}>
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    fontWeight: "bold",
                    color: role === item ? "white" : "#0c1247",
                    backgroundColor: role === item ? "#0c1247" : "transparent",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ marginVertical: 60, marginHorizontal: 30 }}>
            <Text style={{ fontSize: 30, color: "#0c1247", fontWeight: "bold" }}>
              Hey there!
            </Text>
            <Text
              style={{
                fontSize: 28,
                color: "#889783",
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              {role} Login
            </Text>
          </View>

          {/* 🔥 INPUTS */}
          <View style={{ alignItems: "center", gap: 25 }}>
            <View style={inputContainerStyle}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#0c1247" />
              <TextInput
                style={inputStyle}
                placeholder={`${role} Email`}
                placeholderTextColor="#889783"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[inputContainerStyle, { justifyContent: "space-between" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <MaterialCommunityIcons name="lock-outline" size={24} color="#0c1247" />
                <TextInput
                  style={[inputStyle, { flex: 1 }]}
                  placeholder={`${role} Password`}
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

            {/* 🔥 LOGIN BUTTON */}
            <TouchableOpacity
              style={[buttonStyle, { opacity: loading ? 0.6 : 1 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={{ color: "#0c1247", fontSize: 20, fontWeight: "bold" }}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            {/* SIGNUP */}
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
                New User?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                <Text style={{ fontSize: 16, color: "#0c1247", fontWeight: "bold" }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

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
};

const inputStyle = {
  flex: 1,
  height: 50,
  fontSize: 18,
  color: "#0c1247",
};

const buttonStyle = {
  backgroundColor: "white",
  width: "80%",
  borderColor: "#0c1247",
  borderWidth: 3,
  borderRadius: 10,
  paddingVertical: 10,
  justifyContent: "center",
  alignItems: "center",
  elevation: 10,
};
