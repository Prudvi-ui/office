import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployeeScreen = ({navigation}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultEmployees = [
    {
      'Emp Id': 'EMP1001',
      'Emp Name': 'John Doe',
      'Emp Role': 'Software Engineer',
      'Contact No': '+91 9876543210',
      'Added On': new Date().toLocaleString(),
      profileImage: null,
    },
    {
      'Emp Id': 'EMP1002',
      'Emp Name': 'Priya Sharma',
      'Emp Role': 'UI/UX Designer',
      'Contact No': '+91 9988776655',
      'Added On': new Date().toLocaleString(),
      profileImage: null,
    },
    {
      'Emp Id': 'EMP1003',
      'Emp Name': 'Amit Verma',
      'Emp Role': 'Project Manager',
      'Contact No': '+91 9123456780',
      'Added On': new Date().toLocaleString(),
      profileImage: null,
    },
    {
      'Emp Id': 'EMP1004',
      'Emp Name': 'Sara Khan',
      'Emp Role': 'QA Tester',
      'Contact No': '+91 9090909090',
      'Added On': new Date().toLocaleString(),
      profileImage: null,
    },
  ];

  const loadEmployees = async () => {
    try {
      const data = await AsyncStorage.getItem('Employees');

      if (!data) {
        // ✅ No data found → save and show defaults
        await AsyncStorage.setItem('Employees', JSON.stringify(defaultEmployees));
        setEmployees(defaultEmployees);
      } else {
        const parsed = JSON.parse(data);
        // ✅ If data exists but empty array → show defaults
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmployees(parsed);
        } else {
          await AsyncStorage.setItem('Employees', JSON.stringify(defaultEmployees));
          setEmployees(defaultEmployees);
        }
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees(defaultEmployees); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const renderEmployee = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate("SingleEmployee")}>
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : require('../Images/Profile1.png')
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item['Emp Name']}</Text>
        <Text style={styles.role}>{item['Emp Role']}</Text>
        <Text style={styles.details}>ID: {item['Emp Id']}</Text>
        <Text style={styles.details}>Contact: {item['Contact No']}</Text>
        <Text style={styles.date}>Added On: {item['Added On']}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading employees...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Tasks</Text>
        <View style={{ width: 26 }} />
      </View>
      {employees.length === 0 ? (
        <Text style={styles.noData}>No employees found</Text>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item['Emp Id']}
          renderItem={renderEmployee}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.reloadButton} onPress={loadEmployees}>
        <Text style={styles.reloadText}>Reload Employees</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001F54' },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001F54',
    paddingVertical: 14,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginTop:20
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  role: { fontSize: 14, color: '#666', marginBottom: 4 },
  details: { fontSize: 13, color: '#555' },
  date: { fontSize: 12, color: '#888', marginTop: 3 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noData: { textAlign: 'center', color: 'gray', marginTop: 20 },
  reloadButton: {
    backgroundColor: '#fff',
    padding: 12,
    margin: 20,
    borderRadius: 10,
  },
  reloadText: { color: '#001F54', fontWeight: '600', textAlign: 'center' },
});

export default EmployeeScreen;
