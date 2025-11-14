import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Referralhome({ navigation }) {
  const categories = [
    { id: 1, name: 'Profile', icon: 'account-tie', nav: 'Referralprofile' },
    // { id: 2, name: 'Domain', icon: 'web', nav: 'Domaindetails' nav: 'Referralprofile' },
    // { id: 3, name: 'Hosting', icon: 'server', nav: 'Hostingdetails' },
    // { id: 4, name: 'SSL', icon: 'lock', nav: 'Ssldetails' },
  ];

  const [activeCard, setActiveCard] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await AsyncStorage.clear();
    navigation.replace('Login'); // ✅ use replace to prevent going back
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✅ Status Bar & Header */}
      <View
        style={{
          height: 80,
          backgroundColor: '#0c1247',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 20 }}>
          Dashboard
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
            <Icon name="power-standby" size={30} color="white" style={{ marginTop: 20 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Icon name="bell" size={30} color="white" style={{ marginTop: 20 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Category Grid */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {categories.map((item) => {
            const isActive = activeCard === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  isActive && { backgroundColor: '#0c1247', borderColor: '#0c1247' },
                ]}
                onPress={() => {
                  setActiveCard(item.id);
                  navigation.navigate(item.nav);
                }}
                activeOpacity={0.8}
              >
                <Icon
                  name={item.icon}
                  size={30}
                  color={isActive ? 'white' : '#001F54'}
                />
                <Text style={[styles.cardText, isActive && { color: 'white' }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 🚀 Logout Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Icon name="logout" size={40} color="red" />
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={{ color: '#000', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: 'red' }]}
                onPress={confirmLogout}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
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

  cardText: {
    marginTop: 10,
    color: '#001F54',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },

  // 🔥 Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c1247',
    marginTop: 10,
  },
  modalText: {
    fontSize: 15,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});
