import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

export default function SalaryDetailsScreen({ navigation }) {
  const [salary, setSalary] = useState({
    name: "prudvi",
    empId: "EMP1023",
    designation: "Software Developer",
    basicSalary: "18000",
    hra: "10000",
    allowances: "3000",
    deductions: "500",
  });

  const netSalary =
    parseFloat(salary.basicSalary) -
    parseFloat(salary.deductions) +
    parseFloat(salary.allowances);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salary Details</Text>
      </View>

      {/* ✅ KeyboardAvoidingView to handle keyboard push */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Employee Info */}
          <View style={styles.card}>
            <Text style={styles.label}>Employee Name</Text>
            <TextInput style={styles.input} value={salary.name} editable={false} />

            <Text style={styles.label}>Employee ID</Text>
            <TextInput style={styles.input} value={salary.empId} editable={false} />

            <Text style={styles.label}>Designation</Text>
            <TextInput style={styles.input} value={salary.designation} editable={false} />
          </View>

          {/* Salary Breakdown */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Salary Breakdown</Text>

            <Text style={styles.label}>Basic Salary (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={salary.basicSalary}
              onChangeText={(text) => setSalary({ ...salary, basicSalary: text })}
              editable={false}
            />

            <Text style={styles.label}>HRA (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={salary.hra}
              onChangeText={(text) => setSalary({ ...salary, hra: text })}
              editable={false}
            />

            <Text style={styles.label}>Allowances (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={salary.allowances}
              onChangeText={(text) => setSalary({ ...salary, allowances: text })}
              editable={false}
            />

            <Text style={styles.label}>Deductions (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={salary.deductions}
              onChangeText={(text) => setSalary({ ...salary, deductions: text })}
              editable={false}
            />
          </View>

          {/* Net Salary */}
          <View style={styles.netCard}>
            <Text style={styles.netTitle}>Net Salary</Text>
            <Text style={styles.netAmount}>₹{netSalary}</Text>
          </View>

          {/* Download Button */}
          <TouchableOpacity>
            <LinearGradient
              colors={["#E77D41", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.downloadBtn}
            >
              <Icon name="file-pdf-box" size={22} color="#fff" />
              <Text style={styles.downloadText}>Download Payslip</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0c1247",
    padding: 15,
    height: 80,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 20,
  },
  scroll: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#0c1247",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E86C1",
    marginBottom: 10,
  },
  netCard: {
    backgroundColor: "#0c1247",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  netTitle: {
    color: "#fff",
    fontSize: 16,
  },
  netAmount: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 5,
  },
  downloadBtn: {
    flexDirection: "row",
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0c1247",
    marginBottom: 30,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
