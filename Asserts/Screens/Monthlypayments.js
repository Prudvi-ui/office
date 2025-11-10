import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { TextInput, Button, Card, Text, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";

const STORAGE_KEY = "@monthly_payments";

export default function MonthlyPayments() {
  const navigation = useNavigation();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientProfile, setClientProfile] = useState("");
  const [payments, setPayments] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editId, setEditId] = useState(null); // 👈 store editing item id

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setPayments(JSON.parse(stored));
    } catch (error) {
      console.log("Error loading payments:", error);
    }
  };

  const savePayments = async (newPayments) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPayments));
      setPayments(newPayments);
    } catch (error) {
      console.log("Error saving payments:", error);
    }
  };

  const handleAddOrUpdatePayment = () => {
    if (!amount || !date || !clientName) {
      Toast.show({
        type: "error",
        text1: "Missing Fields ⚠️",
        text2: "Please fill in Client Name, Amount, and Date.",
      });
      return;
    }

    if (editId) {
      // ✏️ Update existing payment
      const updated = payments.map((p) =>
        p.id === editId
          ? {
            ...p,
            clientName,
            clientProfile:
              clientProfile ||
              "https://cdn-icons-png.flaticon.com/512/219/219986.png",
            amount,
            note,
            date,
          }
          : p
      );
      savePayments(updated);

      Toast.show({
        type: "success",
        text1: "Payment Updated ✅",
        text2: "Payment details have been updated successfully.",
      });
    } else {
      // ➕ Add new payment
      const newPayment = {
        id: Date.now().toString(),
        clientName,
        clientProfile:
          clientProfile ||
          "https://cdn-icons-png.flaticon.com/512/219/219986.png",
        amount,
        note,
        date,
      };
      savePayments([...payments, newPayment]);

      Toast.show({
        type: "success",
        text1: "Payment Added 💰",
        text2: "New payment has been added successfully.",
      });
    }

    // Reset form
    resetForm();
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Payment", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          const filtered = payments.filter((p) => p.id !== id);
          savePayments(filtered);
        },
        style: "destructive",
      },
    ]);
  };

  const handleEdit = (item) => {
    // Prefill form fields with selected card
    setClientName(item.clientName);
    setClientProfile(item.clientProfile);
    setAmount(item.amount);
    setNote(item.note);
    setDate(item.date);
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.7,
      });

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setClientProfile(result.assets[0].uri);
      }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientProfile("");
    setAmount("");
    setNote("");
    setDate("");
    setEditId(null);
    setFormVisible(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.clientRow}>
        <Image source={{ uri: item.clientProfile }} style={styles.profileImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.clientSubText}>Date: {item.date}</Text>
        </View>
        <IconButton icon="pencil" color="red" onPress={() => handleEdit(item)} />
        <IconButton
          icon="delete-outline"
          color="red"
          onPress={() => handleDelete(item.id)}
        />
      </View>

      <Card.Content>
        <Text style={styles.amountText}>₹{item.amount}</Text>
        {item.note ? <Text style={styles.noteText}>Note: {item.note}</Text> : null}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Payments</Text>

        <TouchableOpacity
          style={{ marginLeft: "auto", marginTop: 20 }}
          onPress={() => setFormVisible(true)}
        >
          <Icon name="plus-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="cash-remove" size={50} color="gray" />
            <Text style={styles.emptyText}>No payments recorded yet</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Form Modal */}
      <Modal visible={formVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.formContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
              <View style={styles.form}>
                <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
                  {clientProfile ? (
                    <Image
                      source={{ uri: clientProfile }}
                      style={styles.profilePreview}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Icon name="camera" size={28} color="#777" />
                      <Text style={{ color: "#777", marginTop: 4 }}>Select Image</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TextInput
                  label="Client Name"
                  value={clientName}
                  onChangeText={setClientName}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Amount (₹)"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                />

                <TouchableOpacity onPress={() => setCalendarVisible(true)}>
                  <TextInput
                    label="Select Date"
                    value={date}
                    mode="outlined"
                    style={styles.input}
                    editable={false}
                    right={<TextInput.Icon icon="calendar" />}
                  />
                </TouchableOpacity>

                <TextInput
                  label="Note (optional)"
                  value={note}
                  onChangeText={setNote}
                  mode="outlined"
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  icon="check"
                  onPress={handleAddOrUpdatePayment}
                  style={styles.addButton}
                >
                  {editId ? "Update Payment" : "Save Payment"}
                </Button>

                <Button onPress={resetForm} style={{ marginTop: 10 }} textColor="red">
                  Cancel
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => {
                setDate(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={{
                [date]: { selected: true, marked: true, selectedColor: "#2e7d32" },
              }}
            />
            <Button onPress={() => setCalendarVisible(false)} style={{ marginTop: 10 }}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0c1247" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0c1247",
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 5,
  },
  backButton: { marginRight: 10, padding: 4, marginTop: 20 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 20 },
  card: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  clientRow: { flexDirection: "row", alignItems: "center", padding: 10 },
  profileImage: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  clientName: { fontSize: 16, fontWeight: "bold", color: "#2e7d32" },
  clientSubText: { color: "#777", fontSize: 13 },
  amountText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  noteText: { color: "#555", marginTop: 4 },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { marginTop: 10, color: "gray" },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  profilePreview: { width: 100, height: 100, borderRadius: 50 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    elevation: 5,
  },
  form: { marginTop: 10, marginBottom: 10 },
  input: { marginBottom: 10 },
  addButton: { backgroundColor: "#e49841ff", borderRadius: 8 },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    elevation: 5,
  },
});
