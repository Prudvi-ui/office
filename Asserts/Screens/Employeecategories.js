import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function CategoriesScreen({ navigation }) {
  const [activeId, setActiveId] = useState(null);

  const categories = [
    { id: 1, name: 'Employee Profile', icon: 'account-tie', nav: 'Epmprofile' },
    { id: 2, name: 'Attendance', icon: 'calendar-account', nav: 'Employeeattendance' },
    { id: 3, name: 'Leave Management', icon: 'calendar-clock', nav: 'Leaverequest' },
    { id: 4, name: 'Projects', icon: 'folder-account', nav: 'Projects' },
    { id: 5, name: 'Tasks', icon: 'clipboard-check-outline', nav: 'Emptasks' },
    { id: 8, name: 'Holidays', icon: 'calendar-star', nav: 'holiday' },
    { id: 9, name: 'Notices', icon: 'bullhorn-outline', nav: 'Notices' },
    { id: 10, name: 'Support', icon: 'headset', nav: 'Support' },
    { id: 11, name: 'Performance', icon: 'chart-line', nav: 'Performance' },
    { id: 12, name: 'Settings', icon: 'cog-outline', nav: 'Settings' },
  ];

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
          return true;
        } else {
          navigation.goBack();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#001F54" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}></Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Employee Categories</Text>

        <Text style={styles.headerTitle}></Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {categories.map((item) => {
            const isActive = activeId === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  isActive && styles.activeCard, // remove shadow when active
                  {
                    backgroundColor: isActive ? '#0c1247' : '#fff',
                    borderColor: isActive ? '#0c1247' : '#001F54',
                  },
                ]}
                onPress={() => {
                  setActiveId(item.id);
                  navigation.navigate(item.nav);
                }}
                activeOpacity={0.8}
              >
                <Icon
                  name={item.icon}
                  size={30}
                  color={isActive ? '#fff' : '#E77D41'}
                />

                <Text
                  style={[
                    styles.cardText,
                    { color: isActive ? '#fff' : '#001F54' },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#001F54',
  },

  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },

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

  // DEFAULT CARD — shadow visible
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 25,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',

    // Thin border around card
    borderWidth: 1,
    borderColor: 'rgba(0, 20, 70, 0.25)',

    // Thick left border
    // LEFT border
    borderLeftWidth: 2,
    borderLeftColor: '#001F54',

    // RIGHT border
    borderRightWidth: 8,
    borderRightColor: '#001F54',

    // BOTTOM border (if you want)
    borderBottomWidth: 6,
    borderBottomColor: '#082049ff',
    borderTopWidth: 2,
    borderTopColor: '#082049ff',
    // Shadow
    shadowColor: '#160534ff',
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 20,
  },


  // ACTIVE CARD — shadow removed
  activeCard: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  cardText: {
    marginTop: 10,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
});
