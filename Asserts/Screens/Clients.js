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
          role === 'admin'
            ? allClients
            : allClients.filter(client => client.createdBy === ClientName);

        setClients(filtered);
        setFilteredClients(filtered); // set initial display list
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleUpdateClientField = (clientId, field, value) => {
    const updatedClients = clients.map((client) => {
      if (client['Client Id'] === clientId) {
        return { ...client, [field]: value };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const deleteClient = (clientId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this client?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = clients.filter(client => client['Client Id'] !== clientId);
            await AsyncStorage.setItem('Clients', JSON.stringify(updated));
            setClients(updated);
          } catch (error) {
            console.error('Delete error:', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Client Name</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={item['Client Name']}
            placeholder="Enter client name"
            style={styles.input}
            editable={userRole === 'admin'}
            onChangeText={(text) =>
              handleUpdateClientField(item['Client Id'], 'Client Name', text)
            }
          />
          {userRole === 'admin' && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('SingleClient', { client: item })}
            >
              <Icon name="pencil" size={24} color="#0C1247" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Contact No</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={item['Contact No']}
            placeholder="Enter contact number"
            style={styles.input}
            editable={userRole === 'admin'}
            onChangeText={(text) =>
              handleUpdateClientField(item['Client Id'], 'Contact No', text)
            }
          />
          {userRole === 'admin' && (
            <TouchableOpacity onPress={() => deleteClient(item['Client Id'])}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginBottom:20}}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clients List</Text>
        {userRole === 'admin' && (
          <TouchableOpacity onPress={() => navigation.navigate('SingleClient')} style={{marginBottom:20}}>
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
    marginBottom:10
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom:20
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
