import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CalendarWithHolidays({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Holiday/Festival list
  const holidays = [
    { id: 1, name: 'New Year', date: '2025-01-01' },
    { id: 2, name: 'Makar Sankranti', date: '2025-01-14' },
    { id: 3, name: 'Republic Day', date: '2025-01-26' },
    { id: 4, name: 'Holi', date: '2025-03-14' },
    { id: 5, name: 'Ram Navami', date: '2025-04-06' },
    { id: 6, name: 'Independence Day', date: '2025-08-15' },
    { id: 7, name: 'Ganesh Chaturthi', date: '2025-09-07' },
    { id: 8, name: 'Dussehra', date: '2025-10-02' },
    { id: 9, name: 'Diwali', date: '2025-10-20' },
    { id: 10, name: 'Christmas', date: '2025-12-25' },
  ];

  // Filter holidays by selected month
  const filteredHolidays = holidays.filter(
    (item) => new Date(item.date).getMonth() + 1 === selectedMonth
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={{ marginTop: 20 }}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Festival & Holidays</Text>
        <View style={{ width: 26 }} /> {/* for balance */}
      </View>

      {/* Calendar at top */}
      <Calendar
        onMonthChange={(month) => setSelectedMonth(month.month)}
        theme={{
          selectedDayBackgroundColor: '#0c1247',
          todayTextColor: '#0c1247',
          arrowColor: '#0c1247',
          monthTextColor: '#0c1247',
          dayTextColor: '#0c1247'

        }}
        style={styles.calendar}
      />

      {/* Holiday List at bottom */}
      <View style={styles.holidayContainer}>
        <Text style={styles.subHeader}>
          {filteredHolidays.length > 0
            ? `Festivals & Holidays in ${new Date(2025, selectedMonth - 1).toLocaleString('default', {
              month: 'long',
            })}`
            : 'No Holidays This Month'}
        </Text>

        <FlatList
          data={filteredHolidays}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.holidayName}>{item.name}</Text>
              <Text style={styles.holidayDate}>
                {new Date(item.date).toDateString()}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#001F54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 80

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20
  },
  calendar: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 2,
    borderColor: '#0c1247',
    borderWidth: 2,
    borderRadius: 10,
    color: '#0c1247'
  },
  holidayContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  subHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: '#001F54',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#0c1247'
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  holidayDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
});
