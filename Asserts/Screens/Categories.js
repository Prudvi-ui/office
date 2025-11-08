import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Modal,
  BackHandler,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const defaultData = [
  { id: '1', title: 'Marketing', nav: 'MarketingList', isRemovable: false },
  { id: '2', title: 'Clients', nav: 'Clients', isRemovable: false },
  { id: '3', title: 'WordPress', nav: 'wordpress', isRemovable: false },
  { id: '4', title: 'App & Web Development', nav: 'AppAndWeb', isRemovable: false },
  { id: '5', title: 'App Development', nav: 'AppDevelopment', isRemovable: false },
  { id: '6', title: 'Web Development', nav: 'WebDevelopment', isRemovable: false },
  { id: '7', title: 'Employee', nav: 'Employees', isRemovable: false },
  { id: '8', title: 'Domain', nav: 'Domain', isRemovable: false },
];

const iconMap = {
  Marketing: 'bullhorn',
  Clients: 'account-group',
  WordPress: 'wordpress',
  'App & Web Development': 'web',
  'App Development': 'cellphone',
  'Web Development': 'laptop',
  Employee: 'account-tie',
  Domain: 'domain',
};

export default function Categories({ navigation, route }) {
  // ✅ Ensure route.params always exists
  const params = route?.params || {};
  const isAdmin = params.role === 'admin';

  const [cards, setCards] = useState(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  // ✅ Add new card
  const addNewCard = () => {
    if (!newCardTitle.trim()) {
      Alert.alert('Validation', 'Please enter a card title.');
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

  // ✅ BackHandler (always runs)
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

  // ✅ Logout
  const handleLogout = () => {
    Alert.alert('Logout Confirmation', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  // ✅ Card renderer
  const renderItem = ({ item }) => {
    const iconName = iconMap[item.title] || 'folder';
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(item.nav)}
        style={{ width: '48%', marginBottom: 15 }}
      >
        <Card
          style={{
            height: 120,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: 10,
            borderWidth: 2,
            borderColor: '#0c1247',
            ...Platform.select({
              ios: {
                shadowColor: '#0c1247',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
              android: {
                elevation: 6,
              },
            }),
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={iconName} size={30} color="#0c1247" style={{ marginBottom: 10 }} />
          </View>

          <Text
            style={{
              fontSize: 15,
              textAlign: 'center',
              color: '#0c1247',
              fontWeight: 'bold',
            }}
          >
            {item.title}
          </Text>

          {item.isRemovable && isAdmin && (
            <TouchableOpacity
              onPress={() => removeCard(item.id)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                padding: 4,
              }}
            >
              <Icon name="trash-can" size={20} color="#ff3b3b" />
            </TouchableOpacity>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0c1247' }}>
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
        <View style={{ padding: 10 }}>
          <FlatList
            data={cards}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
          />
        </View>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#0c1247',
              }}
            >
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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
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

      {/* Floating Add Button for Admin */}
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
