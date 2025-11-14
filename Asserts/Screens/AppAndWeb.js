import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function App({ navigation }) {
  const defaultActiveFields = [
    'Project Name 1',
    'Project Name 2',
    'Project Name 3',
    'Project Name 4',
    'Project Name 5',
  ];

  const defaultPastFields = [
    'Completed Campaign',
    'Finalized Report',
    'Closed Client Project',
  ];

  const [activeFields, setActiveFields] = useState([...defaultActiveFields]);
  const [pastFields, setPastFields] = useState([...defaultPastFields]);
  const [formData, setFormData] = useState({});
  const [viewType, setViewType] = useState('Active');
  const [selectedProject, setSelectedProject] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleRemoveField = (fieldToRemove) => {
    const updatedFormData = { ...formData };
    delete updatedFormData[fieldToRemove];

    if (viewType === 'Active') {
      setActiveFields(activeFields.filter((field) => field !== fieldToRemove));
    } else {
      setPastFields(pastFields.filter((field) => field !== fieldToRemove));
    }

    setFormData(updatedFormData);

    if (selectedProject === fieldToRemove) {
      setSelectedProject('');
    }
  };

  const isDefaultField = (index) =>
    viewType === 'Active'
      ? index < defaultActiveFields.length
      : index < defaultPastFields.length;

  const storeProject = async (selectedProject) => {
    try {
      await AsyncStorage.setItem('ProjectName', selectedProject);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Project name stored successfully 🎉',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Storage Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Project name not stored ❌',
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    if (selectedProject) {
      storeProject(selectedProject);
    }
  }, [selectedProject]);

  const currentFields = viewType === 'Active' ? activeFields : pastFields;
  const filteredFields = currentFields.filter((field) =>
    field.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleProjectPress = (placeholder) => {
    // Stay on same screen if same project tapped
    if (selectedProject === placeholder) {
      return;
    }

    setSelectedProject(placeholder);
    const targetScreen = viewType === 'Active' ? 'AWActive' : 'AWPast';
    navigation.navigate(targetScreen);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#0c1247',
          paddingTop: 40,
          paddingBottom: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          App & Web Development
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              const targetScreen = viewType === 'Active' ? 'AWActive' : 'AWPast';
              navigation.navigate(targetScreen);
            }}
          >
            <Icon
              name="plus"
              color="white"
              size={26}
              style={{
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 50,
                padding: 4,
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
                borderRadius: 50,
                padding: 4,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          minHeight: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          alignItems: 'center',
        }}
      >
        {/* TOGGLE BUTTONS */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 15,
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            onPress={() => setViewType('Active')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: viewType === 'Active' ? '#0c1247' : '#e0e0e0',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: viewType === 'Active' ? 'white' : '#0c1247',
                fontWeight: 'bold',
              }}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewType('Past')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: viewType === 'Past' ? '#0c1247' : '#e0e0e0',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: viewType === 'Past' ? 'white' : '#0c1247',
                fontWeight: 'bold',
              }}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View
          style={{
            width: '100%',
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#0c1247',
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        >
          <Icon name="magnify" size={24} color="#0c1247" style={{ marginRight: 8 }} />
          <TextInput
            style={{
              flex: 1,
              height: 45,
              fontSize: 16,
              color: '#0c1247',
            }}
            placeholder={`Search ${viewType} Projects`}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* PROJECT LIST */}
        {filteredFields.map((placeholder, index) => {
          const isSelected = selectedProject === placeholder;
          const isDefault = isDefaultField(currentFields.indexOf(placeholder));

          return (
            <TouchableOpacity
              key={`${placeholder}-${index}`}
              style={{ width: '100%', marginBottom: 15 }}
              onPress={() => handleProjectPress(placeholder)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isSelected ? ['#E77D41', '#FFFFFF'] : ['#FFFFFF', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#0c1247',
                  borderWidth: 1.5,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  elevation: 3,
                  shadowColor: '#0c1247',
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              >
                <Icon
                  name="file-document"
                  size={22}
                  color={isSelected ? 'white' : '#0c1247'}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    color: isSelected ? 'white' : '#0c1247',
                    fontSize: 16,
                    fontWeight: '500',
                    flex: 1,
                  }}
                >
                  {placeholder}
                </Text>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={isSelected ? 'white' : '#0c1247'}
                />
                {!isDefault && (
                  <TouchableOpacity onPress={() => handleRemoveField(placeholder)}>
                    <Icon
                      name="delete"
                      size={22}
                      color={isSelected ? 'white' : 'red'}
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
