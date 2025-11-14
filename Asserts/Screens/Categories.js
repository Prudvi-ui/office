import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ✅ Default Cards
const defaultData = [
  { id: '1', title: 'Marketing', nav: 'MarketingList', isRemovable: false },
  { id: '2', title: 'Clients', nav: 'Clients', isRemovable: false },
  { id: '3', title: 'Digital marketing payments', nav: 'wordpress', isRemovable: false },
  { id: '4', title: 'App & Web Development', nav: 'AppAndWeb', isRemovable: false },
  { id: '5', title: 'App Development', nav: 'AppDevelopment', isRemovable: false },
  { id: '6', title: 'Web Development', nav: 'WebDevelopment', isRemovable: false },
  { id: '7', title: 'Employee', nav: 'Employees', isRemovable: false },
  { id: '8', title: 'Domain', nav: 'Domain', isRemovable: false },
];

// ✅ Icon mapping
const iconMap = {
  Marketing: 'bullhorn',
  Clients: 'account-group',
  'Digital marketing payments': 'google-ads',
  'App & Web Development': 'web',
  'App Development': 'cellphone',
  'Web Development': 'laptop',
  Employee: 'account-tie',
  Domain: 'domain',
};

export default function Categories({ navigation, route }) {
  const params = route?.params || {};
  const isAdmin = params.role === 'admin';

  const [cards, setCards] = useState(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [activeCard, setActiveCard] = useState(null);

  // ✅ Add new card
  const addNewCard = () => {
    if (!newCardTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation',
        text2: 'Please enter a card title.',
        position: 'bottom',
      });
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle.trim(),
      nav: 'CustomScreen',
      isRemovable: true,
    };

    setCards((prev) => [...prev, newCard]);
    setNewCardTitle('');
    setModalVisible(false);
  };

  // ✅ Remove card
  const removeCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  // ✅ Logout Modal Handler
  const handleLogout = async () => setLogoutModalVisible(true);
  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  // ✅ Back handler
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
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [navigation])
  );

  // ✅ Render each card
  const renderItem = ({ item }) => {
    const iconName = iconMap[item.title] || 'folder';
    const isActive = activeCard === item.id;

    return (
      <TouchableOpacity
        onPress={() => {
          setActiveCard(item.id);
          navigation.navigate(item.nav);
        }}
        style={{ width: '48%', marginBottom: 15 }}
      >
        <Card
          style={{
            height: 120,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive ? '#0c1247' : 'white',
            padding: 10,
            borderWidth: 1,
            borderColor: 'rgba(0, 20, 70, 0.25)',
            // LEFT border
            borderLeftWidth: 2,
            borderLeftColor: '#001F54',

            // RIGHT border
            borderRightWidth: 8,
            borderRightColor: '#001F54',

            // BOTTOM border (if you want)
            borderBottomWidth: 7,
            borderBottomColor: '#082049ff',
            borderTopWidth: 2,
            borderTopColor: '#082049ff',
            // Shadow
            shadowColor: '#160534ff',
            shadowOffset: { width: 8, height: 10 },
            shadowOpacity: 0.45,
            shadowRadius: 14,
            elevation: 20,
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              name={iconName}
              size={30}
              color={isActive ? 'white' : '#E77D41'}
              style={{ marginBottom: 10 }}
            />
          </View>

          <Text
            style={{
              fontSize: 15,
              textAlign: 'center',
              color: isActive ? 'white' : '#0c1247',
              fontWeight: 'bold',
            }}
          >
            {item.title}
          </Text>

          {item.isRemovable && isAdmin && (
            <TouchableOpacity
              onPress={() => removeCard(item.id)}
              style={{ position: 'absolute', top: 10, right: 10, padding: 4 }}
            >
              <Icon name="trash-can" size={20} color="#ff3b3b" />
            </TouchableOpacity>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
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
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="power-standby" size={30} color="white" style={{ marginTop: 20 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Icon name="bell" size={30} color="white" style={{ marginTop: 20 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cards */}
      <ScrollView>
        <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 15 }}>
          <FlatList
            data={cards}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 15, // GAP between rows
            }}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          />
        </View>
      </ScrollView>

      {/* Add New Card Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '85%',
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#0c1247' }}>
              Add New Card
            </Text>

            <TextInput
              placeholder="Enter card title"
              value={newCardTitle}
              onChangeText={setNewCardTitle}
              style={{
                borderWidth: 1,
                borderColor: '#0c1247',
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: '#ccc',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#333' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addNewCard}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: '#0c1247',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Logout Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Icon name="logout" size={40} color="red" />
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setLogoutModalVisible(false)}
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

      {/* Floating Add Button */}
      {isAdmin && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 20,
            backgroundColor: '#0c1247',
            borderRadius: 30,
            padding: 15,
            elevation: 5,
          }}
        >
          <Icon name="plus" size={25} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ✅ Styles
const styles = {
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
};
