import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Toast from "react-native-toast-message";
const HEADER_HEIGHT = 250;
const screenHeight = Dimensions.get('window').height;

export default function App({ navigation }) {
  const defaultFields = [
    'Referral Name',
    'Project Details',
    'Project Name',
    'Referred Person',
    'Cost Percentage',
    'Budget',
  ];

  const [inputFields, setInputFields] = useState([...defaultFields]);
  const [formData, setFormData] = useState({});
  const [isAddingField, setIsAddingField] = useState(false);
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddFieldConfirm = () => {
    const trimmed = newPlaceholder.trim();

    if (!trimmed) {
      Toast.show({
        type: "error",
        text1: "Invalid Field ⚠️",
        text2: "Please enter a valid placeholder name.",
      });
      return;
    }

    if (inputFields.includes(trimmed)) {
      Toast.show({
        type: "info",
        text1: "Duplicate Field ℹ️",
        text2: "A field with this name already exists.",
      });
      return;
    }

    setInputFields([...inputFields, trimmed]);
    setNewPlaceholder("");
    setIsAddingField(false);

    Toast.show({
      type: "success",
      text1: "Field Added ✅",
      text2: "New input field has been added successfully.",
    });
  };

  const handleRemoveField = (fieldToRemove) => {
    const updatedFields = inputFields.filter((field) => field !== fieldToRemove);
    const updatedFormData = { ...formData };
    delete updatedFormData[fieldToRemove];
    setInputFields(updatedFields);
    setFormData(updatedFormData);
  };

  const selectProfileImage = () => {
    Alert.alert('Upload Profile Picture', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => {
          launchCamera({ mediaType: 'photo', cameraType: 'front', saveToPhotos: true, quality: 0.7 },
            (response) => {
              if (response.didCancel || response.errorCode) return;
              if (response.assets?.length > 0) {
                setProfileImage(response.assets[0].uri);
              }
            }
          );
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo', quality: 0.7 },
            (response) => {
              if (response.didCancel || response.errorCode) return;
              if (response.assets?.length > 0) {
                setProfileImage(response.assets[0].uri);
              }
            }
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0c1247' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={{ height: 250, padding: 20, justifyContent: 'space-between' }}>
          {/* Top Right Icons */}
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              backgroundColor: '#0c1247',
              borderColor: 'white',
              borderWidth: 2,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              elevation: 10,
              shadowColor: 'white',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              marginTop: 40,
            }}
          >
            <TouchableOpacity onPress={() => setIsAddingField(true)}>
              <Icon
                name="plus"
                color="white"
                size={26}
                style={{
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 100,
                  padding: 3,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Icon
                name="bell"
                color="white"
                size={26}
                style={{
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 100,
                  padding: 3,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={selectProfileImage}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: '#FF5C00',
                  }}
                />
              ) : (
                <Image
                  source={require('../Images/Profile1.png')}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: '#0C1247',
                  }}
                />
              )}
            </TouchableOpacity>
            <Text style={{ marginTop: 8, fontSize: 16, color: 'white', fontWeight: 'bold' }}>
              Referred Name
            </Text>
          </View>


        </View>

        {/* White Card */}
        <View style={{
          backgroundColor: 'white',
          minHeight: screenHeight - HEADER_HEIGHT,
          width: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          alignItems: 'center',
        }}>
          {inputFields.map((placeholder, index) => (
            <View key={placeholder} style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              width: '100%',
              borderColor: '#0c1247',
              borderWidth: 1.5,
              borderRadius: 10,
              paddingHorizontal: 10,
              elevation: 5,
              shadowColor: '#0c1247',
              shadowOffset: { width: 3, height: 3 },
              shadowRadius: 4,
              marginBottom: 20,
            }}>
              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  fontSize: 18,
                  color: '#0c1247',
                  textAlign: 'center',
                }}
                placeholder={placeholder}
                placeholderTextColor="#0C1247"
                onChangeText={(text) => handleInputChange(placeholder, text)}
                value={formData[placeholder] || ''}
              />
              {index >= defaultFields.length && (
                <TouchableOpacity onPress={() => handleRemoveField(placeholder)}>
                  <Icon name="delete" size={24} color="red" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {isAddingField && (
            <View style={{
              width: '100%',
              marginBottom: 20,
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              borderColor: '#0c1247',
              borderWidth: 1,
            }}>
              <Text style={{ marginBottom: 5, fontWeight: 'bold', color: '#0c1247' }}>
                Enter Field Placeholder
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  textAlign: 'center',
                }}
                placeholder="Enter New Placeholder Text"
                placeholderTextColor="#889783"
                value={newPlaceholder}
                onChangeText={setNewPlaceholder}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#0c1247',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    flex: 1,
                    marginRight: 5,
                  }}
                  onPress={handleAddFieldConfirm}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>✔ Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#aaa',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    flex: 1,
                    marginLeft: 5,
                  }}
                  onPress={() => {
                    setIsAddingField(false);
                    setNewPlaceholder('');
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>✖ Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: '#FF5C00',
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 30,
              marginTop: 10,
              width: '50%',
              alignItems: 'center',
              elevation: 5,
            }}
            onPress={() => navigation.navigate('MarketingList')}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
