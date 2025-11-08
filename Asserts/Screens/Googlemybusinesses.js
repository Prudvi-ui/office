import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Card, Text, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { launchImageLibrary } from "react-native-image-picker";

const STORAGE_KEY = "@clients_data";

export default function Googlemybusinesses() {
  const navigation = useNavigation();

  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [clientProfile, setClientProfile] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setClients(JSON.parse(stored));
      } else {
        const defaultClients = [
          {
            id: "1",
            clientName: "Ramesh Digital Studio",
            amount: "2500",
            date: "2025-11-02",
            clientProfile: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          },
          {
            id: "2",
            clientName: "Suresh Electronics",
            amount: "4000",
            date: "2025-11-05",
            clientProfile: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
          },
          {
            id: "3",
            clientName: "Sai Medicals",
            amount: "3000",
            date: "2025-10-28",
            clientProfile: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
          },
        ];
        setClients(defaultClients);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClients));
      }
    } catch (error) {
      console.log("Error loading clients:", error);
    }
  };

  const saveClients = async (newClients) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
      setClients(newClients);
    } catch (error) {
      console.log("Error saving clients:", error);
    }
  };

  const handleAddOrUpdateClient = () => {
    if (!clientName || !amount || !date) {
      Alert.alert("Please fill in Client Name, Amount, and Date");
      return;
    }

    if (editId) {
      const updated = clients.map((c) =>
        c.id === editId
          ? {
              ...c,
              clientName,
              amount,
              date,
              clientProfile:
                clientProfile || "https://cdn-icons-png.flaticon.com/512/219/219986.png",
            }
          : c
      );
      saveClients(updated);
    } else {
      const newClient = {
        id: Date.now().toString(),
        clientName,
        amount,
        date,
        clientProfile:
          clientProfile || "https://cdn-icons-png.flaticon.com/512/219/219986.png",
      };
      saveClients([...clients, newClient]);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Client", "Are you sure you want to remove this client?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const filtered = clients.filter((c) => c.id !== id);
          saveClients(filtered);
        },
        style: "destructive",
      },
    ]);
  };

  const handleEdit = (item) => {
    setClientName(item.clientName);
    setAmount(item.amount);
    setDate(item.date);
    setClientProfile(item.clientProfile);
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: "photo", quality: 0.7 });
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setClientProfile(result.assets[0].uri);
      }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const resetForm = () => {
    setClientName("");
    setAmount("");
    setDate("");
    setClientProfile("");
    setEditId(null);
    setFormVisible(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.clientProfile }} style={styles.profile} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.clientName}</Text>
          <Text style={styles.amount}>Paid: ₹{item.amount}</Text>
          <Text style={styles.date}>Date: {item.date}</Text>
        </View>
        <IconButton icon="pencil" color="#2e7d32" onPress={() => handleEdit(item)} />
        <IconButton icon="delete-outline" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google My Businesses</Text>

        <TouchableOpacity
          style={{ marginLeft: "auto", marginTop: 20 }}
          onPress={() => setFormVisible(true)}
        >
          <Icon name="plus-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-alert" size={50} color="gray" />
            <Text style={styles.emptyText}>No clients available</Text>
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
                    <Image source={{ uri: clientProfile }} style={styles.profilePreview} />
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

                <Button
                  mode="contained"
                  icon="check"
                  onPress={handleAddOrUpdateClient}
                  style={styles.addButton}
                >
                  {editId ? "Update Client" : "Save Client"}
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
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", padding: 10 },
  profile: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "bold", color: "#2e7d32" },
  amount: { color: "#2e7d32", fontSize: 14, marginTop: 2 },
  date: { color: "#555", fontSize: 13, marginTop: 2 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
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
