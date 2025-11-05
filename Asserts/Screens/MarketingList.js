import React, { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function MarketingList({ navigation }) {
  const [formData, setFormData] = useState({});
  const [cards, setCards] = useState([{ id: '1' }]);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [editingId, setEditingId] = useState(null); // ✅ Track which card is being edited

  const handleInputChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const addNewCard = () => {
    const newId = Date.now().toString();
    setCards((prev) => [...prev, { id: newId }]);
  };

  const handleRemoveCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    setFormData((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (editingId === id) setEditingId(null);
  };

  const handleEditToggle = (id) => {
    // ✅ Toggle edit mode per card
    setEditingId((prev) => (prev === id ? null : id));
  };

  const filteredCards = cards.filter((card) => {
    const referral = formData[card.id]?.field1?.toLowerCase() || '';
    const project = formData[card.id]?.field2?.toLowerCase() || '';
    const query = searchText.toLowerCase();
    return referral.includes(query) || project.includes(query);
  });

  const renderItem = ({ item }) => {
    const isEditing = editingId === item.id;

    return (
      <View style={{ marginVertical: 10 }}>
        <Card
          style={{
            width: width * 0.9,
            borderRadius: 12,
            backgroundColor: 'white',
            padding: 15,
            alignSelf: 'center',
            shadowColor: '#0C1247',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
            elevation: 6,
          }}>
          {/* Edit & Delete Icons */}
          <View style={{ flexDirection: 'row', position: 'absolute', top: 10, right: 10 }}>
            <TouchableOpacity onPress={() => handleEditToggle(item.id)} style={{ marginRight: 10 }}>
              <Icon
                name={isEditing ? 'check-circle-outline' : 'pencil-outline'}
                size={22}
                color={isEditing ? 'green' : '#0C1247'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRemoveCard(item.id)}>
              <Icon name="trash-can-outline" size={22} color="#FF5C00" />
            </TouchableOpacity>
          </View>

          {/* Card Content */}
          <View style={{ flexDirection: 'column', gap: 15, marginTop: 40 }}>
            <View>
              <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 16 }}>
                Company Name
              </Text>
              <TextInput
                editable={isEditing}
                value={formData[item.id]?.field1 || ''}
                onChangeText={(text) => handleInputChange(item.id, 'field1', text)}
                placeholder="Enter company name"
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  height: 40,
                  backgroundColor: isEditing ? 'white' : '#f2f2f2',
                  borderColor: isEditing ? '#0C1247' : '#ccc',
                }}
              />
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 16 }}>
                Contact No
              </Text>
              <TextInput
                editable={isEditing}
                value={formData[item.id]?.field2 || ''}
                onChangeText={(text) => handleInputChange(item.id, 'field2', text)}
                placeholder="Enter contact number"
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  height: 40,
                  backgroundColor: isEditing ? 'white' : '#f2f2f2',
                  borderColor: isEditing ? '#0C1247' : '#ccc',
                }}
              />
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#0c1247',
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>
          Marketing List
        </Text>
        <TouchableOpacity onPress={() => setShowSearch((prev) => !prev)}>
          <Icon name="magnify" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#0c1247',
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
            margin: 16,
          }}>
          <Icon name="magnify" size={22} color="#0c1247" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by referral or project name"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, fontSize: 16, color: '#0c1247' }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      )}

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              Overview
            </Text>
            <Text style={{ color: '#555' }}>
              You have {filteredCards.length} Client in Digital Marketing
            </Text>
          </View>

          <FlatList
            data={filteredCards}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={addNewCard}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: '#0C1247',
          padding: 16,
          borderRadius: 100,
          elevation: 10,
        }}>
        <Icon name="plus" color="white" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
