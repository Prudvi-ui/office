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

const STORAGE_KEY = "@domains_list";

export default function Domaindetails() {
  const navigation = useNavigation();

  const [domains, setDomains] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [status, setStatus] = useState("");
  const [expiration, setExpiration] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDomains(JSON.parse(stored));
      } else {
        const defaultDomains = [
          { id: "1", domainName: "example.com", status: "Active", expiration: "2025-12-20" },
          { id: "2", domainName: "mybusiness.in", status: "Expired", expiration: "2024-09-14" },
        ];
        setDomains(defaultDomains);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDomains));
      }
    } catch (error) {
      console.log("Error loading domains:", error);
    }
  };

  const saveDomains = async (newDomains) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDomains));
      setDomains(newDomains);
    } catch (error) {
      console.log("Error saving domains:", error);
    }
  };

  const handleAddOrUpdate = () => {
    if (!domainName || !status || !expiration) {
      // ⚠️ Validation toast
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields.',
        position: 'bottom',
      });
      return;
    }

    if (editId) {
      const updated = domains.map((d) =>
        d.id === editId ? { ...d, domainName, status, expiration } : d
      );
      saveDomains(updated);

      // ✏️ Update success toast
      Toast.show({
        type: 'success',
        text1: 'Domain Updated',
        text2: 'Domain details updated successfully! ✅',
        position: 'bottom',
      });
    } else {
      const newDomain = {
        id: Date.now().toString(),
        domainName,
        status,
        expiration,
      };
      saveDomains([...domains, newDomain]);

      // 🆕 Add success toast
      Toast.show({
        type: 'success',
        text1: 'Domain Added',
        text2: 'New domain added successfully! 🎉',
        position: 'bottom',
      });
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setDomainName(item.domainName);
    setStatus(item.status);
    setExpiration(item.expiration);
    setEditId(item.id);
    setFormVisible(true);
  };

const handleDelete = (id) => {
  // ⚠️ Confirmation-style toast
  Toast.show({
    type: 'info',
    text1: 'Deleting Domain',
    text2: 'Domain will be deleted in 2 seconds... ⏳',
    position: 'bottom',
  });

  setTimeout(async () => {
    const filtered = domains.filter((d) => d.id !== id);
    saveDomains(filtered);

    // ✅ Success toast
    Toast.show({
      type: 'success',
      text1: 'Domain Deleted',
      text2: 'Domain removed successfully 🗑️',
      position: 'bottom',
    });
  }, 2000);
};


  const resetForm = () => {
    setDomainName("");
    setStatus("");
    setExpiration("");
    setEditId(null);
    setFormVisible(false);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.domainName}</Text>
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
        <Text style={styles.headerTitle}>Domain Manager</Text>
        <TouchableOpacity
          style={{ marginLeft: "auto", marginTop: 20 }}
          onPress={() => setFormVisible(true)}
        >
          <Icon name="plus-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Domain List */}
      <FlatList
        data={domains}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle-outline" size={50} color="gray" />
            <Text style={styles.emptyText}>No domains available</Text>
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
                  label="Domain Name"
                  value={domainName}
                  onChangeText={setDomainName}
                  mode="outlined"
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
                  {editId ? "Update Domain" : "Save Domain"}
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
