import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Card, Text, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const STORAGE_KEY = "@ssl_list";

export default function SSLdetails() {
  const navigation = useNavigation();

  const [sslList, setSslList] = useState([]);
  const [sslName, setSslName] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("");
  const [expiration, setExpiration] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadSSLs();
  }, []);

  const loadSSLs = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSslList(JSON.parse(stored));
      } else {
        const defaultSSLs = [
          {
            id: "1",
            sslName: "example.com SSL",
            provider: "GoDaddy",
            status: "Active",
            expiration: "2025-12-20",
          },
          {
            id: "2",
            sslName: "mybusiness.in SSL",
            provider: "Namecheap",
            status: "Expired",
            expiration: "2024-09-14",
          },
        ];
        setSslList(defaultSSLs);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSSLs));
      }
    } catch (error) {
      console.log("Error loading SSLs:", error);
    }
  };

  const saveSSLs = async (newSSLs) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSSLs));
      setSslList(newSSLs);
    } catch (error) {
      console.log("Error saving SSLs:", error);
    }
  };

  const handleAddOrUpdate = () => {
    if (!sslName || !provider || !status || !expiration) {
      Toast.show({
        type: "error",
        text1: "Missing Fields ⚠️",
        text2: "Please fill in all fields before saving.",
      });
      return;
    }

    if (editId) {
      const updated = sslList.map((s) =>
        s.id === editId ? { ...s, sslName, provider, status, expiration } : s
      );
      saveSSLs(updated);

      Toast.show({
        type: "success",
        text1: "SSL Updated 🔒",
        text2: "SSL details have been updated successfully.",
      });
    } else {
      const newSSL = {
        id: Date.now().toString(),
        sslName,
        provider,
        status,
        expiration,
      };
      saveSSLs([...sslList, newSSL]);

      Toast.show({
        type: "success",
        text1: "SSL Added ✅",
        text2: "New SSL certificate has been added successfully.",
      });
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setSslName(item.sslName);
    setProvider(item.provider);
    setStatus(item.status);
    setExpiration(item.expiration);
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete SSL", "Are you sure you want to delete this SSL?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const filtered = sslList.filter((s) => s.id !== id);
          saveSSLs(filtered);
        },
      },
    ]);
  };

  const resetForm = () => {
    setSslName("");
    setProvider("");
    setStatus("");
    setExpiration("");
    setEditId(null);
    setFormVisible(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.sslName}</Text>
          <Text>Provider: {item.provider}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Expiration: {item.expiration}</Text>
        </View>
        <IconButton icon="pencil" color="#0c6c3a" onPress={() => handleEdit(item)} />
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
        <Text style={styles.headerTitle}>SSL Details</Text>
        <TouchableOpacity
          style={{ marginLeft: "auto", marginTop: 20 }}
          onPress={() => setFormVisible(true)}
        >
          <Icon name="plus-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SSL List */}
      <FlatList
        data={sslList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle-outline" size={50} color="gray" />
            <Text style={styles.emptyText}>No SSL certificates available</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Add/Edit Form Modal */}
      <Modal visible={formVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.formContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
              <View style={styles.form}>
                <TextInput
                  label="SSL Name"
                  value={sslName}
                  onChangeText={setSslName}
                  mode="outlined"
                  style={styles.input}
                />

                <TextInput
                  label="Provider"
                  value={provider}
                  onChangeText={setProvider}
                  mode="outlined"
                  placeholder="e.g., GoDaddy, Namecheap, Google Trust"
                  style={styles.input}
                />

                <TextInput
                  label="Status"
                  value={status}
                  onChangeText={setStatus}
                  mode="outlined"
                  placeholder="e.g., Active, Expired, Pending"
                  style={styles.input}
                />

                <TouchableOpacity onPress={() => setCalendarVisible(true)}>
                  <TextInput
                    label="Expiration Date"
                    value={expiration}
                    mode="outlined"
                    editable={false}
                    style={styles.input}
                    right={<TextInput.Icon icon="calendar" />}
                  />
                </TouchableOpacity>

                <Button
                  mode="contained"
                  icon="check"
                  onPress={handleAddOrUpdate}
                  style={styles.addButton}
                >
                  {editId ? "Update SSL" : "Save SSL"}
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
                setExpiration(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={{
                [expiration]: { selected: true, marked: true, selectedColor: "#0c6c3a" },
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
  container: { flex: 1, backgroundColor: "white" },
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
  name: { fontSize: 16, fontWeight: "bold", color: "#0c6c3a" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 10, color: "gray" },
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
