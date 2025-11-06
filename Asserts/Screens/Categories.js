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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const defaultData = [
  { id: '1', title: 'Marketing', nav: 'MarketingList', isRemovable: false },
  { id: '2', title: 'Clients', nav: 'Clients', isRemovable: false },
  { id: '3', title: 'Digital Marketing', nav: 'DigitalMaketing', isRemovable: false },
  { id: '4', title: 'App & Web Development', nav: 'AppAndWeb', isRemovable: false },
  { id: '5', title: 'App Development', nav: 'AppDevelopment', isRemovable: false },
  { id: '6', title: 'Web Development', nav: 'WebDevelopment', isRemovable: false },
  { id: '7', title: 'Employee', nav: 'Employees', isRemovable: false },
];

const iconMap = {
  Marketing: 'bullhorn',
  Clients: 'account-group',
  'Digital Marketing': 'chart-line',
  'App & Web Development': 'web',
  'App Development': 'cellphone',
  'Web Development': 'laptop',
  Employee: 'account-tie',
};

export default function Categories({ navigation, route }) {
  const { role } = route.params || {};
  const isAdmin = role === 'admin';

  const [cards, setCards] = useState(defaultData);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const addNewCard = () => {
    if (!newCardTitle.trim()) return;

    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle.trim(),
      nav: 'CustomScreen',
      isRemovable: true,
    };

    setCards([...cards, newCard]);
    setNewCardTitle('');
    setModalVisible(false);
  };

  const removeCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const visibleCards = isAdmin
    ? cards
    : cards.filter((card) => card.title.toLowerCase() === 'employee');

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;
    const iconName = iconMap[item.title] || 'folder';

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item.id);
          navigation.navigate(item.nav);
        }}
        style={{ width: '48%', marginBottom: 15 }}
      >
        <Card
          style={{
            height: 120,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isSelected ? '#0c1247' : 'white',
            padding: 10,
            borderWidth: 2,
            borderColor: isSelected ? 'white' : '#0c1247',
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
            <Icon
              name={iconName}
              size={30}
              color={isSelected ? 'white' : '#0c1247'}
              style={{ marginBottom: 10 }}
            />
          </View>

          <Text
            style={{
              fontSize: 15,
              textAlign: 'center',
              color: isSelected ? 'white' : '#0c1247',
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

  // ✅ Fixed Back Button Logic
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused()) {
          // Exit app only on this home screen
          BackHandler.exitApp();
          return true;
        } else {
          // Go back if on any other screen
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
        <Icon
          onPress={() => navigation.navigate('Notification')}
          name="bell"
          size={30}
          color="white"
          style={{ marginTop: 20 }}
        />
      </View>

      {/* Grid */}
      <ScrollView>
        <View style={{ padding: 10 }}>
          <FlatList
            data={visibleCards}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
          />
        </View>
      </ScrollView>

      {/* Modal for Adding Cards */}
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
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#0c1247' }}
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
    </View>
  );
}
