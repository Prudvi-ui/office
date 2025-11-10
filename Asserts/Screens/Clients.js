import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import Toast from "react-native-toast-message";

export default function ClientsList({ navigation }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadClients);
    return unsubscribe;
  }, [navigation]);

  const loadClients = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const ClientName = await AsyncStorage.getItem('ClientName');
      const data = await AsyncStorage.getItem('Clients');

      setUserRole(role);
      setEmployeeName(ClientName);

      if (data) {
        const allClients = JSON.parse(data);
        const filtered =
          role === 'Admin'
            ? allClients
            : allClients.filter(client => client.createdBy === ClientName);

        setClients(filtered);
        setFilteredClients(filtered);
      } else {
        const defaultClients = [
          {
            'Client Id': '1',
            'Client Name': 'ABC Traders',
            'Contact No': '9876543210',
            createdBy: 'Admin',
          },
          {
            'Client Id': '2',
            'Client Name': 'Green Mart',
            'Contact No': '9123456780',
            createdBy: 'Admin',
          },
          {
            'Client Id': '3',
            'Client Name': 'Blue Sky Enterprises',
            'Contact No': '9988776655',
            createdBy: 'Admin',
          },
        ];
        await AsyncStorage.setItem('Clients', JSON.stringify(defaultClients));
        setClients(defaultClients);
        setFilteredClients(defaultClients);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleUpdateClientField = (clientId, field, value) => {
    const updatedClients = clients.map(client =>
      client['Client Id'] === clientId ? { ...client, [field]: value } : client
    );
    setClients(updatedClients);
  };

  const deleteClient = (clientId) => {
    // ⚠️ Step 1: Ask for delete confirmation via toast
    Toast.show({
      type: 'info',
      text1: 'Confirm Delete',
      text2: 'Deleting this client in 2 seconds... ⏳',
      position: 'bottom',
    });

    // Step 2: Wait briefly before deleting (simulating confirmation)
    setTimeout(async () => {
      try {
        const updated = clients.filter(client => client['Client Id'] !== clientId);
        await AsyncStorage.setItem('Clients', JSON.stringify(updated));
        setClients(updated);
        setFilteredClients(updated);

        // ✅ Success toast
        Toast.show({
          type: 'success',
          text1: 'Deleted',
          text2: 'Client deleted successfully 🗑️',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Delete error:', error);

        // ❌ Error toast
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete client ❌',
          position: 'bottom',
        });
      }
    }, 2000);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Client Name</Text>
        <TextInput
          value={item['Client Name']}
          style={styles.input}
          editable={false}
        />

        <Text style={styles.label}>Contact No</Text>
        <TextInput
          value={item['Contact No']}
          style={styles.input}
          editable={false}
        />

        {userRole === 'Admin' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('SingleClient', { client: item })}
            >
              <Icon name="pencil" size={22} color="#fff" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteClient(item['Client Id'])}
            >
              <Icon name="delete" size={22} color="#fff" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client['Client Name'].toLowerCase().includes(searchText.toLowerCase()) ||
        client['Contact No'].toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchText, clients]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clients List</Text>
        {userRole === 'Admin' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('SingleClient')}
            style={{ marginBottom: 20 }}
          >
            <Icon name="plus-circle" size={30} color="#FF5C00" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#0c1247" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item['Client Id']}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No clients found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#001F54',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0c1247',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#0c1247',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    color: '#0C1247',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1247',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
});
