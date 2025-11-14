import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployeeProfile = ({ navigation }) => {
  const employee = {
    name: 'prudvi',
    email: 'prudvi@example.com',
    empId: 'EMP1023',
    empRole: 'Software Develper',
    contactNo: '+91 9876543210',
    salary: '₹ 18,000',
    pfAmount: '₹ 18,00',
    esiAmount: '₹ 186',
    monthlyAttendance: '28 Days',
    paidLeaves: '2 Days',
    unpaidLeaves: '0 Days',
    netTakePro: '₹15,965',
    joiningDate: 'October 03, 2022',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with Back Arrow */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Profile</Text>
        <View style={{ width: 28 }} /> {/* spacer to balance layout */}
      </View>

      <ScrollView>
        {/* Profile Header */}

        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: "center", left: 26 }}>
            <Image source={{ uri: employee.image }} style={styles.profileImage} />
            <TouchableOpacity style={{ alignItems: 'flex-end', margin: 10 }} onPress={() => navigation.navigate("SingleEmployee")}>
              <Icon
                name={"pencil"}
                size={24}
                color="#0c1247"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.email}>{employee.email}</Text>
        </View>

        {/* Personal Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Employee Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Emp ID</Text>
            <Text style={styles.value}>{employee.empId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Emp Role</Text>
            <Text style={styles.value}>{employee.empRole}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Contact No</Text>
            <Text style={styles.value}>{employee.contactNo}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Salary</Text>
            <Text style={styles.value}>{employee.salary}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>PF Amount</Text>
            <Text style={styles.value}>{employee.pfAmount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>ESI Amount</Text>
            <Text style={styles.value}>{employee.esiAmount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Monthly Attendance</Text>
            <Text style={styles.value}>{employee.monthlyAttendance}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Paid Leaves Per Month</Text>
            <Text style={styles.value}>{employee.paidLeaves}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Unpaid Leaves</Text>
            <Text style={styles.value}>{employee.unpaidLeaves}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Net Take Pro</Text>
            <Text style={styles.value}>{employee.netTakePro}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Joining Date</Text>
            <Text style={styles.value}>{employee.joiningDate}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#0c1247',
    height: 80,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    paddingTop: 10,

  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c1247',
  },
  email: {
    fontSize: 14,
    color: '#0c1247',
    marginTop: 3,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    borderWidth: 3,
    borderColor: '#0c1247'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c1247',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  label: {
    color: '#0c1247',
    fontSize: 14,
  },
  value: {
    color: '#0c1247',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmployeeProfile;
