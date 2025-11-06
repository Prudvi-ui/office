import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NotificationScreen({ route, navigation }) {
  const { notifications } = route.params || {};

  // ✅ Default notifications (when none are passed)
  const defaultNotifications = [
    {
      message: 'Your salary for October has been credited.',
      until: 'Nov 10, 2025',
    },
    {
      message: 'Team meeting scheduled at 11:00 AM tomorrow.',
      until: 'Nov 6, 2025',
    },
    {
      message: 'New HR policy update available. Please review it.',
      until: 'Nov 8, 2025',
    },
    {
      message: 'You have 2 pending leave requests awaiting approval.',
      until: 'Nov 12, 2025',
    },
    {
      message: 'System maintenance planned this weekend.',
      until: 'Nov 9, 2025',
    },
  ];

  // ✅ Use passed notifications if available, otherwise show default
  const displayNotifications =
    notifications && notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#001F54' }}>
      {/* 🔹 Header Section */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: '#001F54',
          // borderBottomWidth: 1,
          borderColor: '#eee',
          elevation: 3,
          marginTop: 20
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#fff',
            marginLeft: 16,
          }}
        >
          Notifications
        </Text>
      </View>

      {/* 🔹 Notifications List */}
      <ScrollView style={{ flex: 1, backgroundColor: '#001F54', padding: 16 }}>
        {displayNotifications.map((note, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: '#ffeaea',
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
              shadowColor: '#0c1247',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text style={{ color: '#0c1247', fontSize: 15 }}>
              {note.message}
            </Text>
            <Text style={{ color: '#555', fontSize: 12, marginTop: 4 }}>
              Until: {note.until}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
