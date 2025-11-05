import React ,{useCallback}from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function CategoriesScreen({ navigation }) {
  const categories = [
    { id: 1, name: 'Employee Profile', icon: 'account-tie', nav: 'Epmprofile' },
    { id: 2, name: 'Attendance', icon: 'calendar-account', nav: 'Employeeattendance' },
    { id: 3, name: 'Leave Management', icon: 'calendar-clock', nav: 'Leaverequest' },
    { id: 4, name: 'Projects', icon: 'folder-account', nav: 'Projects' },
    { id: 5, name: 'Tasks', icon: 'clipboard-check-outline', nav: 'Emptasks' },
    // { id: 6, name: 'Salary Details', icon: 'cash-multiple', nav: 'SalaryDetails' },
    // { id: 7, name: 'Team', icon: 'account-group', nav: 'TeamList' },
    { id: 8, name: 'Holidays', icon: 'calendar-star', nav: 'holiday' },
    { id: 9, name: 'Notices', icon: 'bullhorn-outline', nav: 'Notices' },
    { id: 10, name: 'Support', icon: 'headset', nav: 'Support' },
    { id: 11, name: 'Performance', icon: 'chart-line', nav: 'Performance' },
    { id: 12, name: 'Settings', icon: 'cog-outline', nav: 'Settings' },
  ];
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Alert.alert('Exit App', 'Are you sure you want to exit?', [
                //     { text: 'Cancel', style: 'cancel' },
                //     { text: 'Yes', onPress: () => BackHandler.exitApp() },
                // ]);
                BackHandler.exitApp()
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => backHandler.remove();
        }, [])
    );
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#001F54" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Categories</Text>
        <Text style={styles.headerTitle}></Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate(item.nav)}
              activeOpacity={0.8}>
              <Icon name={item.icon} size={30} color="#001F54" />
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#001F54',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#001F54'
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600", marginTop: 20 },
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  grid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#001F54',
    borderRadius: 10,
    paddingVertical: 25,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#001F54',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: {
    marginTop: 10,
    color: '#001F54',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
});
