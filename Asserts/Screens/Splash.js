import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Image, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";

const Splash = ({ navigation }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const checkLoginStatus = async () => {
      try {
        // Small delay ensures AsyncStorage is ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        const login = await AsyncStorage.getItem("RELOGIN");
        const parsedLogin = JSON.parse(login);
        const role = await AsyncStorage.getItem("userRole");

        // Animate splash logo
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        // Wait a bit before navigation
        setTimeout(() => {
          if (!isMounted) return;

          if (parsedLogin) {
            if (role === "Admin") {
              navigation.replace("Categories");
            } else if (role === "Employee") {
              navigation.replace("Employeecategories");
            } else if (role === "Referral") {
              navigation.replace("Referralhome");
            } else {
              navigation.replace("Login");
            }
          } else {
            navigation.replace("Login");
          }
        }, 1800);
      } catch (error) {
        console.log("Error checking login:", error);
        navigation.replace("Login");
      }
    };

    checkLoginStatus();

    return () => {
      isMounted = false;
    };
  }, [navigation, scaleValue]);

  return (
    <LinearGradient colors={["#0c1247", "#0c1247"]} style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <Image
          source={require("../Images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoContainer: {
    width: "60%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 300, height: 300, borderRadius: 150 },
});

export default Splash;
